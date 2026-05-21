包含漲跌幅、漲跌、高低價差、成交量及成交金額排行。`Scanners`利用`scanner_type`去取得不同類型的排行。

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
scanner_type: 排行類型，見下方支援列表
date:         交易日（YYYY-MM-DD），預設今天
ascending:    排序方向（True=由大到小、False=由小到大），預設 True
count:        排行數量（0 ≤ count ≤ 200），預設 100
timeout:      逾時毫秒
cb:           選填，callback 函式，timeout=0 時使用

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
--scanner-type: 排行類型，預設 change-percent-rank
--date:         交易日（YYYY-MM-DD），預設今天
--ascending:    選填 flag，加上即由大到小排序（不加為由小到大）
--count:        排行數量，預設 50

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
scanner_type: 排行類型 {'ChangePercentRank', 'ChangePriceRank', 'DayRangeRank', 'VolumeRank', 'AmountRank', 'TickCountRank'}
date:         交易日（YYYY-MM-DD）
ascending:    排序方向（true=由大到小、false=由小到大）
count:        排行數量，預設 200

```

支援的排行類別

```
ChangePercentRank: 依價格漲跌幅排序
ChangePriceRank:   依價格漲跌排序
DayRangeRank:      依高低價差排序
VolumeRank:        依成交量排序
AmountRank:        依成交金額排序
TickCountRank:     依成交筆數排序

```

## 屬性

ScannerItem

```
date (str):             交易日
code (str):             股票代號
name (str):             股票名稱
ts / datetime:          時間（Python 為 Unix 時間戳，其他語言為 ISO 字串）
open (float):           開盤價
high (float):           最高價
low (float):            最低價
close (float):          收盤價
price_range (float):    價格區間（最高價 - 最低價）
tick_type (int):        內外盤別 {1: 內盤, 2: 外盤, 0: 無法判定}
change_price (float):   價格漲跌
change_type (int):      漲跌 {LimitUp, Up, Unchanged, Down, LimitDown}
average_price (float):  均價
volume (int):           成交量
total_volume (int):     總成交量
amount (int):           成交額
total_amount (int):     總成交額
yesterday_volume (int): 昨日總成交量
volume_ratio (float):   總成交量 / 昨日總成交量
buy_price (float):      委買價
buy_volume (int):       委買量
sell_price (float):     委賣價
sell_volume (int):      委賣量
bid_orders (int):       內盤總成交單量
bid_volumes (int):      內盤總成交量
ask_orders (int):       外盤總成交單量
ask_volumes (int):      外盤總成交量
rank_value (float):     排序值（依 scanner_type 而定）

```

## 範例

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

**轉成 DataFrame（以 polars 示範）**

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
