Snapshot is a present stock, future, option info. It contain open, high, low, close, change price, average price, volume, total volume, buy price, buy volume, sell price, sell volume and yesterday volume.

Reminder

Each snapshot can contain up to 500 contracts.

Snapshots

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

## Example

In

```
contracts = [
    api.Contracts.Stocks['2330'], 
    api.Contracts.Stocks['2317']
]
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

To DataFrame

In

```
df = pd.DataFrame(s.__dict__ for s in snapshots)
df.ts = pd.to_datetime(df.ts)
df

```

Out

| ts | code | exchange | open | high | low | close | tick_type | change_price | change_rate | change_type | average_price | volume | total_volume | amount | total_amount | yesterday_volume | buy_price | buy_volume | sell_price | sell_volume | volume_ratio | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-01-13 14:30:00 | 2330 | TSE | 507 | 509 | 499 | 500 | Sell | 13.5 | 2.77 | Up | 502.42 | 48 | 77606 | 24000000 | 38990557755 | 20963 | 500 | 122 | 501 | 1067 | 3.7 | | 2023-01-13 14:30:00 | 2317 | TSE | 99 | 99.5 | 98.6 | 98.6 | Sell | 0 | 0 | Unchanged | 98.96 | 63 | 17809 | 6211800 | 1762344817 | 18537 | 98.6 | 607 | 98.7 | 4 | 0.96 |

## Attributes

Snapshot

```
ts (int): TimeStamp
code (str): Contract id
exchange (Exchange): exchange
open (float): open
high (float): high
low (float): low
close (float): close
tick_type (TickType): Close is buy or sell price
    {None, Buy, Sell}
change_price (float): change price
change_rate (float): change rate
change_type (ChangeType):
    {LimitUp, Up, Unchanged, Down, LimitDown}
avgerage_price (float): avgerage of price
volume (int): volume
total_volume (int): total volume
amount (int): Deal amount
total_amount (int): Total deal amount
yestoday_volume (float): Volume of yestoday
buy_price (float): Price of buy
buy_volume (float): Volume of sell
sell_price (float): Price of sell
sell_volume (int): Volume of sell
volume_ratio (float): total_volume/yestoday_volume

```
