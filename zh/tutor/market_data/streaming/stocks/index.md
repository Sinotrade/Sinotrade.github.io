即時行情是交易所即時轉送的市場資料，僅在開盤時段才會推送。利用訂閱[商品檔](../../../contract/)的方式即可開始接收即時行情。

提醒

即時行情訂閱不會佔用流量。

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
contract:     要訂閱的商品檔（由 api.Contracts.* 取得）
quote_type:   訂閱類型 {'tick', 'bid_ask', 'quote'}
intraday_odd: 盤中零股 {True, False}

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
--code:          要訂閱的商品代碼（例如 2330、TXFR1）
--quote-type:    訂閱類型 {tick, bid_ask, quote}，預設 tick
--security-type: 商品類型 {STK, FUT, OPT, IND}，預設 STK
--intraday-odd:  盤中零股（flag，加上即啟用）

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
  "quote_type":    <QuoteType>,
  "intraday_odd":  <bool>
}

```

Quote Parameters:

```
security_type: 商品類型 {STK, FUT, OPT, IND}
exchange:      交易所 {TSE, OTC, OES, TAIFEX}
code:          商品代碼（例如 2330、TXFE5）
target_code:   對應實際商品代碼。選填，期貨連續月（TXFR1/R2）才會用到，股票不需指定
quote_type:    訂閱類型 {Tick, BidAsk, Quote}
intraday_odd:  盤中零股 {true, false}，預設 false

```

## Tick

#### 整股

In

```
api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Tick,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Stocks.TSE.TSE2890,
#     quote_type=sj.QuoteType.Tick,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/STK/*/TSE/2890 | Event: Subscribe or Unsubscribe ok

TickSTKv1(
    code='2890',
    date=2026-05-21,
    time=09:14:55,
    close=29.9,
    volume=8,
    high=30,
    low=29.75,
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback-%E5%83%85-python) 章節自訂 callback 函式。

#### 盤中零股

In

```
api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Tick,
    intraday_odd=True,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Stocks.TSE.TSE2890,
#     quote_type=sj.QuoteType.Tick,
#     intraday_odd=True,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/ODD/*/TSE/2890 | Event: Subscribe or Unsubscribe ok

TickSTKv1(
    code='2890',
    date=2026-05-21,
    time=09:22:43,
    close=30,
    volume=100,
    high=30.05,
    low=29.9,
)

```

**整股**

In

```
shioaji data stream --code 2890 --quote-type tick
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to 2890 tick (Ctrl+C to stop)
{
  "code": "2890",
  "date": "2026-05-21",
  "time": "09:16:15.060129",
  "open": "29.8",
  "avg_price": "29.86",
  "close": "29.85",
  "high": "30",
  "low": "29.75",
  "amount": "149250",
  "amount_sum": "108902650",
  "volume": 5,
  "vol_sum": 3646,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "0.05",
  "diff_rate": 16,
  "trade_bid_vol_sum": 1760,
  "trade_ask_vol_sum": 1321,
  "trade_bid_cnt": 127,
  "trade_ask_cnt": 61,
  "closing_oddlot_shares": 0,
  "closing_oddlot_close": null,
  "closing_oddlot_amount": "0",
  "closing_oddlot_bid_price": null,
  "closing_oddlot_ask_price": null,
  "fixed_trade_volume": 0,
  "fixed_trade_amount": "0",
  "suspend": false,
  "simtrade": false,
  "intraday_odd": false
}

```

**盤中零股**

In

```
shioaji data stream --code 2890 --quote-type tick --intraday-odd
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to 2890 tick (Ctrl+C to stop)
{
  "code": "2890",
  "date": "2026-05-21",
  "time": "09:23:38.407268",
  "open": "30.05",
  "avg_price": "29.962006",
  "close": "30",
  "high": "30.05",
  "low": "29.9",
  "amount": "60",
  "amount_sum": "640887.3",
  "volume": 2,
  "vol_sum": 21390,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "0.2",
  "diff_rate": 67,
  "trade_bid_vol_sum": 11006,
  "trade_ask_vol_sum": 10384,
  "trade_bid_cnt": 36,
  "trade_ask_cnt": 20,
  "closing_oddlot_shares": 0,
  "closing_oddlot_close": null,
  "closing_oddlot_amount": null,
  "closing_oddlot_bid_price": null,
  "closing_oddlot_ask_price": null,
  "fixed_trade_volume": 0,
  "fixed_trade_amount": null,
  "suspend": false,
  "simtrade": false,
  "intraday_odd": true
}

```

