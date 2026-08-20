市場快照為證券、期貨及選擇權當下資訊。內容包含開盤價、最高價、最低價、收盤價、變動價、均價、成交量、總成交量、委買價、委買量、委賣價、委賣量和昨量。

注意

- 市場快照查詢會佔用流量，請參考[使用限制](../../limit/)了解每日流量上限。
- `snapshots` 屬於查詢型行情，並非即時行情來源，盤中請勿反覆輪詢作為即時報價；超過次數限制或造成系統負載過高，將依違規處置暫停使用權。盤中需要即時資料，請改用[行情訂閱](../streaming/stocks/)。

提醒

市場快照每次最多 500 檔商品。

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
contracts: 商品檔列表（由 api.contracts.get 取得），最多 500 檔
timeout:   逾時毫秒
cb:        選填，callback 函式，timeout=0 時使用

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
--codes:         商品代碼，以逗號分隔（例如 2330,2317,2454）
--security-type: 商品類型 {'STK', 'FUT', 'OPT', 'IND'}
--exchange:      交易所 {'TSE', 'OTC', 'TAIFEX'}

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
contracts:                 商品檔列表，最多 500 檔
contracts[].security_type: 商品類型 {'STK', 'FUT', 'OPT', 'IND'}
contracts[].exchange:      交易所 {'TSE', 'OTC', 'TAIFEX'}
contracts[].code:          商品代碼（例如 2330、TXFR1）

```

## 屬性

Snapshot

```
ts / datetime:            時間（Python 為 Unix 時間戳，其他語言為 ISO 字串）
code (str):               商品代碼
exchange (Exchange):      交易所
open (float):             開盤價
high (float):             最高價
low (float):              最低價
close (float):            收盤價
tick_type (TickType):     收盤買賣別 {None, Buy, Sell}
change_price (float):     漲跌
change_rate (float):      漲跌幅
change_type (ChangeType): 漲跌 {LimitUp, Up, Unchanged, Down, LimitDown}
average_price (float):    均價
volume (int):             單量
total_volume (int):       成交量
amount (int):             單量成交額
total_amount (int):       成交額
yesterday_volume (float): 昨量
buy_price (float):        委買價
buy_volume (float):       委買量
sell_price (float):       賣出價
sell_volume (int):        委賣量
volume_ratio (float):     昨量比

```

## 範例

In

```
contracts = [api.contracts.get("2330"), api.contracts.get("2317")]
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

**轉成 DataFrame（以 polars 示範）**

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

## 組合商品

組合合約（建法見[商品合約](../../contract/#combo)）亦可查詢快照，並可與其他商品混列於同一次查詢；價格欄位皆為組合淨價。

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

api.snapshots([combo_contract])

```

Out

```
[
    Snapshot(
        ts=1786555404820000000,
        code='TXFH6/I6',
        exchange='',
        open=153,
        high=174,
        low=153,
        close=169,
        tick_type=<TickType.Buy: 'Buy'>,
        change_price=0,
        change_rate=0,
        change_type=<ChangeType.LimitUp: 'LimitUp'>,
        average_price=165.84,
        volume=2,
        total_volume=79,
        amount=338,
        total_amount=13101,
        yesterday_volume=1496,
        buy_price=165,
        buy_volume=1,
        sell_price=170,
        sell_volume=2,
        volume_ratio=0.05
    )
]

```

In

```
shioaji data snapshots --codes 'TXFH6+TXFI6'

```

Out

```
[1]{datetime,code,exchange,open,high,low,close,tick_type,change_price,change_rate,change_type,average_price,volume,total_volume,amount,total_amount,yesterday_volume,buy_price,buy_volume,sell_price,sell_volume,volume_ratio}:
  2026-08-12T17:23:24.820000,"TXFH6/I6",,153,174,153,169,Buy,0,0,LimitUp,165.84,2,79,338,13101,1496,165,1,170,2,0.05

```

In

```
curl -X POST http://localhost:8080/api/v1/data/snapshots \
  -H 'Content-Type: application/json' \
  -d '{
    "contracts": [
      {
        "legs": [
          {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
          {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
        ]
      }
    ]
  }'

```

Out

```
[{"datetime":"2026-08-12T17:23:24.820000","code":"TXFH6/I6","exchange":"","open":153.0,"high":174.0,"low":153.0,"close":169.0,"tick_type":"Buy","change_price":0.0,"change_rate":0.0,"change_type":"LimitUp","average_price":165.84,"volume":2,"total_volume":79,"amount":338,"total_amount":13101,"yesterday_volume":1496.0,"buy_price":165.0,"buy_volume":1.0,"sell_price":170.0,"sell_volume":2,"volume_ratio":0.05}]

```
