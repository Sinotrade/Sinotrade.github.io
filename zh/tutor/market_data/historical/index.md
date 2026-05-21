歷史資料提供查詢逐筆成交（`Ticks`）與分 K 線（`Kbars`）。

注意

歷史資料查詢會佔用流量，請參考[使用限制](../../limit/)了解每日流量上限。

## Ticks

取得方式可以以一整天、某時間區段或是某天的最後幾筆。預設為商品最近交易日的 `Ticks`。

Ticks

```
api.ticks?

Signature:
    api.ticks(
        contract: shioaji.contracts.BaseContract,
        date: str = '2026-05-18',
        query_type: shioaji.constant.TicksQueryType = <TicksQueryType.AllDay: 'AllDay'>,
        time_start: Union[str, datetime.time] = None,
        time_end: Union[str, datetime.time] = None,
        last_cnt: int = 0,
        timeout: int = 5000,
        cb: Callable[[shioaji.data.Ticks], NoneType] = None,
    ) -> shioaji.data.Ticks
Docstring:
    get contract tick volume

```

Parameters

```
contract:    商品檔（由 api.Contracts.* 取得）
date:        交易日（YYYY-MM-DD）
query_type:  查詢類型 {'AllDay', 'RangeTime', 'LastCount'}
time_start:  選填，起始時間，query_type='RangeTime' 時使用
time_end:    選填，結束時間，query_type='RangeTime' 時使用
last_cnt:    選填，取末 N 筆，query_type='LastCount' 時使用
timeout:     逾時毫秒
cb:          選填，callback 函式，timeout=0 時使用

```

Ticks

```
$ shioaji data ticks --help

Get tick data for a contract

Usage: shioaji data ticks [OPTIONS] --code <CODE>

Options:
      --code <CODE>                    Security code (e.g. 2330, TXFR1)
      --date <DATE>                    Trading date (YYYY-MM-DD, default: today) [default: 2026-05-18]
      --last <LAST>                    Number of last ticks to return (default: 10) [default: 10]
      --all                            Fetch all ticks for the day (overrides --last)
      --security-type <SECURITY_TYPE>  Security type: STK, FUT, OPT, IND [default: STK]
      --exchange <EXCHANGE>            Exchange: TSE, OTC, TAIFEX [default: TSE]

```

Parameters

```
--code:          商品代碼（例如 2330、TXFR1）
--date:          交易日（YYYY-MM-DD）
--last:          選填，取末 N 筆
--all:           選填，取整日所有 ticks（覆蓋 --last）
--security-type: 商品類型 {'STK', 'FUT', 'OPT', 'IND'}
--exchange:      交易所 {'TSE', 'OTC', 'TAIFEX'}

```

Ticks

```
POST /api/v1/data/ticks
Content-Type: application/json

{
  "contract":   { "security_type": <SecurityType>, "exchange": <Exchange>, "code": <string> },
  "date":       <string>,
  "query_type": <TicksQueryType>,
  "time_start": <string?>,
  "time_end":   <string?>,
  "last_cnt":   <int>
}

```

Parameters

```
contract.security_type: 商品類型 {'STK', 'FUT', 'OPT', 'IND'}
contract.exchange:      交易所 {'TSE', 'OTC', 'TAIFEX'}
contract.code:          商品代碼（例如 2330、TXFR1）
date:                   交易日（YYYY-MM-DD）
query_type:             查詢類型 {'AllDay', 'RangeTime', 'LastCount'}
time_start:             選填，起始時間，query_type='RangeTime' 時使用
time_end:               選填，結束時間，query_type='RangeTime' 時使用
last_cnt:               選填，取末 N 筆，query_type='LastCount' 時使用

```

### 屬性

Ticks

```
ts / datetime:     時間（Python 為 Unix 時間戳，其他語言為 ISO 字串）
close (float):     成交價
volume (int):      成交量
bid_price (float): 委買價
bid_volume (int):  委買量
ask_price (float): 委賣價
ask_volume (int):  委賣量
tick_type (int):   內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}

```

### 範例

#### 取得特定日期 Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Stocks["2330"],
    date="2026-05-18"
)
ticks