**整股**

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "quote_type": "Tick"
  }'

# 開 SSE 收 tick（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/tick_stk

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "STK",
#     "exchange": "TSE",
#     "code": "2890",
#     "quote_type": "Tick"
#   }'

```

Out

```
event:tick_stk
data:{
  "code": "2890",
  "date": "2026-05-21",
  "time": "09:18:31.867798",
  "open": "29.8",
  "avg_price": "29.86",
  "close": "29.9",
  "high": "30",
  "low": "29.75",
  "amount": "29900",
  "amount_sum": "109559950",
  "volume": 1,
  "vol_sum": 3668,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "0.1",
  "diff_rate": 33,
  "trade_bid_vol_sum": 1781,
  "trade_ask_vol_sum": 1322,
  "trade_bid_cnt": 135,
  "trade_ask_cnt": 62,
  "closing_oddlot_shares": 0,
  "closing_oddlot_close": null,
  "closing_oddlot_amount": "0",
  "closing_oddlot_bid_price": null,
  "closing_oddlot_ask_price": null,
  "fixed_trade_volume": 0,
  "fixed_trade_amount": "0",
  "suspend": false,
  "simtrade": false,
  "intraday_odd": false
}

```

**盤中零股**

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "quote_type": "Tick",
    "intraday_odd": true
  }'

# 開 SSE 收 tick（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/tick_stk

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "STK",
#     "exchange": "TSE",
#     "code": "2890",
#     "quote_type": "Tick",
#     "intraday_odd": true
#   }'

```

Out

```
event:tick_stk
data:{
  "code": "2890",
  "date": "2026-05-21",
  "time": "09:25:04.321657",
  "open": "30.05",
  "avg_price": "29.963436",
  "close": "29.95",
  "high": "30.05",
  "low": "29.9",
  "amount": "1497.5",
  "amount_sum": "683645.75",
  "volume": 50,
  "vol_sum": 22816,
  "tick_type": 2,
  "diff_type": 2,
  "diff_price": "0.15",
  "diff_rate": 50,
  "trade_bid_vol_sum": 12001,
  "trade_ask_vol_sum": 10815,
  "trade_bid_cnt": 38,
  "trade_ask_cnt": 24,
  "closing_oddlot_shares": 0,
  "closing_oddlot_close": null,
  "closing_oddlot_amount": null,
  "closing_oddlot_bid_price": null,
  "closing_oddlot_ask_price": null,
  "fixed_trade_volume": 0,
  "fixed_trade_amount": null,
  "suspend": false,
  "simtrade": false,
  "intraday_odd": true
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
avg_price (Decimal)                      均價
close (Decimal)                          成交價
high (Decimal)                           最高價（自開盤）
low (Decimal)                            最低價（自開盤）
amount (Decimal)                         單筆成交額 (NTD)
amount_sum (Decimal)                     總成交額 (NTD)
volume (int)                             單筆成交量（整股：張；盤中零股：股）
vol_sum (int)                            總成交量（整股：張；盤中零股：股）
tick_type (int)                          內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
diff_type (int)                          漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
diff_price (Decimal)                     漲跌
diff_rate (int)                          漲跌幅 (%)
trade_bid_vol_sum (int)                  買盤成交總量（整股：張；盤中零股：股）
trade_ask_vol_sum (int)                  賣盤成交總量（整股：張；盤中零股：股）
trade_bid_cnt (int)                      買盤成交筆數
trade_ask_cnt (int)                      賣盤成交筆數
closing_oddlot_shares (int)              盤後零股成交股數（股）
closing_oddlot_close (Decimal)           盤後零股成交價
closing_oddlot_amount (Decimal)          盤後零股成交額
closing_oddlot_bid_price (Decimal)       盤後零股最高買價
closing_oddlot_ask_price (Decimal)       盤後零股最低賣價
fixed_trade_volume (int)                 定盤成交量（整股：張；盤中零股：股）
fixed_trade_amount (Decimal)             定盤成交額
suspend (bool)                           暫停交易
simtrade (bool)                          試撮
intraday_odd (bool)                      盤中零股 {True, False}

```

