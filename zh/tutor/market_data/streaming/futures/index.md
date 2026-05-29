期貨 / 選擇權即時行情是交易所即時轉送的市場資料，僅在開盤時段才會推送。利用訂閱[商品檔](../../../contract/)的方式即可開始接收即時行情。

提醒

即時行情訂閱不會佔用流量。

連續月（TXFR1 / TXFR2）訂閱說明

- **Python / CLI** 可直接以 `TXFR1` / `TXFR2` 訂閱，binding 自行解析對應的實際商品代碼。
- **HTTP 及其他語言** 必須先呼叫 [商品檔查詢](../../../contract/) 取出 `target_code`（例如 `TXFF6`），訂閱時於 body 同時帶入 `code: "TXFR1"` 與 `target_code: "TXFF6"`，否則 server 雖回 200 但 SSE 只會收到 heartbeat、收不到任何 tick。

Subscribe

```
>> api.subscribe?

Signature:
    api.subscribe(
        contract: shioaji.Contract,
        quote_type: shioaji.QuoteType = <QuoteType.Tick: 'tick'>,
        intraday_odd: bool = False,
    )

```

Quote Parameters:

```
contract:     要訂閱的商品檔（由 api.Contracts.Futures.* 或 api.Contracts.Options.* 取得）
quote_type:   訂閱類型 {'tick', 'bid_ask', 'quote'}
intraday_odd: 期貨 / 選擇權不支援，固定為 False

```

Subscribe

```
$ shioaji data stream --help

Stream real-time market data (SSE, Ctrl+C to stop)

Usage: shioaji data stream [OPTIONS] --code <CODE>

Options:
      --code <CODE>                   Security code (e.g. 2330, TXFR1)
      --quote-type <QUOTE_TYPE>       Quote type: tick, bid_ask, quote [default: tick]
      --security-type <SECURITY_TYPE> Security type: STK, FUT, OPT, IND [default: STK]
      --intraday-odd                  Include intraday odd lot trades

```

Quote Parameters:

```
--code:          要訂閱的商品代碼（期貨 / 選擇權如 TXFR1、TXFF6、TXO20260526900C）
--quote-type:    訂閱類型 {tick, bid_ask, quote}，預設 tick
--security-type: 商品類型 {STK, FUT, OPT, IND}，期貨填 FUT、選擇權填 OPT
--intraday-odd:  期貨 / 選擇權不支援

```

Subscribe

```
POST /api/v1/stream/subscribe
Content-Type: application/json

{
  "security_type": <SecurityType>,
  "exchange":      <Exchange>,
  "code":          <string>,
  "target_code":   <string?>,
  "quote_type":    <QuoteType>
}

```

Quote Parameters:

```
security_type: 商品類型 {FUT, OPT}
exchange:      交易所 {TAIFEX}
code:          商品代碼（例 TXFR1、TXFF6、TXO20260526900C）
target_code:   對應實際商品代碼。連續月（TXFR1 / TXFR2）必填，否則 server 雖回 200 但收不到資料
quote_type:    訂閱類型 {Tick, BidAsk, Quote}

```

## Tick

In

```
api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Tick,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Futures.TXF.TXFR1,
#     quote_type=sj.QuoteType.Tick,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok

TickFOPv1(
    code='TXFF6',
    date=2026-05-20,
    time=18:46:34,
    close=40629,
    volume=1,
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback) 章節自訂 callback 函式。

In

```
shioaji data stream --code TXFR1 --security-type FUT --quote-type tick
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to TXFR1 tick (Ctrl+C to stop)
{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "18:50:02.981000",
  "open": "40270",
  "underlying_price": "40020.82",
  "bid_side_total_vol": 7498,
  "ask_side_total_vol": 5817,
  "avg_price": "40460.163149",
  "close": "40619",
  "high": "40650",
  "low": "40221",
  "amount": "81238",
  "total_amount": "552038466",
  "volume": 2,
  "total_volume": 13644,
  "tick_type": 1,
  "chg_type": 2,
  "price_chg": "495",
  "pct_chg": "1.233676",
  "simtrade": false
}

