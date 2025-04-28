the whole project code can be found in [sj-trading](https://github.com/Sinotrade/sj-trading-demo), the whole example jupyter notebook can be found in [quote_manager_usage](https://github.com/Sinotrade/sj-trading-demo/blob/main/quote_manager_usage.ipynb).

this project is created by using `uv`, if you are not familiar with how to use `uv` to create a project and manage dependencies, it is recommended to learn from the [environment setup](../../../env_setup/) chapter.

before start writing the quote manager, we will use the Polars package to process the quote data, so we need to add it to the project dependencies, at the same time, this tutorial will have an example of how to use Polars to quickly calculate technical indicators for multiple commodities, so we also need to add the polars_talib package to the project dependencies.

add Polars dependencies

```
uv add polars polars_talib

```

if you are not familiar with Polars, you can refer to the [Polars official documentation](https://docs.pola.rs/user-guide/getting-started/) to learn how to use it.

polars_talib is a Polars extension package that provides the complete functionality of the ta-lib library in the polars expression version, allowing us to easily calculate technical indicators using Polars. It is developed by the shioaji author, and detailed usage can be found in [polars_ta_extension](https://github.com/Yvictor/polars_ta_extension).

Polars is an efficient DataFrame package that is suitable for processing large amounts of data and can use multiple cores without any additional configuration. In this example, we can see how to use the Shioaji quote manager to obtain quote data, and use Polars for parallel computation, while converting the ticks of the commodity into K lines, and performing parallel multi-commodity technical indicator calculations.

add quote.py

add `quote.py` file in `src/sj_trading/`, and add the following code

```
import shioaji as sj
from typing import List

class QuoteManager:
    def __init__(self, api: sj.Shioaji):
        self.api = api
        self.api.quote.set_on_tick_stk_v1_callback(self.on_stk_v1_tick_handler)
        self.api.quote.set_on_tick_fop_v1_callback(self.on_fop_v1_tick_handler)
        self.ticks_stk_v1: List[sj.TickSTKv1] = []
        self.ticks_fop_v1: List[sj.TickFOPv1] = []

    def on_stk_v1_tick_handler(self, _exchange: sj.Exchange, tick: sj.TickSTKv1):
        self.ticks_stk_v1.append(tick)

    def on_fop_v1_tick_handler(self, _exchange: sj.Exchange, tick: sj.TickFOPv1):
        self.ticks_fop_v1.append(tick)

```

this part is relatively simple, let the handle func of receiving the quote data do as little as possible, we define a `QuoteManager` class, and register two callback functions in the initialization, respectively `on_stk_v1_tick_handler` and `on_fop_v1_tick_handler`, these two functions will be called when receiving the quote data, and the quote data will be stored in `ticks_stk_v1` and `ticks_fop_v1`.

add `QuoteManager` subscribe and unsubscribe methods

```
def __init__(self, api: sj.Shioaji):
    # skip
    self.subscribed_stk_tick: Set[str] = set()

def subscribe_stk_tick(self, codes: List[str], recover: bool = False):
    for code in codes:
        contract = self.api.Contracts.Stocks[code]
        if contract is not None and code not in self.subscribed_stk_tick:
            self.api.quote.subscribe(contract, "tick")
            self.subscribed_stk_tick.add(code)

def unsubscribe_stk_tick(self, codes: List[str]):
    for code in codes:
        contract = self.api.Contracts.Stocks[code]
        if contract is not None and code in self.subscribed_stk_tick:
            self.api.quote.unsubscribe(contract, "tick")
            self.subscribed_stk_tick.remove(code)

def unsubscribe_all_stk_tick(self):
    for code in self.subscribed_stk_tick:
        contract = self.api.Contracts.Stocks[code]
        if contract is not None:
            self.api.quote.unsubscribe(contract, "tick")
    self.subscribed_stk_tick.clear()

```

in the above code, we have added the `subscribe_stk_tick` method, this method will add the commodity codes in the incoming commodity code list to the `subscribed_stk_tick`, and call the `subscribe` method of Shioaji to subscribe to the market, `subscribed_stk_tick` is a `Set`, used to store the commodity codes that have been subscribed to avoid duplicate subscriptions and facilitate subsequent unsubscribing all subscribed commodities.

add `QuoteManager` get ticks method

```
def __init__(self, api: sj.Shioaji):
    # skip
    self.df_stk: pl.DataFrame = pl.DataFrame(
        [],
        schema=[
            ("datetime", pl.Datetime),
            ("code", pl.Utf8),
            ("price", pl.Float64),
            ("volume", pl.Int64),
            ("tick_type", pl.Int8),
        ],
    )

def get_df_stk(self) -> pl.DataFrame:
    poped_ticks, self.ticks_stk_v1 = self.ticks_stk_v1, []
    if poped_ticks:
        df = pl.DataFrame([tick.to_dict() for tick in poped_ticks]).select(
            pl.col("datetime", "code"),
            pl.col("close").cast(pl.Float64).alias("price"),
            pl.col("volume").cast(pl.Int64),
            pl.col("tick_type").cast(pl.Int8),
        )
        self.df_stk = self.df_stk.vstack(df)
    return self.df_stk

```

in `__init__` we define a `df_stk` Polars DataFrame, used to store all subscribed stock tick data, `get_df_stk` method will convert the `ticks_stk_v1` list to a Polars DataFrame, and return it, at this point, we have already got a DataFrame that can be used to calculate technical indicators.

add `QuoteManager` get kbar method

```
def get_df_stk_kbar(
    self, unit: str = "1m", exprs: List[pl.Expr] = []
) -> pl.DataFrame:
    df = self.get_df_stk()
    df = df.group_by(
        pl.col("datetime").dt.truncate(unit),
        pl.col("code"),
        maintain_order=True,
    ).agg(
        pl.col("price").first().alias("open"),
        pl.col("price").max().alias("high"),
        pl.col("price").min().alias("low"),
        pl.col("price").last().alias("close"),
        pl.col("volume").sum().alias("volume"),
    )
    if exprs:
        df = df.with_columns(exprs)
    return df

```

in `get_df_stk_kbar` method, we will use `get_df_stk` method to get the Ticks DataFrame and then group the data by truncated `datetime` and `code`, and then aggregate the data in each group to get the K line data, finally, we will return the K line DataFrame. Here we remain the `exprs` parameter, allowing users to pass in additional expressions for more calculations.

In this part, we use `1m` to represent 1 minute, if you want to get 5 minutes K line, you can change the unit to `5m`, 1 hour K line can be changed to `1h`, if you want more different units, you can refer to the [truncate](https://docs.pola.rs/api/python/stable/reference/expressions/api/polars.Expr.dt.truncate.html) API documentation.

add custom technical indicator calculation method

```
import polars as pl
import polars_talib as plta

quote_manager.get_df_stk_kbar("5m", [
    pl.col("close").ta.ema(5).over("code").fill_nan(None).alias("ema5"),
    plta.macd(pl.col("close"), 12, 26, 9).over("code").struct.field("macd").fill_nan(None),
])

```

in this part, we use polars_ta to calculate technical indicators and add them to the K line data, here we calculate `ema` and `macd` two indicators, more indicators can refer to [polars_ta_extension supported indicators list](https://github.com/Yvictor/polars_ta_extension?tab=readme-ov-file#supported-indicators-and-functions).

in this polars_ta expression, we use `over("code")` to group the data by commodity code for independent calculation of each commodity, so even if all commodities are in the same DataFrame, the calculation results are independent of each other, and this `over` partition is automatically parallel computing, so even if there are a large number of commodities, the calculation can be very fast and then using `alias` to set the field name of the calculation result as `ema5`, in the `macd` indicator, the return is a struct with multiple fields, and this part gets the `macd` field.

because this part only passes in expressions and is very lightweight, you can pass in any expressions you need according to your needs, and you can also make your own indicators using polars expression, this part just provides an interface for calculation and a simple usage example.

add `QuoteManager` backfill missed ticks method

```
def fetch_ticks(self, contract: BaseContract) -> pl.DataFrame:
    code = contract.code
    ticks = self.api.ticks(contract)
    df = pl.DataFrame(ticks.dict()).select(
        pl.from_epoch("ts", time_unit="ns").dt.cast_time_unit("us").alias("datetime"),
        pl.lit(code).alias("code"),
        pl.col("close").alias("price"),
        pl.col("volume").cast(pl.Int64),
        pl.col("tick_type").cast(pl.Int8),
    )
    return df

def subscribe_stk_tick(self, codes: List[str], recover: bool = False):
    for code in codes:
        # skop
        if recover:
            df = self.fetch_ticks(contract)
            if not df.is_empty():
                code_ticks = [t for t in self.ticks_stk_v1 if t.code == code]
                if code_ticks:
                    t_first = code_ticks[0].datetime
                    df = df.filter(pl.col("datetime") < t_first)
                    self.df_stk = self.df_stk.vstack(df)
                else:
                    self.df_stk = self.df_stk.vstack(df)

```

in `subscribe_stk_tick` method, we will check if the `recover` parameter is true, if it is, we will call `fetch_ticks` method to get the historical ticks data, and then use `filter` method to filter out the ticks data that have been received, and use `vstack` method to add the historical ticks data to the `df_stk` DataFrame.

In above we have completed a quote manager that can subscribe to market data, backfill missed ticks, and calculate technical indicators. Next, we will integrate all the code and use it in a jupyter lab environment.

The complete QuoteManager can be found in [quote.py](https://github.com/Sinotrade/sj-trading-demo/blob/main/src/sj_trading/quote.py).

The complete example jupyter notebook can be found in [quote_manager_usage](https://github.com/Sinotrade/sj-trading-demo/blob/main/quote_manager_usage.ipynb).
