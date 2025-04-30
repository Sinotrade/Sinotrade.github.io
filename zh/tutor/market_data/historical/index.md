## Ticks

取得方式可以以一整天、某時間區段或是某天的最後幾筆。預設為商品最近交易日的Ticks。

Ticks

```
api.ticks?

Signature:
    api.ticks(
        contract: shioaji.contracts.BaseContract,
        date: str = '2022-12-26',
        query_type: shioaji.constant.TicksQueryType = <TicksQueryType.AllDay: 'AllDay'>,
        time_start: Union[str, datetime.time] = None,
        time_end: Union[str, datetime.time] = None,
        last_cnt: int = 0,
        timeout: int = 30000,
        cb: Callable[[shioaji.data.Ticks], NoneType] = None,
    ) -> shioaji.data.Ticks
Docstring:
    get contract tick volumn

```

### 取得特定日期 Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Stocks["2330"], 
    date="2023-01-16"
)
ticks

```

Out

```
Ticks(
    ts=[1673859600113699000, 1673859600228800000, 1673859600244294000, 1673859600308595000], 
    close=[506.0, 505.0, 506.0, 506.0],
    volume=[3340, 1, 17, 2],
    bid_price=[505.0, 505.0, 506.0, 506.0],
    bid_volume=[122, 320, 60, 58],
    ask_price=[506.0, 506.0, 507.0, 507.0],
    ask_volume=[13, 22, 702, 702]
    tick_type=[1, 2, 1, 2]
)

```

Ticks

```
ts (int): timestamp
close (float): 成交價
volume (int): 成交量
bid_price (float): 委買價
bid_volume (int): 委買量
ask_price (float): 委賣價
ask_volume (int): 委賣量
tick_type (int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}

```

轉成DataFrame

In

```
import pandas as pd
df = pd.DataFrame({**ticks})
df.ts = pd.to_datetime(df.ts)
df.head()

```

Out

| ts | ask_price | close | bid_volume | volume | ask_volume | tick_type | bid_price | | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-01-16 09:00:00.113699 | 506 | 506 | 122 | 3340 | 13 | 1 | 505 | | 2023-01-16 09:00:00.228800 | 506 | 505 | 320 | 1 | 22 | 2 | 505 | | 2023-01-16 09:00:00.244294 | 507 | 506 | 60 | 17 | 702 | 1 | 506 | | 2023-01-16 09:00:00.308595 | 507 | 506 | 58 | 2 | 702 | 2 | 506 |

### 取得特定時間區段 Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Stocks["2330"], 
    date="2023-01-16",
    query_type=sj.constant.TicksQueryType.RangeTime,
    time_start="09:00:00",
    time_end="09:20:01"
)
ticks

```

Out

```
Ticks(
    ts=[1673859600113699000, 1673859600228800000, 1673859600244294000, 1673859600308595000], 
    close=[506.0, 505.0, 506.0, 506.0],
    volume=[3340, 1, 17, 2],
    bid_price=[505.0, 505.0, 506.0, 506.0],
    bid_volume=[122, 320, 60, 58],
    ask_price=[506.0, 506.0, 507.0, 507.0],
    ask_volume=[13, 22, 702, 702]
    tick_type=[1, 2, 1, 2]
)

```

### 取得最後數筆 Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Stocks["2330"], 
    date="2023-01-16",
    query_type=sj.constant.TicksQueryType.LastCount,
    last_cnt=4,
)
ticks

```

Out

```
Ticks(
    ts=[1673859600113699000, 1673859600228800000, 1673859600244294000, 1673859600308595000], 
    close=[506.0, 505.0, 506.0, 506.0],
    volume=[3340, 1, 17, 2],
    bid_price=[505.0, 505.0, 506.0, 506.0],
    bid_volume=[122, 320, 60, 58],
    ask_price=[506.0, 506.0, 507.0, 507.0],
    ask_volume=[13, 22, 702, 702]
    tick_type=[1, 2, 1, 2]
)

```

## KBar

Kbars

```
api.kbars?

