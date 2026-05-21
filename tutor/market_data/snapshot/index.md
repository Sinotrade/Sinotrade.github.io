Snapshot is the current information of a stock, future, or option. It contains open, high, low, close, change price, average price, volume, total volume, buy price, buy volume, sell price, sell volume and yesterday volume.

Note

Snapshot queries consume bandwidth. See [Use Restrictions](../../limit/) for the daily bandwidth cap.

Reminder

Each snapshot request can contain up to 500 contracts.

Snapshots

```
api.snapshots?

Signature:
    api.snapshots(
        contracts: List[Union[shioaji.contracts.Option, shioaji.contracts.Future, shioaji.contracts.Stock, shioaji.contracts.Index]],
        timeout: int = 30000,
        cb: Callable[[shioaji.data.Snapshot], NoneType] = None,
    ) -> List[shioaji.data.Snapshot]
Docstring:
    get contract snapshot info

```

Parameters

```
contracts: list of contracts (from api.Contracts.*), up to 500 per request
timeout:   timeout in milliseconds
cb:        optional, callback function, used when timeout=0

```

Snapshots

```
$ shioaji data snapshots --help

Get snapshots for multiple contracts

Usage: shioaji data snapshots [OPTIONS] --codes <CODES>

Options:
      --codes <CODES>                  Comma-separated security codes (e.g. 2330,2317,2454)
      --security-type <SECURITY_TYPE>  Security type: STK, FUT, OPT, IND [default: STK]
      --exchange <EXCHANGE>            Exchange: TSE, OTC, TAIFEX [default: TSE]

```

Parameters

```
--codes:         comma-separated security codes (e.g. 2330,2317,2454)
--security-type: security type {'STK', 'FUT', 'OPT', 'IND'}
--exchange:      exchange {'TSE', 'OTC', 'TAIFEX'}

```

Snapshots

```
POST /api/v1/data/snapshots
Content-Type: application/json

{
  "contracts": [
    { "security_type": <SecurityType>, "exchange": <Exchange>, "code": <string> }
  ]
}

```

Parameters

```
contracts:                 list of contracts, up to 500 per request
contracts[].security_type: security type {'STK', 'FUT', 'OPT', 'IND'}
contracts[].exchange:      exchange {'TSE', 'OTC', 'TAIFEX'}
contracts[].code:          security code (e.g. 2330, TXFR1)

```

## Attributes

Snapshot

```
ts / datetime:            time (integer Unix timestamp in Python, ISO string in other languages)
code (str):               security code
exchange (Exchange):      exchange
open (float):             open price
high (float):             high price
low (float):              low price
close (float):            close price
tick_type (TickType):     close tick side {None, Buy, Sell}
change_price (float):     change price
change_rate (float):      change rate
change_type (ChangeType): change direction {LimitUp, Up, Unchanged, Down, LimitDown}
average_price (float):    average price
volume (int):             tick volume
total_volume (int):       total volume
amount (int):             tick amount
total_amount (int):       total amount
yesterday_volume (float): yesterday volume
buy_price (float):        bid price
buy_volume (float):       bid volume
sell_price (float):       ask price
sell_volume (int):        ask volume
volume_ratio (float):     volume ratio (total_volume / yesterday_volume)

```

## Examples

In

```
contracts = [api.Contracts.Stocks['2330'], api.Contracts.Stocks['2317']]
snapshots = api.snapshots(contracts)
snapshots

```

Out