## BidAsk

#### 整股

In

```
api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.BidAsk,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Stocks.TSE.TSE2890,
#     quote_type=sj.QuoteType.BidAsk,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/STK/*/TSE/2890 | Event: Subscribe or Unsubscribe ok

BidAskSTKv1(
    code='2890',
    date=2026-05-21,
    time=09:53:26,
    bid_price=[29.75, 29.7, 29.65, 29.6, 29.55],
    ask_price=[29.8, 29.85, 29.9, 29.95, 30],
    bid_volume=[252, 1369, 377, 631, 206],
    ask_volume=[50, 101, 57, 156, 725],
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback-%E5%83%85-python) 章節自訂 callback 函式。

#### 盤中零股

In

```
api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.BidAsk,
    intraday_odd=True,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Stocks.TSE.TSE2890,
#     quote_type=sj.QuoteType.BidAsk,
#     intraday_odd=True,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/ODD/*/TSE/2890 | Event: Subscribe or Unsubscribe ok

BidAskSTKv1(
    code='2890',
    date=2026-05-21,
    time=10:00:50,
    bid_price=[29.85, 29.8, 29.75, 29.7, 29.65],
    ask_price=[29.9, 29.95, 30, 30.05, 30.1],
    bid_volume=[3552, 38563, 28811, 24393, 9313],
    ask_volume=[1969, 7480, 8764, 2556, 1496],
)

```

**整股**

In

```
shioaji data stream --code 2890 --quote-type bid_ask
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to 2890 bid_ask (Ctrl+C to stop)
{
  "code": "2890",
  "date": "2026-05-21",
  "time": "10:02:07.514794",
  "bid_price": ["29.75", "29.7", "29.65", "29.6", "29.55"],
  "bid_volume": [468, 1174, 369, 658, 208],
  "diff_bid_vol": [1, 0, 0, 0, 0],
  "ask_price": ["29.85", "29.9", "29.95", "30", "30.05"],
  "ask_volume": [125, 92, 163, 731, 307],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "suspend": false,
  "simtrade": false,
  "intraday_odd": false
}

```

**盤中零股**

In

```
shioaji data stream --code 2890 --quote-type bid_ask --intraday-odd
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to 2890 bid_ask (Ctrl+C to stop)
{
  "code": "2890",
  "date": "2026-05-21",
  "time": "10:02:37.104099",
  "bid_price": ["29.85", "29.8", "29.75", "29.7", "29.65"],
  "bid_volume": [3459, 38649, 28661, 25073, 9533],
  "diff_bid_vol": [4888, 8004, 14481, 5578, 2164],
  "ask_price": ["29.9", "29.95", "30", "30.05", "30.1"],
  "ask_volume": [6665, 7480, 2770, 2556, 1496],
  "diff_ask_vol": [-18835, 23368, 13381, -2380, 619],
  "suspend": false,
  "simtrade": false,
  "intraday_odd": true
}

```

**整股**

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "quote_type": "BidAsk"
  }'

# 開 SSE 收 bid/ask（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/bidask_stk

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "STK",
#     "exchange": "TSE",
#     "code": "2890",
#     "quote_type": "BidAsk"
#   }'

```

Out

```
event:bidask_stk
data:{
  "code": "2890",
  "date": "2026-05-21",
  "time": "10:04:14.790669",
  "bid_price": ["29.8", "29.75", "29.7", "29.65", "29.6"],
  "bid_volume": [1, 469, 1198, 357, 676],
  "diff_bid_vol": [-8, 0, 0, 0, 0],
  "ask_price": ["29.85", "29.9", "29.95", "30", "30.05"],
  "ask_volume": [105, 75, 175, 731, 307],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "suspend": false,
  "simtrade": false,
  "intraday_odd": false
}

```

**盤中零股**

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "quote_type": "BidAsk",
    "intraday_odd": true
  }'

# 開 SSE 收 bid/ask（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/bidask_stk

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "STK",
#     "exchange": "TSE",
#     "code": "2890",
#     "quote_type": "BidAsk",
#     "intraday_odd": true
#   }'