```

In

```
# 步驟 1：先查商品檔，取出 target_code
curl http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT

# 步驟 2：以上一步回傳的 target_code（例 TXFF6）訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TXFR1",
    "target_code": "TXFF6",
    "quote_type": "Tick"
  }'

# 步驟 3：開 SSE 收 tick（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/tick_fop

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "FUT",
#     "exchange": "TAIFEX",
#     "code": "TXFR1",
#     "target_code": "TXFF6",
#     "quote_type": "Tick"
#   }'

```

Out（步驟 1：商品檔回應）

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202606","delivery_date":"2026/06/17","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":44136.0,"limit_down":36112.0,"reference":40124.0,"update_date":"2026/05/20","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFF6"}

```

Out（步驟 3：SSE tick）

```
event:tick_fop
data:{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "18:54:43.871000",
  "open": "40270",
  "underlying_price": "40020.82",
  "bid_side_total_vol": 7540,
  "ask_side_total_vol": 5908,
  "avg_price": "40461.608055",
  "close": "40608",
  "high": "40650",
  "low": "40221",
  "amount": "40608",
  "total_amount": "557560959",
  "volume": 1,
  "total_volume": 13780,
  "tick_type": 1,
  "chg_type": 2,
  "price_chg": "484",
  "pct_chg": "1.206261",
  "simtrade": false
}

```

### 屬性

Tick

```
code (str)                               商品代碼
exchange (Exchange)                      交易所
date (tuple)                             日期
time (tuple)                             成交時間
datetime (tuple)                         日期與時間
open (Decimal)                           開盤價
underlying_price (Decimal)               標的指數現價
avg_price (Decimal)                      均價
close (Decimal)                          成交價
high (Decimal)                           最高價（自開盤）
low (Decimal)                            最低價（自開盤）
amount (Decimal)                         單筆成交額 (NTD)
total_amount (Decimal)                   總成交額 (NTD)
volume (int)                             單筆成交量 (lot)
total_volume (int)                       總成交量 (lot)
tick_type (int)                          內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
chg_type (int)                           漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
price_chg (Decimal)                      漲跌
pct_chg (Decimal)                        漲跌幅 (%)
bid_side_total_vol (int)                 買盤成交總量 (lot)
ask_side_total_vol (int)                 賣盤成交總量 (lot)
simtrade (bool)                          試撮

```

## BidAsk

In

```
api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.BidAsk,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Futures.TXF.TXFR1,
#     quote_type=sj.QuoteType.BidAsk,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok

BidAskFOPv1(
    code='TXFF6',
    date=2026-05-20,
    time=19:23:01,
    bid_price=[40605, 40603, 40602, 40601, 40600],
    ask_price=[40607, 40608, 40610, 40611, 40612],
    bid_volume=[1, 4, 2, 5, 5],
    ask_volume=[1, 1, 5, 2, 2],
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback) 章節自訂 callback 函式。

In

```
shioaji data stream --code TXFR1 --security-type FUT --quote-type bid_ask
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to TXFR1 bid_ask (Ctrl+C to stop)
{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:24:03.012000",
  "bid_total_vol": 8,
  "ask_total_vol": 19,
  "bid_price": ["40615", "40613", "40612", "40611", "40610"],
  "bid_volume": [1, 2, 1, 2, 2],
  "diff_bid_vol": [0, 0, 0, 0, 1],
  "ask_price": ["40618", "40619", "40620", "40621", "40622"],
  "ask_volume": [6, 2, 3, 2, 6],
  "diff_ask_vol": [0, -1, -1, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "40622",
  "first_derived_bid_vol": 0,
  "first_derived_ask_vol": 1,
  "underlying_price": "40020.82",
  "simtrade": false
}

```

In

```
# 步驟 1：先查商品檔，取出 target_code
curl http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT

# 步驟 2：以上一步回傳的 target_code（例 TXFF6）訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TXFR1",
    "target_code": "TXFF6",
    "quote_type": "BidAsk"
  }'

