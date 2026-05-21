Real-time market data for futures / options is event-driven feed pushed by the exchange. It is only delivered during trading hours. Subscribe a [contract](../../../contract/) to start receiving real-time market data.

Tip

Real-time market data subscriptions do not consume bandwidth.

Subscribing to continuous-month contracts (TXFR1 / TXFR2)

- **Python / CLI** can subscribe directly with `TXFR1` / `TXFR2`; the binding resolves the underlying contract code automatically.
- **HTTP and other languages** must first call [Contract lookup](../../../contract/) to obtain `target_code` (e.g. `TXFF6`), and include both `code: "TXFR1"` and `target_code: "TXFF6"` in the subscribe body. Otherwise the server still returns 200, but the SSE stream only emits heartbeats — no ticks will arrive.

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
contract:     Contract to subscribe (obtained from api.Contracts.Futures.* or api.Contracts.Options.*)
quote_type:   Subscription type {'tick', 'bid_ask', 'quote'}
intraday_odd: Not supported for futures / options; always False

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
--code:          Security code to subscribe (futures / options, e.g. TXFR1, TXFF6, TXO20260526900C)
--quote-type:    Subscription type {tick, bid_ask, quote}, default tick
--security-type: Security type {STK, FUT, OPT, IND}; use FUT for futures, OPT for options
--intraday-odd:  Not supported for futures / options

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
security_type: Security type {FUT, OPT}
exchange:      Exchange {TAIFEX}
code:          Security code (e.g. TXFR1, TXFF6, TXO20260526900C)
target_code:   Resolved underlying contract code. Required for continuous-month (TXFR1 / TXFR2), otherwise the server returns 200 but no data is received
quote_type:    Subscription type {Tick, BidAsk, Quote}

```

## Tick

In

```
api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Tick,
)

# Unsubscribe
# api.unsubscribe(
#     api.Contracts.Futures.TXF.TXFR1,
#     quote_type=sj.QuoteType.Tick,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok

TickFOPv1(code='TXFF6', date=2026-05-20, time=18:46:34, close=40629, volume=1)

```

Show all fields

By default only a summary is shown. To get the full payload, refer to the [Callback](#callback-python-only) section below and define your own callback.

In

```
shioaji data stream --code TXFR1 --security-type FUT --quote-type tick
# Press Ctrl+C to stop; the CLI will unsubscribe automatically

```

Out

```
Subscribed to TXFR1 tick (Ctrl+C to stop)
{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "18:50:02.981000",
  "open": "40270",
  "target_kind_price": "40020.82",
  "trade_bid_vol_sum": 7498,
  "trade_ask_vol_sum": 5817,
  "avg_price": "40460.163149",
  "close": "40619",
  "high": "40650",
  "low": "40221",
  "amount": "81238",
  "amount_sum": "552038466",
  "volume": 2,
  "vol_sum": 13644,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "495",
  "diff_rate": "1.233676",
  "simtrade": false
}

```

In

```
# Step 1: Look up the contract and read out target_code
curl http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT

# Step 2: Subscribe with the target_code from step 1 (e.g. TXFF6)
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TXFR1",
    "target_code": "TXFF6",
    "quote_type": "Tick"
  }'

# Step 3: Open the SSE stream to receive ticks (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/tick_fop

# Unsubscribe
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

Out (Step 1: contract response)

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202606","delivery_date":"2026/06/17","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":44136.0,"limit_down":36112.0,"reference":40124.0,"update_date":"2026/05/20","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFF6"}

```

Out (Step 3: SSE tick)

```
event:tick_fop
data:{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "18:54:43.871000",
  "open": "40270",
  "target_kind_price": "40020.82",
  "trade_bid_vol_sum": 7540,
  "trade_ask_vol_sum": 5908,
  "avg_price": "40461.608055",
  "close": "40608",
  "high": "40650",
  "low": "40221",
  "amount": "40608",
  "amount_sum": "557560959",
  "volume": 1,
  "vol_sum": 13780,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "484",
  "diff_rate": "1.206261",
  "simtrade": false
}