```

Out

```
event:bidask_stk
data:{
  "code": "2890",
  "date": "2026-05-21",
  "time": "10:05:20.045766",
  "bid_price": ["29.85", "29.8", "29.75", "29.7", "29.65"],
  "bid_volume": [5506, 39266, 28696, 26258, 9941],
  "diff_bid_vol": [-704, 31103, 14180, 21365, 7369],
  "ask_price": ["29.9", "29.95", "30", "30.05", "30.1"],
  "ask_volume": [1478, 7480, 2770, 2556, 1496],
  "diff_ask_vol": [27302, -15888, -16605, 4936, 877],
  "suspend": false,
  "simtrade": false,
  "intraday_odd": true
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
bid_price (list[Decimal])                五檔委買價
bid_volume (list[int])                   五檔委買量（整股：張；盤中零股：股）
diff_bid_vol (list[int])                 五檔委買價增減量（整股：張；盤中零股：股）
ask_price (list[Decimal])                五檔委賣價
ask_volume (list[int])                   五檔委賣量（整股：張；盤中零股：股）
diff_ask_vol (list[int])                 五檔委賣價增減量（整股：張；盤中零股：股）
suspend (bool)                           暫停交易
simtrade (bool)                          試撮
intraday_odd (bool)                      盤中零股 {True, False}

```

## Quote

#### 整股

In

```
api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Quote,
)

# 取消訂閱
# api.unsubscribe(
#     api.Contracts.Stocks.TSE.TSE2890,
#     quote_type=sj.QuoteType.Quote,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/STK/*/TSE/2890 | Event: Subscribe or Unsubscribe ok

QuoteSTKv1(
    code='2890',
    date=2026-05-21,
    time=10:07:52,
    close=29.8,
    volume=1,
    high=30,
    low=29.7,
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback-%E5%83%85-python) 章節自訂 callback 函式。

**整股**

In

```
shioaji data stream --code 2890 --quote-type quote
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to 2890 quote (Ctrl+C to stop)
{
  "code": "2890",
  "date": "2026-05-21",
  "time": "10:08:57.608688",
  "open": "29.8",
  "avg_price": "29.82",
  "close": "29.8",
  "high": "30",
  "low": "29.7",
  "amount": "178800",
  "amount_sum": "247076900",
  "volume": 0,
  "vol_sum": 8284,
  "tick_type": 1,
  "diff_type": 3,
  "diff_price": "0",
  "diff_rate": 0,
  "trade_bid_vol_sum": 3279,
  "trade_ask_vol_sum": 4440,
  "trade_bid_cnt": 625,
  "trade_ask_cnt": 279,
  "closing_oddlot_shares": 0,
  "closing_oddlot_close": null,
  "closing_oddlot_amount": "0",
  "closing_oddlot_bid_price": null,
  "closing_oddlot_ask_price": null,
  "fixed_trade_volume": 0,
  "fixed_trade_amount": "0",
  "bid_price": ["29.75", "29.7", "29.65", "29.6", "29.55"],
  "bid_volume": [501, 1235, 360, 673, 218],
  "diff_bid_vol": [0, 3, 0, 0, 0],
  "ask_price": ["29.8", "29.85", "29.9", "29.95", "30"],
  "ask_volume": [47, 129, 81, 179, 736],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "avail_borrowing": 8896631,
  "suspend": false,
  "simtrade": false
}

```

**整股**

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "quote_type": "Quote"
  }'

# 開 SSE 收 quote（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/quote_stk

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "STK",
#     "exchange": "TSE",
#     "code": "2890",
#     "quote_type": "Quote"
#   }'