# 步驟 3：開 SSE 收 bid/ask（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/bidask_fop

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "FUT",
#     "exchange": "TAIFEX",
#     "code": "TXFR1",
#     "target_code": "TXFF6",
#     "quote_type": "BidAsk"
#   }'

```

Out（步驟 1：商品檔回應）

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202606","delivery_date":"2026/06/17","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":44136.0,"limit_down":36112.0,"reference":40124.0,"update_date":"2026/05/20","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFF6"}

```

Out（步驟 3：SSE bid/ask）

```
event:bidask_fop
data:{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:24:38.512000",
  "bid_total_vol": 19,
  "ask_total_vol": 20,
  "bid_price": ["40613", "40612", "40611", "40610", "40609"],
  "bid_volume": [1, 3, 5, 3, 7],
  "diff_bid_vol": [-1, 0, 0, 0, 2],
  "ask_price": ["40618", "40619", "40620", "40621", "40622"],
  "ask_volume": [6, 2, 4, 2, 6],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "40622",
  "first_derived_bid_vol": 0,
  "first_derived_ask_vol": 1,
  "underlying_price": "40020.82",
  "simtrade": false
}

```

### 屬性

BidAsk

```
code (str)                               商品代碼
exchange (Exchange)                      交易所
date (tuple)                             日期
time (tuple)                             時間
datetime (tuple)                         日期與時間
bid_total_vol (int)                      委買量總計 (lot)
ask_total_vol (int)                      委賣量總計 (lot)
bid_price (list[Decimal])                五檔委買價
bid_volume (list[int])                   五檔委買量 (lot)
diff_bid_vol (list[int])                 五檔委買價增減量 (lot)
ask_price (list[Decimal])                五檔委賣價
ask_volume (list[int])                   五檔委賣量 (lot)
diff_ask_vol (list[int])                 五檔委賣價增減量 (lot)
first_derived_bid_price (Decimal)        衍生一檔委買價
first_derived_ask_price (Decimal)        衍生一檔委賣價
first_derived_bid_vol (int)              衍生一檔委買量 (lot)
first_derived_ask_vol (int)              衍生一檔委賣量 (lot)
underlying_price (Decimal)               標的指數現價
simtrade (bool)                          試撮

```

## Quote

In

```
api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Quote,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Futures.TXF.TXFR1,
#     quote_type=sj.QuoteType.Quote,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok

QuoteFOPv1(
    code='TXFF6',
    date=2026-05-20,
    time=19:28:57,
    close=40610,
    volume=0,
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback) 章節自訂 callback 函式。

In

```
shioaji data stream --code TXFR1 --security-type FUT --quote-type quote
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to TXFR1 quote (Ctrl+C to stop)
{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:29:39.887000",
  "underlying_price": "40020.82",
  "open": "40270",
  "avg_price": "40466.730155",
  "close": "40616",
  "high": "40650",
  "low": "40221",
  "amount": "40616",
  "total_amount": "578107707",
  "volume": 0,
  "total_volume": 14286,
  "tick_type": 1,
  "chg_type": 2,
  "price_chg": "492",
  "pct_chg": "1.226199",
  "bid_side_total_vol": 7773,
  "ask_side_total_vol": 6172,
  "bid_side_total_cnt": 9924,
  "ask_side_total_cnt": 10442,
  "bid_price": ["40613", "40612", "40611", "40610", "40609"],
  "bid_volume": [2, 4, 6, 2, 4],
  "diff_bid_vol": [0, 0, 0, 0, 0],
  "ask_price": ["40617", "40618", "40619", "40620", "40621"],
  "ask_volume": [6, 7, 3, 4, 3],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "0",
  "first_derived_bid_vol": 0,
  "first_derived_ask_vol": 0,
  "simtrade": false
}

```

In

```
# 步驟 1：先查商品檔，取出 target_code
curl http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT

# 步驟 2：以上一步回傳的 target_code（例 TXFF6）訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TXFR1",
    "target_code": "TXFF6",
    "quote_type": "Quote"
  }'