```
[
    Snapshot(
        ts=1779114600000000000,
        code='2330',
        exchange='TSE',
        open=2225,
        high=2260,
        low=2215,
        close=2240,
        tick_type=<TickType.Sell: 'Sell'>,
        change_price=-25,
        change_rate=-1.1,
        change_type=<ChangeType.Down: 'Down'>,
        average_price=2234.72,
        volume=75,
        total_volume=25820,
        amount=168000000,
        total_amount=57700920000,
        yesterday_volume=29811,
        buy_price=2240,
        buy_volume=524,
        sell_price=2245,
        sell_volume=103,
        volume_ratio=0.87
    ),
    Snapshot(
        ts=1779114600000000000,
        code='2317',
        exchange='TSE',
        open=251,
        high=251,
        low=241,
        close=248.5,
        tick_type=<TickType.Sell: 'Sell'>,
        change_price=0,
        change_rate=0,
        change_type=<ChangeType.Unchanged: 'Unchanged'>,
        average_price=246.67,
        volume=58,
        total_volume=60665,
        amount=14413000,
        total_amount=14964920500,
        yesterday_volume=134926,
        buy_price=248.5,
        buy_volume=415,
        sell_price=249,
        sell_volume=368,
        volume_ratio=0.45
    )
]

```

**To DataFrame (using polars)**

In

```
import polars as pl
df = pl.DataFrame(s.dict() for s in snapshots).with_columns(
    pl.col("ts").cast(pl.Datetime("ns"))
)
df

```

Out

| ts | code | exchange | open | high | low | close | tick_type | change_price | change_rate | change_type | average_price | volume | total_volume | amount | total_amount | yesterday_volume | buy_price | buy_volume | sell_price | sell_volume | volume_ratio | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2026-05-18 14:30:00 | 2330 | TSE | 2225.0 | 2260.0 | 2215.0 | 2240.0 | TickType.Sell | -25.0 | -1.1 | ChangeType.Down | 2234.72 | 75 | 25820 | 168000000 | 57700920000 | 29811.0 | 2240.0 | 524 | 2245.0 | 103 | 0.87 | | 2026-05-18 14:30:00 | 2317 | TSE | 251.0 | 251.0 | 241.0 | 248.5 | TickType.Sell | 0.0 | 0.0 | ChangeType.Unchanged | 246.67 | 58 | 60665 | 14413000 | 14964920500 | 134926.0 | 248.5 | 415 | 249.0 | 368 | 0.45 |

In

```
shioaji data snapshots --codes 2330,2317

```

Out

```
[2]{datetime,code,exchange,open,high,low,close,tick_type,change_price,change_rate,change_type,average_price,volume,total_volume,amount,total_amount,yesterday_volume,buy_price,buy_volume,sell_price,sell_volume,volume_ratio}:
  2026-05-18T14:30:00,"2330",TSE,2225,2260,2215,2240,Sell,-25,-1.1,Down,2234.72,75,25820,168000000,57700920000,29811,2240,524,2245,103,0.87
  2026-05-18T14:30:00,"2317",TSE,251,251,241,248.5,Sell,0,0,Unchanged,246.67,58,60665,14413000,14964920500,134926,248.5,415,249,368,0.45

```

In

```
curl -X POST http://localhost:8080/api/v1/data/snapshots \
  -H 'Content-Type: application/json' \
  -d '{
    "contracts": [
      {"security_type": "STK", "exchange": "TSE", "code": "2330"},
      {"security_type": "STK", "exchange": "TSE", "code": "2317"}
    ]
  }'

```

Out

```
[{"datetime":"2026-05-18T14:30:00","code":"2330","exchange":"TSE","open":2225.0,"high":2260.0,"low":2215.0,"close":2240.0,"tick_type":"Sell","change_price":-25.0,"change_rate":-1.1,"change_type":"Down","average_price":2234.72,"volume":75,"total_volume":25820,"amount":168000000,"total_amount":57700920000,"yesterday_volume":29811.0,"buy_price":2240.0,"buy_volume":524.0,"sell_price":2245.0,"sell_volume":103,"volume_ratio":0.87},{"datetime":"2026-05-18T14:30:00","code":"2317","exchange":"TSE","open":251.0,"high":251.0,"low":241.0,"close":248.5,"tick_type":"Sell","change_price":0.0,"change_rate":0.0,"change_type":"Unchanged","average_price":246.67,"volume":58,"total_volume":60665,"amount":14413000,"total_amount":14964920500,"yesterday_volume":134926.0,"buy_price":248.5,"buy_volume":415.0,"sell_price":249.0,"sell_volume":368,"volume_ratio":0.45}]

```