```

### Attributes

Tick

```
code (str)                               Security code
exchange (Exchange)                      Exchange
date (tuple)                             Date
time (tuple)                             Trade time
datetime (tuple)                         Date and time
open (Decimal)                           Open price
target_kind_price (Decimal)              Underlying index price
avg_price (Decimal)                      Average price
close (Decimal)                          Trade price
high (Decimal)                           High (since open)
low (Decimal)                            Low (since open)
amount (Decimal)                         Trade amount (NTD)
amount_sum (Decimal)                     Cumulative trade amount (NTD)
volume (int)                             Trade volume (lot)
vol_sum (int)                            Cumulative trade volume (lot)
tick_type (int)                          Bid/ask side {1: ask, 2: bid, 0: undetermined}
diff_type (int)                          Change type {1: limit up, 2: up, 3: unchanged, 4: down, 5: limit down}
diff_price (Decimal)                     Price change
diff_rate (Decimal)                      Price change rate (%)
trade_bid_vol_sum (int)                  Cumulative bid-side trade volume (lot)
trade_ask_vol_sum (int)                  Cumulative ask-side trade volume (lot)
simtrade (bool)                          Trial match

```

## BidAsk

In

```
api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.BidAsk,
)

# Unsubscribe
# api.unsubscribe(
#     api.Contracts.Futures.TXF.TXFR1,
#     quote_type=sj.QuoteType.BidAsk,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok

BidAskFOPv1(code='TXFF6', date=2026-05-20, time=19:23:01, bid_price=[40605, 40603, 40602, 40601, 40600], ask_price=[40607, 40608, 40610, 40611, 40612], bid_volume=[1, 4, 2, 5, 5], ask_volume=[1, 1, 5, 2, 2])

```

Show all fields

By default only a summary is shown. To get the full payload, refer to the [Callback](#callback-python-only) section below and define your own callback.

In

```
shioaji data stream --code TXFR1 --security-type FUT --quote-type bid_ask
# Press Ctrl+C to stop; the CLI will unsubscribe automatically

```

Out

```
Subscribed to TXFR1 bid_ask (Ctrl+C to stop)
{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:24:03.012000",
  "bid_vol_sum": 8,
  "ask_vol_sum": 19,
  "bid_price": ["40615", "40613", "40612", "40611", "40610"],
  "bid_volume": [1, 2, 1, 2, 2],
  "diff_bid_vol": [0, 0, 0, 0, 1],
  "ask_price": ["40618", "40619", "40620", "40621", "40622"],
  "ask_volume": [6, 2, 3, 2, 6],
  "diff_ask_vol": [0, -1, -1, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "40622",
  "first_derived_bid_volume": 0,
  "first_derived_ask_volume": 1,
  "target_kind_price": "40020.82",
  "simtrade": false
}

```

In

```
# Step 1: Look up the contract and read out target_code
curl http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT

# Step 2: Subscribe with the target_code from step 1 (e.g. TXFF6)
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TXFR1",
    "target_code": "TXFF6",
    "quote_type": "BidAsk"
  }'

# Step 3: Open the SSE stream to receive bid/ask (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/bidask_fop

# Unsubscribe
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

Out (Step 1: contract response)

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202606","delivery_date":"2026/06/17","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":44136.0,"limit_down":36112.0,"reference":40124.0,"update_date":"2026/05/20","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFF6"}

```

Out (Step 3: SSE bid/ask)

```
event:bidask_fop
data:{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:24:38.512000",
  "bid_vol_sum": 19,
  "ask_vol_sum": 20,
  "bid_price": ["40613", "40612", "40611", "40610", "40609"],
  "bid_volume": [1, 3, 5, 3, 7],
  "diff_bid_vol": [-1, 0, 0, 0, 2],
  "ask_price": ["40618", "40619", "40620", "40621", "40622"],
  "ask_volume": [6, 2, 4, 2, 6],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "40622",
  "first_derived_bid_volume": 0,
  "first_derived_ask_volume": 1,
  "target_kind_price": "40020.82",
  "simtrade": false
}