```

Out

```
Ticks[7171](
    ts=[1779094808306075000, 1779094808342157000, 1779094808368510000, ...],
    close=[2225, 2225, 2225, ...],
    volume=[2166, 47, 50, ...],
    bid_price=[2220, 2220, 2220, ...],
    bid_volume=[692, 693, 696, ...],
    ask_price=[2225, 2225, 2230, ...],
    ask_volume=[97, 50, 104, ...],
    tick_type=[2, 1, 1, ...]
)

```

**轉成 DataFrame（以 polars 示範）**

In

```
import polars as pl
df = pl.DataFrame(ticks.dict()).with_columns(
    pl.col("ts").cast(pl.Datetime("ns"))
)
df.head()

```

Out

| ts | close | volume | bid_price | bid_volume | ask_price | ask_volume | tick_type | | --- | --- | --- | --- | --- | --- | --- | --- | | 2026-05-18 09:00:08.306075 | 2225.0 | 2166 | 2220.0 | 692 | 2225.0 | 97 | 2 | | 2026-05-18 09:00:08.342157 | 2225.0 | 47 | 2220.0 | 693 | 2225.0 | 50 | 1 | | 2026-05-18 09:00:08.368510 | 2225.0 | 50 | 2220.0 | 696 | 2230.0 | 104 | 1 | | ... | ... | ... | ... | ... | ... | ... | ... |

#### 取得特定時間區段 Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Stocks["2330"],
    date="2026-05-18",
    query_type=sj.constant.TicksQueryType.RangeTime,
    time_start="09:00:00",
    time_end="09:20:01"
)
ticks

```

Out

```
Ticks[1151](
    ts=[1779094808306075000, 1779094808342157000, 1779094808368510000, ...],
    close=[2225, 2225, 2225, ...],
    volume=[2166, 47, 50, ...],
    bid_price=[2220, 2220, 2220, ...],
    bid_volume=[692, 693, 696, ...],
    ask_price=[2225, 2225, 2230, ...],
    ask_volume=[97, 50, 104, ...],
    tick_type=[2, 1, 1, ...]
)

```

#### 取得最後數筆 Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Stocks["2330"],
    date="2026-05-18",
    query_type=sj.constant.TicksQueryType.LastCount,
    last_cnt=4,
)
ticks

```

Out

```
Ticks[4](
    ts=[1779110696011886000, 1779110697008306000, 1779111000000000000, 1779114600000000000],
    close=[2245.0, 2240.0, 2240.0, 2240.0],
    volume=[2, 6, 4606, 75],
    bid_price=[2240.0, 2240.0, 2240.0, 2240.0],
    bid_volume=[454, 447, 524, 524],
    ask_price=[2250.0, 2250.0, 2245.0, 2245.0],
    ask_volume=[179, 41, 103, 103],
    tick_type=[2, 2, 2, 2]
)

```

**取得特定日期 Ticks**

In

```
shioaji data ticks --code 2330 --date 2026-05-18 --all

```

Out

```
[7171]{datetime,close,volume,bid_price,bid_volume,ask_price,ask_volume,tick_type}:
  2026-05-18T09:00:08.306075,2225,2166,2220,692,2225,97,2
  2026-05-18T09:00:08.342157,2225,47,2220,693,2225,50,1
  2026-05-18T09:00:08.368510,2225,50,2220,696,2230,104,1
  ...

```

**取得最後數筆 Ticks**

In

```
shioaji data ticks --code 2330 --date 2026-05-18 --last 4

```

Out

```
[4]{datetime,close,volume,bid_price,bid_volume,ask_price,ask_volume,tick_type}:
  2026-05-18T13:24:56.011886,2245,2,2240,454,2250,179,2
  2026-05-18T13:24:57.008306,2240,6,2240,447,2250,41,2
  2026-05-18T13:30:00,2240,4606,2240,524,2245,103,2
  2026-05-18T14:30:00,2240,75,2240,524,2245,103,2

```

**取得特定日期 Ticks**

In

```
curl -X POST http://localhost:8080/api/v1/data/ticks \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": { "security_type": "STK", "exchange": "TSE", "code": "2330" },
    "date": "2026-05-18",
    "query_type": "AllDay"
  }'