# 步驟 3：開 SSE 收 quote（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/quote_fop

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "FUT",
#     "exchange": "TAIFEX",
#     "code": "TXFR1",
#     "target_code": "TXFF6",
#     "quote_type": "Quote"
#   }'

```

Out（步驟 1：商品檔回應）

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202606","delivery_date":"2026/06/17","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":44136.0,"limit_down":36112.0,"reference":40124.0,"update_date":"2026/05/20","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFF6"}

```

Out（步驟 3：SSE quote）

```
event:quote_fop
data:{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:30:16.137000",
  "underlying_price": "40020.82",
  "open": "40270",
  "avg_price": "40467.061396",
  "close": "40624",
  "high": "40650",
  "low": "40221",
  "amount": "40624",
  "total_amount": "579366918",
  "volume": 0,
  "total_volume": 14317,
  "tick_type": 1,
  "chg_type": 2,
  "price_chg": "500",
  "pct_chg": "1.246137",
  "bid_side_total_vol": 7804,
  "ask_side_total_vol": 6172,
  "bid_side_total_cnt": 9947,
  "ask_side_total_cnt": 10468,
  "bid_price": ["40620", "40618", "40617", "40616", "40615"],
  "bid_volume": [1, 7, 3, 7, 8],
  "diff_bid_vol": [0, 0, 0, 0, 2],
  "ask_price": ["40624", "40625", "40626", "40627", "40628"],
  "ask_volume": [4, 3, 1, 1, 4],
  "diff_ask_vol": [1, 0, 0, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "0",
  "first_derived_bid_vol": 0,
  "first_derived_ask_vol": 0,
  "simtrade": false
}

```

### 屬性

Quote

```
code (str)                               商品代碼
exchange (Exchange)                      交易所
date (tuple)                             日期
time (tuple)                             成交時間
datetime (tuple)                         日期與時間
underlying_price (Decimal)               標的指數現價
open (Decimal)                           開盤價
avg_price (Decimal)                      均價
close (Decimal)                          成交價
high (Decimal)                           最高價（自開盤）
low (Decimal)                            最低價（自開盤）
amount (Decimal)                         單筆成交額 (NTD)
total_amount (Decimal)                   總成交額 (NTD)
volume (int)                             單筆成交量 (lot)
total_volume (int)                       總成交量 (lot)
tick_type (int)                          內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
chg_type (int)                           漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
price_chg (Decimal)                      漲跌
pct_chg (Decimal)                        漲跌幅 (%)
bid_side_total_vol (int)                 買盤成交總量 (lot)
ask_side_total_vol (int)                 賣盤成交總量 (lot)
bid_side_total_cnt (int)                 買盤成交筆數
ask_side_total_cnt (int)                 賣盤成交筆數
bid_price (list[Decimal])                五檔委買價
bid_volume (list[int])                   五檔委買量 (lot)
diff_bid_vol (list[int])                 五檔委買價增減量 (lot)
ask_price (list[Decimal])                五檔委賣價
ask_volume (list[int])                   五檔委賣量 (lot)
diff_ask_vol (list[int])                 五檔委賣價增減量 (lot)
first_derived_bid_price (Decimal)        衍生一檔委買價
first_derived_ask_price (Decimal)        衍生一檔委賣價
first_derived_bid_vol (int)              衍生一檔委買量 (lot)
first_derived_ask_vol (int)              衍生一檔委賣量 (lot)
simtrade (bool)                          試撮

```

## Callback（僅 Python）

預設狀況下我們將即時行情使用 `print` 的方式呈現，僅顯示部分摘要欄位。可根據個人需求修改 callback 函式以取得完整欄位內容，並串接其他應用（行情管理、觸價單等）。請避免在函式內進行運算。

### Tick

decorator 方式