```

Out

```
event:quote_stk
data:{
  "code": "2890",
  "date": "2026-05-21",
  "time": "10:10:04.164422",
  "open": "29.8",
  "avg_price": "29.82",
  "close": "29.8",
  "high": "30",
  "low": "29.7",
  "amount": "149000",
  "amount_sum": "247941050",
  "volume": 5,
  "vol_sum": 8313,
  "tick_type": 1,
  "diff_type": 3,
  "diff_price": "0",
  "diff_rate": 0,
  "trade_bid_vol_sum": 3303,
  "trade_ask_vol_sum": 4445,
  "trade_bid_cnt": 635,
  "trade_ask_cnt": 284,
  "closing_oddlot_shares": 0,
  "closing_oddlot_close": null,
  "closing_oddlot_amount": "0",
  "closing_oddlot_bid_price": null,
  "closing_oddlot_ask_price": null,
  "fixed_trade_volume": 0,
  "fixed_trade_amount": "0",
  "bid_price": ["29.75", "29.7", "29.65", "29.6", "29.55"],
  "bid_volume": [522, 1236, 373, 667, 218],
  "diff_bid_vol": [0, 0, 0, 0, 0],
  "ask_price": ["29.8", "29.85", "29.9", "29.95", "30"],
  "ask_volume": [34, 158, 83, 172, 736],
  "diff_ask_vol": [-5, 0, 0, 0, 0],
  "avail_borrowing": 8894631,
  "suspend": false,
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
open (Decimal)                           開盤價
avg_price (Decimal)                      均價
close (Decimal)                          成交價
high (Decimal)                           最高價（自開盤）
low (Decimal)                            最低價（自開盤）
amount (Decimal)                         單筆成交額 (NTD)
amount_sum (Decimal)                     總成交額 (NTD)
volume (int)                             單筆成交量（張）
vol_sum (int)                            總成交量（張）
tick_type (int)                          內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
diff_type (int)                          漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
diff_price (Decimal)                     漲跌
diff_rate (int)                          漲跌幅 (%)
trade_bid_vol_sum (int)                  買盤成交總量（張）
trade_ask_vol_sum (int)                  賣盤成交總量（張）
trade_bid_cnt (int)                      買盤成交筆數
trade_ask_cnt (int)                      賣盤成交筆數
closing_oddlot_shares (int)              盤後零股成交股數（股）
closing_oddlot_close (Decimal)           盤後零股成交價
closing_oddlot_amount (Decimal)          盤後零股成交額
closing_oddlot_bid_price (Decimal)       盤後零股最高買價
closing_oddlot_ask_price (Decimal)       盤後零股最低賣價
fixed_trade_volume (int)                 定盤成交量（張）
fixed_trade_amount (Decimal)             定盤成交額
bid_price (list[Decimal])                五檔委買價
bid_volume (list[int])                   五檔委買量（張）
diff_bid_vol (list[int])                 五檔委買價增減量（張）
ask_price (list[Decimal])                五檔委賣價
ask_volume (list[int])                   五檔委賣量（張）
diff_ask_vol (list[int])                 五檔委賣價增減量（張）
avail_borrowing (int)                    借券可用餘額
suspend (bool)                           暫停交易
simtrade (bool)                          試撮

```

## Callback（僅 Python）

預設狀況下我們將即時行情使用 `print` 的方式呈現，僅顯示部分摘要欄位。可根據個人需求修改 callback 函式以取得完整欄位內容，並串接其他應用（行情管理、觸價單等）。請避免在函式內進行運算。

- 盤中零股與一般證券共用 callback 函式。
- 更進階的 callback 使用可以參見[綁訂報價模式](../../../advanced/quote_binding/)。

### Tick

decorator 方式

```
from shioaji import TickSTKv1, Exchange

@api.on_tick_stk_v1()
def quote_callback(exchange: Exchange, tick: TickSTKv1):
    print(f"exchange={exchange}")
    print(f"code={tick.code}")
    print(f"date={tick.date}")
    print(f"time={tick.time}")
    print(f"datetime={tick.datetime}")
    print(f"open={tick.open}")
    print(f"avg_price={tick.avg_price}")
    print(f"close={tick.close}")
    print(f"high={tick.high}")
    print(f"low={tick.low}")
    print(f"amount={tick.amount}")
    print(f"amount_sum={tick.amount_sum}")
    print(f"volume={tick.volume}")
    print(f"vol_sum={tick.vol_sum}")
    print(f"tick_type={tick.tick_type}")
    print(f"diff_type={tick.diff_type}")
    print(f"diff_price={tick.diff_price}")
    print(f"diff_rate={tick.diff_rate}")
    print(f"trade_bid_vol_sum={tick.trade_bid_vol_sum}")
    print(f"trade_ask_vol_sum={tick.trade_ask_vol_sum}")
    print(f"trade_bid_cnt={tick.trade_bid_cnt}")
    print(f"trade_ask_cnt={tick.trade_ask_cnt}")
    print(f"closing_oddlot_shares={tick.closing_oddlot_shares}")
    print(f"closing_oddlot_close={tick.closing_oddlot_close}")
    print(f"closing_oddlot_amount={tick.closing_oddlot_amount}")
    print(f"closing_oddlot_bid_price={tick.closing_oddlot_bid_price}")
    print(f"closing_oddlot_ask_price={tick.closing_oddlot_ask_price}")
    print(f"fixed_trade_volume={tick.fixed_trade_volume}")
    print(f"fixed_trade_amount={tick.fixed_trade_amount}")
    print(f"suspend={tick.suspend}")
    print(f"simtrade={tick.simtrade}")
    print(f"intraday_odd={tick.intraday_odd}")

api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Tick,
)