```

Out

```
{"datetime":["2026-05-18T09:00:08.306075","2026-05-18T09:00:08.342157","2026-05-18T09:00:08.368510",...],"close":[2225.0,2225.0,2225.0,...],"volume":[2166,47,50,...],"bid_price":[2220.0,2220.0,2220.0,...],"bid_volume":[692,693,696,...],"ask_price":[2225.0,2225.0,2230.0,...],"ask_volume":[97,50,104,...],"tick_type":[2,1,1,...]}

```

**取得特定時間區段 Ticks**

In

```
curl -X POST http://localhost:8080/api/v1/data/ticks \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": { "security_type": "STK", "exchange": "TSE", "code": "2330" },
    "date": "2026-05-18",
    "query_type": "RangeTime",
    "time_start": "09:00:00",
    "time_end": "09:20:01"
  }'

```

Out

```
{"datetime":["2026-05-18T09:00:08.306075","2026-05-18T09:00:08.342157","2026-05-18T09:00:08.368510",...],"close":[2225.0,2225.0,2225.0,...],"volume":[2166,47,50,...],"bid_price":[2220.0,2220.0,2220.0,...],"bid_volume":[692,693,696,...],"ask_price":[2225.0,2225.0,2230.0,...],"ask_volume":[97,50,104,...],"tick_type":[2,1,1,...]}

```

**取得最後數筆 Ticks**

In

```
curl -X POST http://localhost:8080/api/v1/data/ticks \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": { "security_type": "STK", "exchange": "TSE", "code": "2330" },
    "date": "2026-05-18",
    "query_type": "LastCount",
    "last_cnt": 4
  }'

```

Out

```
{"datetime":["2026-05-18T13:24:56.011886","2026-05-18T13:24:57.008306","2026-05-18T13:30:00","2026-05-18T14:30:00"],"close":[2245.0,2240.0,2240.0,2240.0],"volume":[2,6,4606,75],"bid_price":[2240.0,2240.0,2240.0,2240.0],"bid_volume":[454,447,524,524],"ask_price":[2250.0,2250.0,2245.0,2245.0],"ask_volume":[179,41,103,103],"tick_type":[2,2,2,2]}

```

## Kbars

取得 `Kbars` 可以指定起訖日期區間，預設為商品最近交易日的 `Kbars`。

Kbars

```
api.kbars?

Signature:
    api.kbars(
        contract: shioaji.contracts.BaseContract,
        start: str = '2026-05-17',
        end: str = '2026-05-18',
        timeout: int = 5000,
        cb: Callable[[shioaji.data.Kbars], NoneType] = None,
    ) -> shioaji.data.Kbars
Docstring:
    get Kbar

```

Parameters

```
contract: 商品檔（由 api.Contracts.* 取得）
start:    起始日期（YYYY-MM-DD），預設為昨天
end:      結束日期（YYYY-MM-DD），預設為今天
timeout:  逾時毫秒
cb:       選填，callback 函式，timeout=0 時使用

```

Kbars

```
$ shioaji data kbars --help

Get K-bar (OHLCV) data for a contract

Usage: shioaji data kbars [OPTIONS] --code <CODE>

Options:
      --code <CODE>                    Security code (e.g. 2330, TXFR1)
      --start <START>                  Start date (YYYY-MM-DD, default: today) [default: 2026-05-18]
      --end <END>                      End date (YYYY-MM-DD, default: today) [default: 2026-05-18]
      --security-type <SECURITY_TYPE>  Security type: STK, FUT, OPT, IND [default: STK]
      --exchange <EXCHANGE>            Exchange: TSE, OTC, TAIFEX [default: TSE]

```

Parameters

```
--code:          商品代碼（例如 2330、TXFR1）
--start:         起始日期（YYYY-MM-DD）
--end:           結束日期（YYYY-MM-DD）
--security-type: 商品類型 {'STK', 'FUT', 'OPT', 'IND'}
--exchange:      交易所 {'TSE', 'OTC', 'TAIFEX'}

```

Kbars

```
POST /api/v1/data/kbars
Content-Type: application/json

{
  "contract": { "security_type": <SecurityType>, "exchange": <Exchange>, "code": <string> },
  "start":    <string>,
  "end":      <string>
}