Signature:
api.kbars(
    contract: shioaji.contracts.BaseContract,
    start: str = '2023-01-15',
    end: str = '2023-01-16',
    timeout: int = 30000,
    cb: Callable[[shioaji.data.Kbars], NoneType] = None,
) -> shioaji.data.Kbars
Docstring:
get Kbar

```

In

```
kbars = api.kbars(
    contract=api.Contracts.Stocks["2330"], 
    start="2023-01-15", 
    end="2023-01-16", 
)
kbars

```

Out

```
Kbars(
    ts=[1673859660000000000, 1673859720000000000, 1673859780000000000, 1673859840000000000],
    Open=[506.0, 505.0, 505.0, 504.0],
    High=[508.0, 506.0, 506.0, 505.0],
    Low=[505.0, 505.0, 504.0, 504.0],
    Close=[505.0, 505.0, 504.0, 504.0],
    Volume=[5308, 1018, 543, 209]
)

```

Kbars

```
ts (int): timestamp
Open (float): open price
High (float): the highest price
Low: (float): the lowest price
Close (float): close price
Volume (int): volume

```

轉成DataFrame

In

```
import pandas as pd
df = pd.DataFrame({**kbars})
df.ts = pd.to_datetime(df.ts)
df.head()

```

Out

| Close | Amount | Low | Volume | ts | Open | High | | --- | --- | --- | --- | --- | --- | --- | | 505 | 2.68731e+09 | 505 | 5308 | 2023-01-16 09:01:00 | 506 | 508 | | 505 | 5.14132e+08 | 505 | 1018 | 2023-01-16 09:02:00 | 505 | 506 | | 504 | 2.74112e+08 | 504 | 543 | 2023-01-16 09:03:00 | 505 | 506 | | 504 | 1.0542e+08 | 504 | 209 | 2023-01-16 09:04:00 | 504 | 505 |

## 資料歷史期間

Historical Periods

| | Start Date | End Date | | --- | --- | --- | | Index | 2020-03-02 | Today | | Stock | 2020-03-02 | Today | | Futures | 2020-03-22 | Today |

## 連續期貨合約

期貨合約一旦到期，合約即不再有效，亦即他將不會出現在您的`api.Contracts`裡。為了取得到期的期貨合約歷史資料，我們提供連續期貨合約。`R1`, `R2`是近月及次月的連續期貨合約，他們會自動在結算日更換新的合約。您可以使用`R1`, `R2`合約來取得歷史資料，例如`api.Contracts.Futures.TXF.TXFR1`。以下顯示如何使用`R1`, `R2`合約取得到期期貨的歷史`Ticks`及`Kbars`。

Ticks

Ticks

```
ticks = api.ticks(
    contract=api.Contracts.Futures.TXF.TXFR1, 
    date="2020-03-22"
)
ticks

```

Out

```
Ticks(
    ts=[1616166000030000000, 1616166000140000000, 1616166000140000000, 1616166000190000000], 
    close=[16011.0, 16013.0, 16014.0, 16011.0],
    volume=[49, 2, 2, 1],
    bid_price=[0.0, 16011.0, 16011.0, 16011.0],
    bid_volume=[0, 1, 1, 1],
    ask_price=[0.0, 16013.0, 16013.0, 16013.0],
    ask_volume=[0, 1, 1, 1]
    tick_type=[1, 1, 1, 2]
)

```

Kbars

Kbars

```
kbars = api.kbars(
    contract=api.Contracts.Futures.TXF.TXFR1,
    start="2023-01-15", 
    end="2023-01-16", 
)
kbars

```

Out

```
Kbars(
    ts=[1616402760000000000, 1616402820000000000, 1616402880000000000, 1616402940000000000],
    Open=[16018.0, 16018.0, 16000.0, 15992.0],
    High=[16022.0, 16020.0, 16005.0, 15999.0],
    Low=[16004.0, 16000.0, 15975.0, 15989.0],
    Close=[16019.0, 16002.0, 15992.0, 15994.0],
    Volume=[1791, 864, 1183, 342]
)

```