```

傳統方式

```
from shioaji import TickSTKv1, Exchange

def quote_callback(exchange: Exchange, tick: TickSTKv1):
    print(f"{exchange} {tick}")

api.set_on_tick_stk_v1_callback(quote_callback)

api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Tick,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/STK/*/TSE/2890 | Event: Subscribe or Unsubscribe ok
exchange=Exchange.TSE
code=2890
date=(2026, 5, 21)
time=(9, 20, 39, 959231)
datetime=(2026, 5, 21, 9, 20, 39, 959231)
open=29.8
avg_price=29.86
close=29.9
high=30
low=29.75
amount=29900
amount_sum=110307300
volume=1
vol_sum=3693
tick_type=1
diff_type=2
diff_price=0.1
diff_rate=33
trade_bid_vol_sum=1803
trade_ask_vol_sum=1325
trade_bid_cnt=144
trade_ask_cnt=64
closing_oddlot_shares=0
closing_oddlot_close=None
closing_oddlot_amount=0
closing_oddlot_bid_price=None
closing_oddlot_ask_price=None
fixed_trade_volume=0
fixed_trade_amount=0
suspend=False
simtrade=False
intraday_odd=False

```

### BidAsk

decorator 方式

```
from shioaji import BidAskSTKv1, Exchange

@api.on_bidask_stk_v1()
def quote_callback(exchange: Exchange, bidask: BidAskSTKv1):
    print(f"exchange={exchange}")
    print(f"code={bidask.code}")
    print(f"date={bidask.date}")
    print(f"time={bidask.time}")
    print(f"datetime={bidask.datetime}")
    print(f"bid_price={bidask.bid_price}")
    print(f"bid_volume={bidask.bid_volume}")
    print(f"diff_bid_vol={bidask.diff_bid_vol}")
    print(f"ask_price={bidask.ask_price}")
    print(f"ask_volume={bidask.ask_volume}")
    print(f"diff_ask_vol={bidask.diff_ask_vol}")
    print(f"suspend={bidask.suspend}")
    print(f"simtrade={bidask.simtrade}")
    print(f"intraday_odd={bidask.intraday_odd}")

api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.BidAsk,
)

```

傳統方式

```
from shioaji import BidAskSTKv1, Exchange

def quote_callback(exchange: Exchange, bidask: BidAskSTKv1):
    print(f"{exchange} {bidask}")

api.set_on_bidask_stk_v1_callback(quote_callback)

api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.BidAsk,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/STK/*/TSE/2890 | Event: Subscribe or Unsubscribe ok
exchange=Exchange.TSE
code=2890
date=(2026, 5, 21)
time=(9, 57, 57, 278770)
datetime=(2026, 5, 21, 9, 57, 57, 278770)
bid_price=[Decimal('29.75'), Decimal('29.7'), Decimal('29.65'), Decimal('29.6'), Decimal('29.55')]
bid_volume=[337, 1423, 374, 644, 203]
diff_bid_vol=[1, 0, 0, 0, 0]
ask_price=[Decimal('29.8'), Decimal('29.85'), Decimal('29.9'), Decimal('29.95'), Decimal('30')]
ask_volume=[37, 92, 70, 163, 731]
diff_ask_vol=[0, 0, 0, 0, 0]
suspend=False
simtrade=False
intraday_odd=False