```

Parameters

```
contract.security_type: 商品類型 {'STK', 'FUT', 'OPT', 'IND'}
contract.exchange:      交易所 {'TSE', 'OTC', 'TAIFEX'}
contract.code:          商品代碼（例如 2330、TXFR1）
start:                  起始日期（YYYY-MM-DD）
end:                    結束日期（YYYY-MM-DD）

```

### 屬性

Kbars

```
ts / datetime:  時間（Python 為 Unix 時間戳，其他語言為 ISO 字串）
Open (float):   開盤價
High (float):   最高價
Low (float):    最低價
Close (float):  收盤價
Volume (int):   成交量
Amount (float): 成交額

```

### 範例

In

```
kbars = api.kbars(
    contract=api.Contracts.Stocks["2330"],
    start="2026-05-17",
    end="2026-05-18"
)
kbars

```

Out

```
KBars[270](
    ts=[1779094860000000000, 1779094920000000000, 1779094980000000000, ...],
    Open=[2225, 2235, 2225, ...],
    High=[2235, 2235, 2230, ...],
    Low=[2225, 2225, 2220, ...],
    Close=[2230, 2230, 2225, ...],
    Volume=[2565, 377, 296, ...],
    Amount=[5708965000, 840260000, 659090000, ...]
)

```

**轉成 DataFrame（以 polars 示範）**

In

```
import polars as pl
df = pl.DataFrame(kbars.dict()).with_columns(
    pl.col("ts").cast(pl.Datetime("ns"))
)
df.head()

```

Out

| ts | Open | High | Low | Close | Volume | Amount | | --- | --- | --- | --- | --- | --- | --- | | 2026-05-18 09:01:00 | 2225.0 | 2235.0 | 2225.0 | 2230.0 | 2565 | 5.7090e9 | | 2026-05-18 09:02:00 | 2235.0 | 2235.0 | 2225.0 | 2230.0 | 377 | 8.4026e8 | | 2026-05-18 09:03:00 | 2225.0 | 2230.0 | 2220.0 | 2225.0 | 296 | 6.5909e8 | | ... | ... | ... | ... | ... | ... | ... |

In

```
shioaji data kbars --code 2330 --start 2026-05-17 --end 2026-05-18

```

Out

```
[270]{datetime,Open,High,Low,Close,Volume,Amount}:
  2026-05-18T09:01:00,2225,2235,2225,2230,2565,5708965000
  2026-05-18T09:02:00,2235,2235,2225,2230,377,840260000
  2026-05-18T09:03:00,2225,2230,2220,2225,296,659090000
  ...

```

In

```
curl -X POST http://localhost:8080/api/v1/data/kbars \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": { "security_type": "STK", "exchange": "TSE", "code": "2330" },
    "start": "2026-05-17",
    "end": "2026-05-18"
  }'

```

Out

```
{"datetime":["2026-05-18T09:01:00","2026-05-18T09:02:00","2026-05-18T09:03:00",...],"Open":[2225.0,2235.0,2225.0,...],"High":[2235.0,2235.0,2230.0,...],"Low":[2225.0,2225.0,2220.0,...],"Close":[2230.0,2230.0,2225.0,...],"Volume":[2565,377,296,...],"Amount":[5708965000.0,840260000.0,659090000.0,...]}

```

## 資料歷史期間

Historical Periods

| | Start Date | End Date | | --- | --- | --- | | Index | 2020-03-02 | Today | | Stock | 2020-03-02 | Today | | Futures | 2020-03-22 | Today |

## 連續期貨合約

期貨合約一旦到期，合約即不再有效，亦即他將不會出現在您的`api.Contracts`裡。為了取得到期的期貨合約歷史資料，我們提供連續期貨合約。`R1`, `R2`是近月及次月的連續期貨合約，他們會自動在結算日更換新的合約（即 `target_code` 會變）。您可以使用`R1`, `R2`合約來取得長期的歷史資料，例如`api.Contracts.Futures.TXF.TXFR1`。以下顯示如何使用`R1`, `R2`合約取得到期期貨的歷史`Ticks`及`Kbars`。

注意

`code` 必須出現在 `api.Contracts` 裡才能放入 `api.ticks` / `api.kbars` 查詢。例如 `TXFE6` 是 2026 年 5 月的合約，到了 2026 年 6 月就不再出現在 `api.Contracts`，此時就無法用 `TXFE6` 查詢。

#### Ticks

In

```
ticks = api.ticks(
    contract=api.Contracts.Futures.TXF.TXFR1,
    date="2026-05-18",
    query_type=sj.constant.TicksQueryType.LastCount,
    last_cnt=4,
)
ticks

