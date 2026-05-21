Scanners include rankings by change percent, change price, day range, volume and amount. Use `scanner_type` to fetch different types of rankings.

Scanners

```
api.scanners?

Signature:
    api.scanners(
        scanner_type: shioaji.constant.ScannerType,
        date: str = None,
        ascending: bool = True,
        count: int = 100,
        timeout: int = 30000,
        cb: Callable[[List[shioaji.data.ScannerItem]], NoneType] = None,
    ) -> List[shioaji.data.ScannerItem]

```

Parameters

```
scanner_type: scanner type, see supported list below
date:         trading date (YYYY-MM-DD), defaults to today
ascending:    sort direction (True=largest first, False=smallest first), default True
count:        number of results (0 ≤ count ≤ 200), default 100
timeout:      timeout in milliseconds
cb:           optional, callback function, used when timeout=0

```

Scanners

```
$ shioaji data scanner --help

Get scanner ranking data

Usage: shioaji data scanner [OPTIONS]

Options:
      --scanner-type <SCANNER_TYPE>  Scanner type [change-percent-rank, change-price-rank, day-range-rank, volume-rank, amount-rank, tick-count-rank] [default: change-percent-rank]
      --date <DATE>                  Trading date (YYYY-MM-DD, default: today) [default: 2026-05-18]
      --ascending                    Sort ascending
      --count <COUNT>                Number of results (default: 50) [default: 50]

```

Parameters

```
--scanner-type: scanner type, default change-percent-rank
--date:         trading date (YYYY-MM-DD), defaults to today
--ascending:    optional flag, sort largest first when set (smallest first when omitted)
--count:        number of results, default 50

```

Scanners

```
POST /api/v1/data/scanner
Content-Type: application/json

{
  "scanner_type": <ScannerType>,
  "date":         <string>,
  "ascending":    <bool>,
  "count":        <int>
}

```

Parameters

```
scanner_type: scanner type {'ChangePercentRank', 'ChangePriceRank', 'DayRangeRank', 'VolumeRank', 'AmountRank', 'TickCountRank'}
date:         trading date (YYYY-MM-DD)
ascending:    sort direction (true=largest first, false=smallest first)
count:        number of results, default 200

```

Supported Scanner Types

```
ChangePercentRank: rank by price percentage change
ChangePriceRank:   rank by price change
DayRangeRank:      rank by day range
VolumeRank:        rank by volume
AmountRank:        rank by amount
TickCountRank:     rank by tick count

```

## Attributes

ScannerItem

```
date (str):             trading date
code (str):             security code
name (str):             security name
ts / datetime:          time (integer Unix timestamp in Python, ISO string in other languages)
open (float):           open price
high (float):           high price
low (float):            low price
close (float):          close price
price_range (float):    price range (high - low)
tick_type (int):        inside/outside {1: inside, 2: outside, 0: unknown}
change_price (float):   change price
change_type (int):      change direction {LimitUp, Up, Unchanged, Down, LimitDown}
average_price (float):  average price
volume (int):           tick volume
total_volume (int):     total volume since market open
amount (int):           tick amount
total_amount (int):     total amount since market open
yesterday_volume (int): yesterday total volume
volume_ratio (float):   total_volume / yesterday_volume
buy_price (float):      bid price
buy_volume (int):       bid volume
sell_price (float):     ask price
sell_volume (int):      ask volume
bid_orders (int):       order count dealt at bid
bid_volumes (int):      total volume dealt at bid
ask_orders (int):       order count dealt at ask
ask_volumes (int):      total volume dealt at ask
rank_value (float):     rank value (depends on scanner_type)

```

## Examples

In

```
scanners = api.scanners(
    scanner_type=sj.ScannerType.ChangePercentRank,
    count=1
)
scanners

```

Out

```
[ScannerItem(
    date='2026-05-18',
    code='2233',
    name='宇隆',
    ts=1779114600000000000,
    open=291,
    high=324.5,
    low=290,
    close=324.5,
    price_range=34.5,
    tick_type=1,
    change_price=29.5,
    change_type=1,
    average_price=311.65,
    volume=2,
    total_volume=1570,
    amount=649000,
    total_amount=489327500,
    yesterday_volume=762,
    volume_ratio=2.06,
    buy_price=324.5,
    buy_volume=40,
    sell_price=0,
    sell_volume=0,
    bid_orders=41,
    bid_volumes=1162,
    ask_orders=15,
    ask_volumes=408,
    rank_value=10
)]

```

