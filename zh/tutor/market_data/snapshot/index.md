市場快照為證券、期貨及選擇權當下資訊。內容包含開盤價、最高價、最低價、收盤價、變動價、均價、成交量、總成交量、委買價、委買量、委賣價、委賣量和昨量。

提醒

市場快照每次最多500檔商品。

市場快照

```
>> api.snapshots?

Signature:
api.snapshots(
    contracts: List[Union[shioaji.contracts.Option, shioaji.contracts.Future, shioaji.contracts.Stock, shioaji.contracts.Index]],
    timeout: int = 30000,
    cb: Callable[[shioaji.data.Snapshot], NoneType] = None,
) -> List[shioaji.data.Snapshot]
Docstring:
get contract snapshot info

```

## 範例

In

```
contracts = [api.Contracts.Stocks['2330'],api.Contracts.Stocks['2317']]
snapshots = api.snapshots(contracts)
snapshots

```

Out

```
[
    Snapshot(
        ts=1673620200000000000, 
        code='2330', 
        exchange='TSE', 
        open=507.0, 
        high=509.0, 
        low=499.0, 
        close=500.0, 
        tick_type=<TickType.Sell: 'Sell'>, 
        change_price=13.5, 
        change_rate=2.77,
        change_type=<ChangeType.Up: 'Up'>, 
        average_price=502.42, 
        volume=48, 
        total_volume=77606, 
        amount=24000000, 
        total_amount=38990557755, 
        yesterday_volume=20963.0, 
        buy_price=500.0,
        buy_volume=122.0, 
        sell_price=501.0, 
        sell_volume=1067, 
        volume_ratio=3.7
    ),
    Snapshot(
        ts=1673620200000000000, 
        code='2317', 
        exchange='TSE', 
        open=99.0, 
        high=99.5, 
        low=98.6, 
        close=98.6, 
        tick_type=<TickType.Sell: 'Sell'>, 
        change_price=0.0, 
        change_rate=0.0, 
        change_type=<ChangeType.Unchanged: 'Unchanged'>, 
        average_price=98.96, 
        volume=63, 
        total_volume=17809, 
        amount=6211800, 
        total_amount=1762344817, 
        yesterday_volume=18537.0, 
        buy_price=98.6, 
        buy_volume=607.0, 
        sell_price=98.7, 
        sell_volume=4, 
        volume_ratio=0.96
    )
]

```

轉成Dataframe

In

```
df = pd.DataFrame(s.__dict__ for s in snapshots)
df.ts = pd.to_datetime(df.ts)
df

```

Out

| ts | code | exchange | open | high | low | close | tick_type | change_price | change_rate | change_type | average_price | volume | total_volume | amount | total_amount | yesterday_volume | buy_price | buy_volume | sell_price | sell_volume | volume_ratio | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-01-13 14:30:00 | 2330 | TSE | 507 | 509 | 499 | 500 | Sell | 13.5 | 2.77 | Up | 502.42 | 48 | 77606 | 24000000 | 38990557755 | 20963 | 500 | 122 | 501 | 1067 | 3.7 | | 2023-01-13 14:30:00 | 2317 | TSE | 99 | 99.5 | 98.6 | 98.6 | Sell | 0 | 0 | Unchanged | 98.96 | 63 | 17809 | 6211800 | 1762344817 | 18537 | 98.6 | 607 | 98.7 | 4 | 0.96 |

## 屬性

Snapshot

```
ts (int): 取得資訊時間戳記
code (str): 商品代碼
exchange (Exchange): 交易所
open (float): 開盤價
high (float): 最高價
low (float): 最低價
close (float): 收盤價
tick_type (TickType): 收盤買賣別 {None, Buy, Sell}
change_price (float): 漲跌
change_rate (float): 漲跌幅
change_type (ChangeType): 漲跌 {LimitUp, Up, Unchanged, Down, LimitDown}
avgerage_price (float): 均價
volume (int): 單量
total_volume (int): 成交量
amount (int): 單量成交金額
total_amount (int): 成交金額
yestoday_volume (float): 昨量
buy_price (float): 委買價
buy_volume (float): 委買量
sell_price (float): 賣出價
sell_volume (int): 委賣量
volume_ratio (float): 昨量比

```