```

Out

```
Ticks[4](
    ts=[1779111899290000000, 1779111899345000000, 1779111899345000000, 1779111899967000000],
    close=[40803.0, 40799.0, 40798.0, 40807.0],
    volume=[1, 2, 7, 1],
    bid_price=[40803.0, 40799.0, 40799.0, 40800.0],
    bid_volume=[2, 2, 2, 1],
    ask_price=[40808.0, 40807.0, 40807.0, 40807.0],
    ask_volume=[1, 1, 1, 1],
    tick_type=[2, 2, 2, 1]
)

```

#### Kbars

In

```
kbars = api.kbars(
    contract=api.Contracts.Futures.TXF.TXFR1,
    start="2026-05-17",
    end="2026-05-18"
)
kbars

```

Out

```
KBars[438](
    ts=[1779093960000000000, 1779094020000000000, 1779094080000000000, ...],
    Open=[40200, 40308, 40276, ...],
    High=[40369, 40342, 40316, ...],
    Low=[40169, 40262, 40251, ...],
    Close=[40310, 40276, 40316, ...],
    Volume=[2051, 704, 443, ...],
    Amount=[82536213, 28372910, 17845729, ...]
)

```

**Ticks**

In

```
shioaji data ticks --code TXFR1 --date 2026-05-18 --security-type FUT --exchange TAIFEX --last 4

```

Out

```
[4]{datetime,close,volume,bid_price,bid_volume,ask_price,ask_volume,tick_type}:
  2026-05-18T13:44:59.290000,40803,1,40803,2,40808,1,2
  2026-05-18T13:44:59.345000,40799,2,40799,2,40807,1,2
  2026-05-18T13:44:59.345000,40798,7,40799,2,40807,1,2
  2026-05-18T13:44:59.967000,40807,1,40800,1,40807,1,1

```

**Kbars**

In

```
shioaji data kbars --code TXFR1 --start 2026-05-17 --end 2026-05-18 --security-type FUT --exchange TAIFEX

```

Out

```
[438]{datetime,Open,High,Low,Close,Volume,Amount}:
  2026-05-18T08:46:00,40200,40369,40169,40310,2051,82536213
  2026-05-18T08:47:00,40308,40342,40262,40276,704,28372910
  2026-05-18T08:48:00,40276,40316,40251,40316,443,17845729
  ...

```

**Ticks**

In

```
curl -X POST http://localhost:8080/api/v1/data/ticks \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFR1"},
    "date": "2026-05-18",
    "query_type": "LastCount",
    "last_cnt": 4
  }'

```

Out

```
{"datetime":["2026-05-18T13:44:59.290000","2026-05-18T13:44:59.345000","2026-05-18T13:44:59.345000","2026-05-18T13:44:59.967000"],"close":[40803.0,40799.0,40798.0,40807.0],"volume":[1,2,7,1],"bid_price":[40803.0,40799.0,40799.0,40800.0],"bid_volume":[2,2,2,1],"ask_price":[40808.0,40807.0,40807.0,40807.0],"ask_volume":[1,1,1,1],"tick_type":[2,2,2,1]}

```

**Kbars**

In

```
curl -X POST http://localhost:8080/api/v1/data/kbars \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFR1"},
    "start": "2026-05-17",
    "end": "2026-05-18"
  }'

```

Out

```
{"datetime":["2026-05-18T08:46:00","2026-05-18T08:47:00","2026-05-18T08:48:00",...],"Open":[40200.0,40308.0,40276.0,...],"High":[40369.0,40342.0,40316.0,...],"Low":[40169.0,40262.0,40251.0,...],"Close":[40310.0,40276.0,40316.0,...],"Volume":[2051,704,443,...],"Amount":[82536213.0,28372910.0,17845729.0,...]}

```