```
from shioaji import TickFOPv1, Exchange

@api.on_tick_fop_v1()
def quote_callback(exchange: Exchange, tick: TickFOPv1):
    print(f"exchange={exchange}")
    print(f"code={tick.code}")
    print(f"date={tick.date}")
    print(f"time={tick.time}")
    print(f"datetime={tick.datetime}")
    print(f"open={tick.open}")
    print(f"underlying_price={tick.underlying_price}")
    print(f"bid_side_total_vol={tick.bid_side_total_vol}")
    print(f"ask_side_total_vol={tick.ask_side_total_vol}")
    print(f"avg_price={tick.avg_price}")
    print(f"close={tick.close}")
    print(f"high={tick.high}")
    print(f"low={tick.low}")
    print(f"amount={tick.amount}")
    print(f"total_amount={tick.total_amount}")
    print(f"volume={tick.volume}")
    print(f"total_volume={tick.total_volume}")
    print(f"tick_type={tick.tick_type}")
    print(f"chg_type={tick.chg_type}")
    print(f"price_chg={tick.price_chg}")
    print(f"pct_chg={tick.pct_chg}")
    print(f"simtrade={tick.simtrade}")

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Tick,
)

```

傳統方式

```
from shioaji import TickFOPv1, Exchange

def quote_callback(exchange: Exchange, tick: TickFOPv1):
    print(f"{exchange} {tick}")

api.set_on_tick_fop_v1_callback(quote_callback)

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Tick,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok
exchange=Exchange.TAIFEX
code=TXFF6
date=(2026, 5, 20)
time=(19, 15, 1, 284000)
datetime=(2026, 5, 20, 19, 15, 1, 284000)
open=40270
underlying_price=40020.82
bid_side_total_vol=7711
ask_side_total_vol=6109
avg_price=40465.465254
close=40598
high=40650
low=40221
amount=40598
total_amount=572990988
volume=1
total_volume=14160
tick_type=2
chg_type=2
price_chg=474
pct_chg=1.181338
simtrade=False

```

### BidAsk

decorator 方式

```
from shioaji import BidAskFOPv1, Exchange

@api.on_bidask_fop_v1()
def quote_callback(exchange: Exchange, bidask: BidAskFOPv1):
    print(f"exchange={exchange}")
    print(f"code={bidask.code}")
    print(f"date={bidask.date}")
    print(f"time={bidask.time}")
    print(f"datetime={bidask.datetime}")
    print(f"bid_total_vol={bidask.bid_total_vol}")
    print(f"ask_total_vol={bidask.ask_total_vol}")
    print(f"bid_price={bidask.bid_price}")
    print(f"bid_volume={bidask.bid_volume}")
    print(f"diff_bid_vol={bidask.diff_bid_vol}")
    print(f"ask_price={bidask.ask_price}")
    print(f"ask_volume={bidask.ask_volume}")
    print(f"diff_ask_vol={bidask.diff_ask_vol}")
    print(f"first_derived_bid_price={bidask.first_derived_bid_price}")
    print(f"first_derived_ask_price={bidask.first_derived_ask_price}")
    print(f"first_derived_bid_vol={bidask.first_derived_bid_vol}")
    print(f"first_derived_ask_vol={bidask.first_derived_ask_vol}")
    print(f"underlying_price={bidask.underlying_price}")
    print(f"simtrade={bidask.simtrade}")

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.BidAsk,
)

```

傳統方式

```
from shioaji import BidAskFOPv1, Exchange

def quote_callback(exchange: Exchange, bidask: BidAskFOPv1):
    print(f"{exchange} {bidask}")

api.set_on_bidask_fop_v1_callback(quote_callback)

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.BidAsk,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok
exchange=Exchange.TAIFEX
code=TXFF6
date=(2026, 5, 20)
time=(19, 25, 54, 637000)
datetime=(2026, 5, 20, 19, 25, 54, 637000)
bid_total_vol=21
ask_total_vol=21
bid_price=[Decimal('40613'), Decimal('40612'), Decimal('40611'), Decimal('40610'), Decimal('40609')]
bid_volume=[1, 2, 6, 4, 8]
diff_bid_vol=[-1, 1, 0, 0, 0]
ask_price=[Decimal('40617'), Decimal('40618'), Decimal('40619'), Decimal('40620'), Decimal('40621')]
ask_volume=[4, 7, 5, 3, 2]
diff_ask_vol=[-1, 0, 0, 0, 0]
first_derived_bid_price=0
first_derived_ask_price=0
first_derived_bid_vol=0
first_derived_ask_vol=0
underlying_price=40020.82
simtrade=False

```