```

### Quote

decorator 方式

```
from shioaji import QuoteSTKv1, Exchange

@api.on_quote_stk_v1()
def quote_callback(exchange: Exchange, quote: QuoteSTKv1):
    print(f"exchange={exchange}")
    print(f"code={quote.code}")
    print(f"date={quote.date}")
    print(f"time={quote.time}")
    print(f"datetime={quote.datetime}")
    print(f"open={quote.open}")
    print(f"avg_price={quote.avg_price}")
    print(f"close={quote.close}")
    print(f"high={quote.high}")
    print(f"low={quote.low}")
    print(f"amount={quote.amount}")
    print(f"amount_sum={quote.amount_sum}")
    print(f"volume={quote.volume}")
    print(f"vol_sum={quote.vol_sum}")
    print(f"tick_type={quote.tick_type}")
    print(f"diff_type={quote.diff_type}")
    print(f"diff_price={quote.diff_price}")
    print(f"diff_rate={quote.diff_rate}")
    print(f"trade_bid_vol_sum={quote.trade_bid_vol_sum}")
    print(f"trade_ask_vol_sum={quote.trade_ask_vol_sum}")
    print(f"trade_bid_cnt={quote.trade_bid_cnt}")
    print(f"trade_ask_cnt={quote.trade_ask_cnt}")
    print(f"closing_oddlot_shares={quote.closing_oddlot_shares}")
    print(f"closing_oddlot_close={quote.closing_oddlot_close}")
    print(f"closing_oddlot_amount={quote.closing_oddlot_amount}")
    print(f"closing_oddlot_bid_price={quote.closing_oddlot_bid_price}")
    print(f"closing_oddlot_ask_price={quote.closing_oddlot_ask_price}")
    print(f"fixed_trade_volume={quote.fixed_trade_volume}")
    print(f"fixed_trade_amount={quote.fixed_trade_amount}")
    print(f"bid_price={quote.bid_price}")
    print(f"bid_volume={quote.bid_volume}")
    print(f"diff_bid_vol={quote.diff_bid_vol}")
    print(f"ask_price={quote.ask_price}")
    print(f"ask_volume={quote.ask_volume}")
    print(f"diff_ask_vol={quote.diff_ask_vol}")
    print(f"avail_borrowing={quote.avail_borrowing}")
    print(f"suspend={quote.suspend}")
    print(f"simtrade={quote.simtrade}")

api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Quote,
)

```

傳統方式

```
from shioaji import QuoteSTKv1, Exchange

def quote_callback(exchange: Exchange, quote: QuoteSTKv1):
    print(f"{exchange} {quote}")

api.set_on_quote_stk_v1_callback(quote_callback)

api.subscribe(
    api.Contracts.Stocks.TSE.TSE2890,
    quote_type=sj.QuoteType.Quote,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/STK/*/TSE/2890 | Event: Subscribe or Unsubscribe ok
exchange=Exchange.TSE
code=2890
date=(2026, 5, 21)
time=(10, 12, 14, 687147)
datetime=(2026, 5, 21, 10, 12, 14, 687147)
open=29.8
avg_price=29.82
close=29.8
high=30
low=29.7
amount=29800
amount_sum=249103250
volume=0
vol_sum=8352
tick_type=1
diff_type=3
diff_price=0
diff_rate=0
trade_bid_vol_sum=3342
trade_ask_vol_sum=4445
trade_bid_cnt=653
trade_ask_cnt=284
closing_oddlot_shares=0
closing_oddlot_close=None
closing_oddlot_amount=0
closing_oddlot_bid_price=None
closing_oddlot_ask_price=None
fixed_trade_volume=0
fixed_trade_amount=0
bid_price=[Decimal('29.75'), Decimal('29.7'), Decimal('29.65'), Decimal('29.6'), Decimal('29.55')]
bid_volume=[570, 1242, 677, 691, 222]
diff_bid_vol=[0, 0, 0, -1, 0]
ask_price=[Decimal('29.8'), Decimal('29.85'), Decimal('29.9'), Decimal('29.95'), Decimal('30')]
ask_volume=[9, 158, 85, 179, 739]
diff_ask_vol=[0, 0, 0, 0, 0]
avail_borrowing=8894631
suspend=False
simtrade=False

```