```

### Attributes

BidAsk

```
code (str)                               Security code
exchange (Exchange)                      Exchange
date (tuple)                             Date
time (tuple)                             Time
datetime (tuple)                         Date and time
bid_vol_sum (int)                        Total bid volume (lot)
ask_vol_sum (int)                        Total ask volume (lot)
bid_price (list[Decimal])                Five-level bid prices
bid_volume (list[int])                   Five-level bid volumes (lot)
diff_bid_vol (list[int])                 Five-level bid volume change (lot)
ask_price (list[Decimal])                Five-level ask prices
ask_volume (list[int])                   Five-level ask volumes (lot)
diff_ask_vol (list[int])                 Five-level ask volume change (lot)
first_derived_bid_price (Decimal)        First-level derived bid price
first_derived_ask_price (Decimal)        First-level derived ask price
first_derived_bid_volume (int)           First-level derived bid volume (lot)
first_derived_ask_volume (int)           First-level derived ask volume (lot)
target_kind_price (Decimal)              Underlying index price
simtrade (bool)                          Trial match

```

## Quote

In

```
api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Quote,
)

# Unsubscribe
# api.unsubscribe(
#     api.Contracts.Futures.TXF.TXFR1,
#     quote_type=sj.QuoteType.Quote,
# )

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/FOP/*/TFE/TXFF6 | Event: Subscribe or Unsubscribe ok

QuoteFOPv1(code='TXFF6', date=2026-05-20, time=19:28:57, close=40610, volume=0)

```

Show all fields

By default only a summary is shown. To get the full payload, refer to the [Callback](#callback-python-only) section below and define your own callback.

In

```
shioaji data stream --code TXFR1 --security-type FUT --quote-type quote
# Press Ctrl+C to stop; the CLI will unsubscribe automatically

```

Out

```
Subscribed to TXFR1 quote (Ctrl+C to stop)
{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:29:39.887000",
  "target_kind_price": "40020.82",
  "open": "40270",
  "avg_price": "40466.730155",
  "close": "40616",
  "high": "40650",
  "low": "40221",
  "amount": "40616",
  "amount_sum": "578107707",
  "volume": 0,
  "vol_sum": 14286,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "492",
  "diff_rate": "1.226199",
  "trade_bid_vol_sum": 7773,
  "trade_ask_vol_sum": 6172,
  "trade_bid_cnt": 9924,
  "trade_ask_cnt": 10442,
  "bid_price": ["40613", "40612", "40611", "40610", "40609"],
  "bid_volume": [2, 4, 6, 2, 4],
  "diff_bid_vol": [0, 0, 0, 0, 0],
  "ask_price": ["40617", "40618", "40619", "40620", "40621"],
  "ask_volume": [6, 7, 3, 4, 3],
  "diff_ask_vol": [0, 0, 0, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "0",
  "first_derived_bid_volume": 0,
  "first_derived_ask_volume": 0,
  "simtrade": false
}

```

In

```
# Step 1: Look up the contract and read out target_code
curl http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT

# Step 2: Subscribe with the target_code from step 1 (e.g. TXFF6)
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TXFR1",
    "target_code": "TXFF6",
    "quote_type": "Quote"
  }'

# Step 3: Open the SSE stream to receive quote (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/quote_fop

# Unsubscribe
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

Out (Step 1: contract response)

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202606","delivery_date":"2026/06/17","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":44136.0,"limit_down":36112.0,"reference":40124.0,"update_date":"2026/05/20","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFF6"}

```

Out (Step 3: SSE quote)

```
event:quote_fop
data:{
  "code": "TXFF6",
  "date": "2026-05-20",
  "time": "19:30:16.137000",
  "target_kind_price": "40020.82",
  "open": "40270",
  "avg_price": "40467.061396",
  "close": "40624",
  "high": "40650",
  "low": "40221",
  "amount": "40624",
  "amount_sum": "579366918",
  "volume": 0,
  "vol_sum": 14317,
  "tick_type": 1,
  "diff_type": 2,
  "diff_price": "500",
  "diff_rate": "1.246137",
  "trade_bid_vol_sum": 7804,
  "trade_ask_vol_sum": 6172,
  "trade_bid_cnt": 9947,
  "trade_ask_cnt": 10468,
  "bid_price": ["40620", "40618", "40617", "40616", "40615"],
  "bid_volume": [1, 7, 3, 7, 8],
  "diff_bid_vol": [0, 0, 0, 0, 2],
  "ask_price": ["40624", "40625", "40626", "40627", "40628"],
  "ask_volume": [4, 3, 1, 1, 4],
  "diff_ask_vol": [1, 0, 0, 0, 0],
  "first_derived_bid_price": "0",
  "first_derived_ask_price": "0",
  "first_derived_bid_volume": 0,
  "first_derived_ask_volume": 0,
  "simtrade": false
}

```

### Attributes

Quote

```
code (str)                               Security code
exchange (Exchange)                      Exchange
date (tuple)                             Date
time (tuple)                             Trade time
datetime (tuple)                         Date and time
target_kind_price (Decimal)              Underlying index price
open (Decimal)                           Open price
avg_price (Decimal)                      Average price
close (Decimal)                          Trade price
high (Decimal)                           High (since open)
low (Decimal)                            Low (since open)
amount (Decimal)                         Trade amount (NTD)
amount_sum (Decimal)                     Cumulative trade amount (NTD)
volume (int)                             Trade volume (lot)
vol_sum (int)                            Cumulative trade volume (lot)
tick_type (int)                          Bid/ask side {1: ask, 2: bid, 0: undetermined}
diff_type (int)                          Change type {1: limit up, 2: up, 3: unchanged, 4: down, 5: limit down}
diff_price (Decimal)                     Price change
diff_rate (Decimal)                      Price change rate (%)
trade_bid_vol_sum (int)                  Cumulative bid-side trade volume (lot)
trade_ask_vol_sum (int)                  Cumulative ask-side trade volume (lot)
trade_bid_cnt (int)                      Bid-side trade count
trade_ask_cnt (int)                      Ask-side trade count
bid_price (list[Decimal])                Five-level bid prices
bid_volume (list[int])                   Five-level bid volumes (lot)
diff_bid_vol (list[int])                 Five-level bid volume change (lot)
ask_price (list[Decimal])                Five-level ask prices
ask_volume (list[int])                   Five-level ask volumes (lot)
diff_ask_vol (list[int])                 Five-level ask volume change (lot)
first_derived_bid_price (Decimal)        First-level derived bid price
first_derived_ask_price (Decimal)        First-level derived ask price
first_derived_bid_volume (int)           First-level derived bid volume (lot)
first_derived_ask_volume (int)           First-level derived ask volume (lot)
simtrade (bool)                          Trial match

```

## Callback (Python only)

By default real-time market data is shown via `print` with only a summary of fields. You can customize the callback to get the full payload and feed it into other applications (a local quote board, conditional / trigger orders, etc.). Avoid heavy computation inside the callback.

### Tick

decorator style

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
    print(f"target_kind_price={tick.target_kind_price}")
    print(f"trade_bid_vol_sum={tick.trade_bid_vol_sum}")
    print(f"trade_ask_vol_sum={tick.trade_ask_vol_sum}")
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
    print(f"simtrade={tick.simtrade}")

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Tick,
)

```

traditional style

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
target_kind_price=40020.82
trade_bid_vol_sum=7711
trade_ask_vol_sum=6109
avg_price=40465.465254
close=40598
high=40650
low=40221
amount=40598
amount_sum=572990988
volume=1
vol_sum=14160
tick_type=2
diff_type=2
diff_price=474
diff_rate=1.181338
simtrade=False

```

### BidAsk

decorator style

```
from shioaji import BidAskFOPv1, Exchange

@api.on_bidask_fop_v1()
def quote_callback(exchange: Exchange, bidask: BidAskFOPv1):
    print(f"exchange={exchange}")
    print(f"code={bidask.code}")
    print(f"date={bidask.date}")
    print(f"time={bidask.time}")
    print(f"datetime={bidask.datetime}")
    print(f"bid_vol_sum={bidask.bid_vol_sum}")
    print(f"ask_vol_sum={bidask.ask_vol_sum}")
    print(f"bid_price={bidask.bid_price}")
    print(f"bid_volume={bidask.bid_volume}")
    print(f"diff_bid_vol={bidask.diff_bid_vol}")
    print(f"ask_price={bidask.ask_price}")
    print(f"ask_volume={bidask.ask_volume}")
    print(f"diff_ask_vol={bidask.diff_ask_vol}")
    print(f"first_derived_bid_price={bidask.first_derived_bid_price}")
    print(f"first_derived_ask_price={bidask.first_derived_ask_price}")
    print(f"first_derived_bid_volume={bidask.first_derived_bid_volume}")
    print(f"first_derived_ask_volume={bidask.first_derived_ask_volume}")
    print(f"target_kind_price={bidask.target_kind_price}")
    print(f"simtrade={bidask.simtrade}")

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.BidAsk,
)

```

traditional style

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
bid_vol_sum=21
ask_vol_sum=21
bid_price=[Decimal('40613'), Decimal('40612'), Decimal('40611'), Decimal('40610'), Decimal('40609')]
bid_volume=[1, 2, 6, 4, 8]
diff_bid_vol=[-1, 1, 0, 0, 0]
ask_price=[Decimal('40617'), Decimal('40618'), Decimal('40619'), Decimal('40620'), Decimal('40621')]
ask_volume=[4, 7, 5, 3, 2]
diff_ask_vol=[-1, 0, 0, 0, 0]
first_derived_bid_price=0
first_derived_ask_price=0
first_derived_bid_volume=0
first_derived_ask_volume=0
target_kind_price=40020.82
simtrade=False

```

### Quote

decorator style

```
from shioaji import QuoteFOPv1, Exchange

@api.on_quote_fop_v1()
def quote_callback(exchange: Exchange, quote: QuoteFOPv1):
    print(f"exchange={exchange}")
    print(f"code={quote.code}")
    print(f"date={quote.date}")
    print(f"time={quote.time}")
    print(f"datetime={quote.datetime}")
    print(f"target_kind_price={quote.target_kind_price}")
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
    print(f"bid_price={quote.bid_price}")
    print(f"bid_volume={quote.bid_volume}")
    print(f"diff_bid_vol={quote.diff_bid_vol}")
    print(f"ask_price={quote.ask_price}")
    print(f"ask_volume={quote.ask_volume}")
    print(f"diff_ask_vol={quote.diff_ask_vol}")
    print(f"first_derived_bid_price={quote.first_derived_bid_price}")
    print(f"first_derived_ask_price={quote.first_derived_ask_price}")
    print(f"first_derived_bid_volume={quote.first_derived_bid_volume}")
    print(f"first_derived_ask_volume={quote.first_derived_ask_volume}")
    print(f"simtrade={quote.simtrade}")

api.subscribe(
    api.Contracts.Futures.TXF.TXFR1,
    quote_type=sj.QuoteType.Quote,
)

```

traditional style

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
target_kind_price=40020.82
open=40270
avg_price=40467.404028
close=40629
high=40650
low=40221
amount=121887
amount_sum=580626313
volume=0
vol_sum=14348
tick_type=1
diff_type=2
diff_price=505
diff_rate=1.258598
trade_bid_vol_sum=7825
trade_ask_vol_sum=6182
trade_bid_cnt=9966
trade_ask_cnt=10498
bid_price=[Decimal('40625'), Decimal('40624'), Decimal('40623'), Decimal('40622'), Decimal('40621')]
bid_volume=[1, 3, 11, 6, 1]
diff_bid_vol=[0, 0, 0, 0, 0]
ask_price=[Decimal('40628'), Decimal('40629'), Decimal('40630'), Decimal('40631'), Decimal('40632')]
ask_volume=[1, 1, 3, 4, 2]
diff_ask_vol=[0, 0, 0, 0, 0]
first_derived_bid_price=0
first_derived_ask_price=0
first_derived_bid_volume=0
first_derived_ask_volume=0
simtrade=False

```