### Quote

decorator 方式

```
from shioaji import QuoteFOPv1, Exchange

@api.on_quote_fop_v1()
def quote_callback(exchange: Exchange, quote: QuoteFOPv1):
    print(f"exchange={exchange}")
    print(f"code={quote.code}")
    print(f"date={quote.date}")
    print(f"time={quote.time}")
    print(f"datetime={quote.datetime}")
    print(f"underlying_price={quote.underlying_price}")
    print(f"open={quote.open}")
    print(f"avg_price={quote.avg_price}")
    print(f"close={quote.close}")
    print(f"high={quote.high}")
    print(f"low={quote.low}")
    print(f"amount={quote.amount}")
    print(f"total_amount={quote.total_amount}")
    print(f"volume={quote.volume}")
    print(f"total_volume={quote.total_volume}")
    print(f"tick_type={quote.tick_type}")
    print(f"chg_type={quote.chg_type}")
    print(f"price_chg={quote.price_chg}")
    print(f"pct_chg={quote.pct_chg}")
    print(f"bid_side_total_vol={quote.bid_side_total_vol}")
    print(f"ask_side_total_vol={quote.ask_side_total_vol}")
    print(f"bid_side_total_cnt={quote.bid_side_total_cnt}")
    print(f"ask_side_total_cnt={quote.ask_side_total_cnt}")
    print(f"bid_price={quote.bid_price}")
    print(f"bid_volume={quote.bid_volume}")
    print(f"diff_bid_vol={quote.diff_bid_vol}")
    print(f"ask_price={quote.ask_price}")
    print(f"ask_volume={quote.ask_volume}")
    print(f"diff_ask_vol={quote.diff_ask_vol}")
    print(f"first_derived_bid_price={quote.first_derived_bid_price}")
    print(f"first_derived_ask_price={quote.first_derived_ask_price}")
    print(f"first_derived_bid_vol={quote.first_derived_bid_vol}")
    print(f"first_derived_ask_vol={quote.first_derived_ask_vol}")
    print(f"simtrade={quote.simtrade}")

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Quote,
)

```

傳統方式

```
from shioaji import QuoteFOPv1, Exchange

def quote_callback(exchange: Exchange, quote: QuoteFOPv1):
    print(f"{exchange} {quote}")

api.set_on_quote_fop_v1_callback(quote_callback)

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Quote,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok
exchange=Exchange.TAIFEX
code=TXFF6
date=(2026, 5, 20)
time=(19, 31, 3, 387000)
datetime=(2026, 5, 20, 19, 31, 3, 387000)
underlying_price=40020.82
open=40270
avg_price=40467.404028
close=40629
high=40650
low=40221
amount=121887
total_amount=580626313
volume=0
total_volume=14348
tick_type=1
chg_type=2
price_chg=505
pct_chg=1.258598
bid_side_total_vol=7825
ask_side_total_vol=6182
bid_side_total_cnt=9966
ask_side_total_cnt=10498
bid_price=[Decimal('40625'), Decimal('40624'), Decimal('40623'), Decimal('40622'), Decimal('40621')]
bid_volume=[1, 3, 11, 6, 1]
diff_bid_vol=[0, 0, 0, 0, 0]
ask_price=[Decimal('40628'), Decimal('40629'), Decimal('40630'), Decimal('40631'), Decimal('40632')]
ask_volume=[1, 1, 3, 4, 2]
diff_ask_vol=[0, 0, 0, 0, 0]
first_derived_bid_price=0
first_derived_ask_price=0
first_derived_bid_vol=0
first_derived_ask_vol=0
simtrade=False

```
