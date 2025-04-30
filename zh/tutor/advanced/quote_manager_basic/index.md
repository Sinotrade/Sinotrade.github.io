本篇教學完整專案的程式碼可以參考 [sj-trading](https://github.com/Sinotrade/sj-trading-demo)， 完整使用範例 jupyter notebook 可以參考 [quote_manager_usage](https://github.com/Sinotrade/sj-trading-demo/blob/main/quote_manager_usage.ipynb)。

本專案是使用 `uv` 建立的，如果還不熟悉如何使用 `uv` 建立專案並使用 `uv` 管理依賴，建議回到 [環境設定](../../../env_setup/) 章節從頭學習起。

在開始進行行情管理器的編寫前，我們會使用 Polars 這個套件來處理行情資料，所以需要將它加入專案的依賴中，同時本篇教學中會有如何用 Polars 快速對多商品計算技術指標的範例，所以也需要將 polars_talib 這個套件加入專案的依這個。

新增 Polars 依賴

```
uv add polars polars_talib

```

如果你對 Polars 不熟悉，可以參考 [Polars 官方文件](https://docs.pola.rs/user-guide/getting-started/) 來了解該如何使用他。

polars_talib 是一個 Polars 的擴充套件，它提供了 polars expression 版本的 ta-lib 完整功能，讓我們可以很方便的用 Polars 進行技術指標的計算，他是由 shioaji 作者開發的，詳細使用可以參考 [polars_ta_extension](https://github.com/Yvictor/polars_ta_extension)。

Polars 是一個高效的 DataFrame 套件，適合用來處理大量資料，並且不需要任何額外的設定，就可以使用多核心來加速資料處理。這篇範例中我們可以看到如何使用 Shioaji 的行情管理器來取得行情資料，並且使用 Polars 來做並行化運算，同時將商品的 ticks 進行分 K 轉換，並且做平行化的多商品技術指標計算。

新增 quote.py

在 `src/sj_trading/` 新增 `quote.py` 檔案，並且新增以下程式碼

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

這個部分比較單純，讓收到行情的 handle func 盡可能地做最少的事，我們定義了一個 `QuoteManager` 類別，並且在初始化時設定了註冊兩個回調函數，分別是 `on_stk_v1_tick_handler` 和 `on_fop_v1_tick_handler`，這兩個函數會在接收到行情資料時被呼叫，並且將行情資料存入 `ticks_stk_v1` 和 `ticks_fop_v1` 中。

增加 `QuoteManager` 訂閱與取消訂閱的方法

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

上面我們增加了 `subscribe_stk_tick` 方法，這個方法會將傳入的商品代碼列表中的商品代碼加入到 `subscribed_stk_tick` 中，並且呼叫 Shioaji 的 `subscribe` 方法來訂閱行情，`subscribed_stk_tick` 是一個 `Set`，用來存放已經訂閱的商品代碼，避免重複訂閱以及方便後續將所有訂閱商品取消訂閱。

增加 `QuoteManager` 拿出訂閱的 ticks 的方法

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

`__init__` 中我們定義了一個 `df_stk` 的 Polars DataFrame，用來存放所有訂閱的台股 tick 資料，`get_df_stk` 方法會將 `ticks_stk_v1` 中的資料轉換成 Polars DataFrame，並且回傳，到這邊我們就已經可以初步看到可以拿出來的 DataFrame 了。

增加 `QuoteManager` 將 ticks 轉換成 K 線的方法

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

在 `get_df_stk_kbar` 方法中，我們將 `get_df_stk` 拿到 Ticks 的 DataFrame 根據 code 和 truncate 後的 datetime 進行分組，並且對每個分組進行聚合開高低收量，最後回傳一個新的 DataFrame，這個 DataFrame 就是我們所需要的 K 線資料了，並且這邊保留了 `exprs` 參數，讓使用者可以傳入一些額外的運算式，來進行更多的運算。 在這邊 truncate 的單位我們使用 `1m` 來表示 1 分鐘，如果想要拿到 5 分鐘的 K 線，可以將單位改成 `5m`， 1 小時 K 可以將單位改成 `1h`，如果想要更多不同的單位可以參考 [truncate](https://docs.pola.rs/api/python/stable/reference/expressions/api/polars.Expr.dt.truncate.html) 的 API 文件。

自定義技術指標計算

```
import polars as pl
import polars_talib as plta

quote_manager.get_df_stk_kbar("5m", [
    pl.col("close").ta.ema(5).over("code").fill_nan(None).alias("ema5"),
    plta.macd(pl.col("close"), 12, 26, 9).over("code").struct.field("macd").fill_nan(None),
])

```

在這邊使用 polars_ta 的 expression 來計算技術指標，並且將計算出來的指標加入到 K 線資料中，這邊我們計算了 `ema` 和 `macd` 兩種指標，更多指標可以參考 [polars_ta_extension 支援指標列表](https://github.com/Yvictor/polars_ta_extension?tab=readme-ov-file#supported-indicators-and-functions)。

在這個 polars_ta 的 expression 中，使用 `over("code")` 來將指標計算結果根據商品代碼進行分組做每個商品獨立的運算 ，所以即使所有的商品都在同一個 DataFrame 中，計算出來的結果還是每個商品獨立的，並且這個 `over` 的 partition 是會自動平行運算的，所以即使有大量的商品，也可以很快的計算出來，使用 `alias` 來將計算結果的欄位名稱設置為 `ema5`，在 `macd` 指標中回傳的是多個欄位的 struct ，這邊取出 struct 中的 macd 欄位。

因為這邊傳入的只是表達式非常輕量，可以根據你需要的任何表達式進行新增就可以看到你需要的各種技術指標了，當然如果你要使用 polars expression 做出自己的指標，也是可以的，這邊只是提供一個可以做運算的接口以及簡單的使用範例。

回補錯過的行情

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

在訂閱的時候我們可能會超過當天開盤的時間，這時候訂閱即時資料將會缺乏錯過的資料，所以這邊我們實作使用 api 回補歷史 tick 的資料，這邊我們使用 `fetch_ticks` 方法來取得歷史 tick 的資料，並且將取得資料加入到 `df_stk` 中。

以上我們已經完成了一個可以訂閱行情、回補錯過行情、計算技術指標的行情管理器了，這邊我們將所有程式碼整合起來，並且在 jupyter lab 中使用。

完整的 QuoteManager 可以參考 [quote.py](https://github.com/Sinotrade/sj-trading-demo/blob/main/src/sj_trading/quote.py)。

完整使用範例 jupyter notebook 可以參考 [quote_manager_usage](https://github.com/Sinotrade/sj-trading-demo/blob/main/quote_manager_usage.ipynb)。
