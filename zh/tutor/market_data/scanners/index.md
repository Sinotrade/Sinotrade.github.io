包含漲跌幅、漲跌、高低價差、成交量及成交金額排行。`Scanners`利用`scanner_type`去取得不同類型的排行。

Scanners

```
>> api.scanners?

Signature:
api.scanners(
    scanner_type: shioaji.constant.ScannerType, 
    ascending: bool = True,
    date: str = None,
    count: shioaji.shioaji.ConstrainedIntValue = 100, # 0 <= count <= 200
    timeout: int = 30000,
    cb: Callable[[List[shioaji.data.ChangePercentRank]], NoneType] = None,
) -> List[shioaji.data.ChangePercentRank]

```

排名預設為由大到小排序，`ascending`預設值為`True`。若要由小到大排序請將`ascending`設為`False`。`count`為排行數量。

支援的排行類別

```
ChangePercentRank: 依價格漲跌幅排序
ChangePriceRank: 依價格漲跌排序
DayRangeRank: 依高低價差排序
VolumeRank: 依成交量排序
AmountRank: 依成交金額排序

```

## 範例

依價格漲跌幅排序

```
scanners = api.scanners(
    scanner_type=sj.constant.ScannerType.ChangePercentRank,
    count=1
)
scanners

```

Out

```
[
    ChangePercentRank(
        date='2021-04-09', 
        code='5211', 
        name='蒙恬', 
        ts=1617978600000000000, 
        open=16.4, 
        high=17.6, 
        low=16.35, 
        close=17.6, 
        price_range=1.25, 
        tick_type=1, 
        change_price=1.6, 
        change_type=1, 
        average_price=17.45, 
        volume=7, 
        total_volume=1742, 
        amount=123200, 
        total_amount=30397496, 
        yesterday_volume=514, 
        volume_ratio=3.39, 
        buy_price=17.6, 
        buy_volume=723, 
        sell_price=0.0, 
        sell_volume=0, 
        bid_orders=237, 
        bid_volumes=82, 
        ask_orders=33, 
        ask_volumes=64
    )
]

```

轉成 DataFrame

In

```
scanners = api.scanners(
    scanner_type=sj.constant.ScannerType.ChangePercentRank, 
    count=5
)
df = pd.DataFrame(s.__dict__ for s in scanners)
df.ts = pd.to_datetime(df.ts)
df

```

Out

| date | code | name | ts | open | high | low | close | price_range | tick_type | change_price | change_type | average_price | volume | total_volume | amount | total_amount | yesterday_volume | volume_ratio | buy_price | buy_volume | sell_price | sell_volume | bid_orders | bid_volumes | ask_orders | ask_volumes | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-01-17 | 6259 | 百徽 | 2023-01-17 11:11:41.030000 | 22.8 | 23.75 | 22.45 | 23.75 | 1.3 | 1 | 2.15 | 1 | 23.58 | 4 | 137 | 95000 | 3230900 | 26 | 5.27 | 0 | 8 | 0 | 0 | 65 | 211 | 5 | 11 | | 2023-01-17 | 6788 | 華景電 | 2023-01-17 11:19:01.924000 | 107 | 116 | 107 | 116 | 9 | 1 | 10.5 | 1 | 113.61 | 1 | 4292 | 116000 | 487606000 | 682 | 6.29 | 0 | 1053 | 0 | 0 | 1044 | 3786 | 501 | 1579 | | 2023-01-17 | 2540 | 愛山林 | 2023-01-17 11:17:39.435000 | 85.2 | 85.2 | 83 | 85.2 | 2.2 | 1 | 7.7 | 1 | 85.04 | 1 | 1226 | 85200 | 104253800 | 702 | 1.75 | 0 | 142 | 0 | 0 | 362 | 5779 | 121 | 1831 | | 2023-01-17 | 8478 | 東哥遊艇 | 2023-01-17 11:18:33.702000 | 350.5 | 378 | 347 | 378 | 31 | 1 | 34 | 1 | 363.39 | 1 | 12115 | 378000 | 4402427500 | 8639 | 1.4 | 0 | 3307 | 0 | 0 | 3754 | 235724 | 1906 | 29843 | | 2023-01-17 | 6612 | 奈米醫材 | 2023-01-17 11:15:32.752000 | 102 | 109 | 102 | 109 | 7 | 1 | 9.7 | 1 | 106.95 | 1 | 1329 | 109000 | 142134500 | 1022 | 1.3 | 0 | 298 | 0 | 0 | 467 | 22718 | 162 | 1016 |

## 屬性

ChangePercentRank

```
date (str): 交易日 
code (str): 股票代號
name (str): 股票名稱
ts (int): 時間戳記
open (float): 開盤價
high (float): 最高價
low (float): 最低價
close (float): 收盤價
price_range (float): 價格區間(最高價-最低價)
tick_type (int): 內外盤別 {1: 內盤, 2: 外盤, 0: 無法判定}
change_price (float): 價格漲跌
change_type (int): 漲跌
    {LimitUp, Up, Unchanged, Down, LimitDown}
average_price (float): 均價
volume (int): 成交量
total_volume (int): 總成交量
amount (int): 成交金額
total_amount (int): 總成交金額
yesterday_volume (int): 昨日總成交量
volume_ratio (float): 總成交量/昨日總成交量
buy_price (float): 委買價
buy_volume (int): 委買量
sell_price (float): 委賣價
sell_volume (int): 委賣量
bid_orders (int): 內盤總成交單量
bid_volumes (int): 內盤總成交量
ask_orders (int): 外盤總成交單量
ask_volumes (int): 外盤總成交量

```