**To DataFrame (using polars)**

In

```
scanners = api.scanners(
    scanner_type=sj.ScannerType.ChangePercentRank,
    count=5
)
import polars as pl
df = pl.DataFrame(s.dict() for s in scanners).with_columns(
    pl.col("ts").cast(pl.Datetime("ns"))
)
df

```

Out

| date | code | name | ts | open | high | low | close | price_range | tick_type | change_price | change_type | average_price | volume | total_volume | amount | total_amount | yesterday_volume | volume_ratio | buy_price | buy_volume | sell_price | sell_volume | bid_orders | bid_volumes | ask_orders | ask_volumes | rank_value | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2026-05-18 | 2233 | 宇隆 | 2026-05-18 14:30:00 | 291.0 | 324.5 | 290.0 | 324.5 | 34.5 | 1 | 29.5 | 1 | 311.65 | 2 | 1570 | 649000 | 489327500 | 762.0 | 2.06 | 324.5 | 40 | 0.0 | 0 | 41 | 1162 | 15 | 408 | 10.0 | | 2026-05-18 | 3663 | 鑫科 | 2026-05-18 14:30:00 | 68.2 | 75.9 | 66.7 | 75.9 | 9.2 | 1 | 6.9 | 1 | 73.26 | 1 | 5501 | 75900 | 403048100 | 3614.0 | 1.52 | 75.9 | 519 | 0.0 | 0 | 1126 | 4287 | 680 | 1214 | 10.0 | | 2026-05-18 | 6285 | 啟碁 | 2026-05-18 14:30:00 | 254.0 | 286.0 | 254.0 | 286.0 | 32.0 | 1 | 26.0 | 1 | 277.48 | 34 | 38135 | 9724000 | 10582011500 | 20370.0 | 1.87 | 286.0 | 5212 | 0.0 | 0 | 6589 | 28976 | 2876 | 9159 | 10.0 | | 2026-05-18 | 6719 | 力智 | 2026-05-18 14:30:00 | 198.0 | 220.0 | 197.0 | 220.0 | 23.0 | 1 | 20.0 | 1 | 214.6 | 99 | 3621 | 21780000 | 777081500 | 1392.0 | 2.6 | 219.5 | 5 | 220.0 | 80 | 930 | 2567 | 547 | 1054 | 10.0 | | 2026-05-18 | 8064 | 東捷 | 2026-05-18 14:30:00 | 118.0 | 132.0 | 117.5 | 132.0 | 14.5 | 1 | 12.0 | 1 | 127.16 | 29 | 5154 | 3828000 | 655530500 | 6111.0 | 0.84 | 131.5 | 60 | 132.0 | 618 | 33 | 3471 | 22 | 1683 | 10.0 |

In

```
shioaji data scanner --scanner-type change-percent-rank --count 1 --ascending

```

Out

```
[1]{date,code,name,datetime,open,high,low,close,price_range,tick_type,change_price,change_type,average_price,volume,total_volume,amount,total_amount,yesterday_volume,volume_ratio,buy_price,buy_volume,sell_price,sell_volume,bid_orders,bid_volumes,ask_orders,ask_volumes,rank_value}:
  "2026-05-18","2233","宇隆            ",2026-05-18T14:30:00,291,324.5,290,324.5,34.5,1,29.5,1,311.65,2,1570,649000,489327500,762,2.06,324.5,40,0,0,41,1162,15,408,10

```

In

```
curl -X POST http://localhost:8080/api/v1/data/scanner \
  -H 'Content-Type: application/json' \
  -d '{
    "scanner_type": "ChangePercentRank",
    "date": "2026-05-18",
    "ascending": true,
    "count": 1
  }'

```

Out

```
[{"date":"2026-05-18","code":"2233","name":"宇隆            ","datetime":"2026-05-18T14:30:00","open":291.0,"high":324.5,"low":290.0,"close":324.5,"price_range":34.5,"tick_type":1,"change_price":29.5,"change_type":1,"average_price":311.65,"volume":2,"total_volume":1570,"amount":649000,"total_amount":489327500,"yesterday_volume":762,"volume_ratio":2.06,"buy_price":324.5,"buy_volume":40,"sell_price":0.0,"sell_volume":0,"bid_orders":41,"bid_volumes":1162,"ask_orders":15,"ask_volumes":408,"rank_value":10.0}]

```
