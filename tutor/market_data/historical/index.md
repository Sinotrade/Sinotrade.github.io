Historical data lets you query tick-by-tick trades (`Ticks`) and minute K-line (`Kbars`).

Note

Historical data queries consume bandwidth. See [Use Restrictions](../../limit/) for the daily bandwidth cap.

## Ticks

You can fetch `Ticks` for an entire day, a specific time range, or the last N ticks of the day. The default is the most recent trade day.

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
contract:    contract (from api.Contracts.*)
date:        trading date (YYYY-MM-DD)
query_type:  query mode {'AllDay', 'RangeTime', 'LastCount'}
time_start:  optional, start time, used when query_type='RangeTime'
time_end:    optional, end time, used when query_type='RangeTime'
last_cnt:    optional, last N ticks, used when query_type='LastCount'
timeout:     timeout in milliseconds
cb:          optional, callback function, used when timeout=0

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
--code:          security code (e.g. 2330, TXFR1)
--date:          trading date (YYYY-MM-DD)
--last:          optional, last N ticks
--all:           optional, fetch all ticks of the day (overrides --last)
--security-type: security type {'STK', 'FUT', 'OPT', 'IND'}
--exchange:      exchange {'TSE', 'OTC', 'TAIFEX'}

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
contract.security_type: security type {'STK', 'FUT', 'OPT', 'IND'}
contract.exchange:      exchange {'TSE', 'OTC', 'TAIFEX'}
contract.code:          security code (e.g. 2330, TXFR1)
date:                   trading date (YYYY-MM-DD)
query_type:             query mode {'AllDay', 'RangeTime', 'LastCount'}
time_start:             optional, start time, used when query_type='RangeTime'
time_end:               optional, end time, used when query_type='RangeTime'
last_cnt:               optional, last N ticks, used when query_type='LastCount'

```

### Attributes

Ticks

```
ts / datetime: trade time (integer Unix timestamp in Python, ISO string in other languages)
close (float): close price
volume (int): volume
bid_price (float): bid price
bid_volume (int): bid volume
ask_price (float): ask price
ask_volume (int): ask volume
tick_type (int): inside/outside {1: outside, 2: inside, 0: unknown}

```

### Examples

#### Ticks by Date

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

**To DataFrame (using polars)**

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

#### Ticks by Time Range

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

#### Last N Ticks

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

**Ticks by Date**

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

**Last N Ticks**

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

**Ticks by Date**

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

**Ticks by Time Range**

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

**Last N Ticks**

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

You can fetch `Kbars` by specifying a start/end date range. The default is the most recent trade day.

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
contract: contract (from api.Contracts.*)
start:    start date (YYYY-MM-DD), defaults to yesterday
end:      end date (YYYY-MM-DD), defaults to today
timeout:  timeout in milliseconds
cb:       optional, callback function, used when timeout=0

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
--code:          security code (e.g. 2330, TXFR1)
--start:         start date (YYYY-MM-DD)
--end:           end date (YYYY-MM-DD)
--security-type: security type {'STK', 'FUT', 'OPT', 'IND'}
--exchange:      exchange {'TSE', 'OTC', 'TAIFEX'}

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
contract.security_type: security type {'STK', 'FUT', 'OPT', 'IND'}
contract.exchange:      exchange {'TSE', 'OTC', 'TAIFEX'}
contract.code:          security code (e.g. 2330, TXFR1)
start:                  start date (YYYY-MM-DD)
end:                    end date (YYYY-MM-DD)

```

### Attributes

Kbars

```
ts / datetime:  time (integer Unix timestamp in Python, ISO string in other languages)
Open (float):   open price
High (float):   high price
Low (float):    low price
Close (float):  close price
Volume (int):   volume
Amount (float): trade amount

```

### Examples

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

**To DataFrame (using polars)**

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

## Historical Periods

Historical Periods

| | Start Date | End Date | | --- | --- | --- | | Index | 2020-03-02 | Today | | Stock | 2020-03-02 | Today | | Futures | 2020-03-22 | Today |

## Continuous Futures

Once a futures contract passes its expiration date, the contract is invalid, and it will not exist in your `api.Contracts`. In order to get historical data for expired futures contracts, we provide continuous futures contracts. `R1`, `R2` are continuous near-month and next-to-near-month futures contracts respectively. They will automatically roll contracts on delivery date (i.e. `target_code` changes). You can use `R1`, `R2` to get long-term historical data, e.g. `api.Contracts.Futures.TXF.TXFR1`. The examples below show how to use `R1`, `R2` to fetch historical `Ticks` and `Kbars` of expired futures.

Note

`code` must exist in `api.Contracts` to be passed into `api.ticks` / `api.kbars`. For example, `TXFE6` is the contract for May 2026; by June 2026 it no longer appears in `api.Contracts`, so `TXFE6` cannot be queried at that point.

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
