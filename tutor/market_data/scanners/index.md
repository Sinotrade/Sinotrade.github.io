Scanners can use parameter of scannertype to get the rank of ChangePercent, ChangePrice, DayRange, Volume and Amount.

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

Ascending is sorted from largest to smallest by default, and the value of ascending is True. Set ascending to False to sort in descending order, and the other ranking methods are the same. `count` is how many ranks you get.

Supported Scanner Type

```
ChangePercentRank: rank by price percentage change
ChangePriceRank: rank by price change
DayRangeRank: rank by day range
VolumeRank: rank by volume
AmountRank: rank by amount

```

## Example

ChangePercentRank

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

To DataFrame

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

## Attributes

ChangePercentRank

```
date (str): date 
code (str): code
name (str): name
ts (int): timestamp
open (float): open price
high (float): high price
low (float): low price
close (float): close price
price_range (float): range of price
tick_type (int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
change_price (float): change in price
change_type (int): 
    {LimitUp, Up, Unchanged, Down, LimitDown}
average_price (float): average price
volume (int): volume
total_volume (int): total volume since market open
amount (int): amount
total_amount (int): total amount since market open
yesterday_volume (int): yesterday volume
volume_ratio (float): total_volume/yestoday_volume
buy_price (float): bid
buy_volume (int): bid volume
sell_price (float): ask
sell_volume (int): ask volume
bid_orders (int): number of orders that deal at bid
bid_volumes (int): total volume that deal at bid
ask_orders (int): number of orders that deal at ask
ask_volumes (int): total volume that deal at ask

```
