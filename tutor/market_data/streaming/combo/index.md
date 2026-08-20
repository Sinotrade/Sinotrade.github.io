A combo product is an independent product on TAIFEX with **its own order book and quotes**, separate from each component product's market data; the spread is what the exchange actually matches, not the two products' prices subtracted. To receive a combo's realtime market data, subscribe to the combo product itself.

Two things differ from regular products when reading combo quotes:

- Prices are the **net price** of the whole combo: for a time spread it is "far − near" and **can be negative**.
- `bid`/`ask` are quotes **for the whole combo**; one subscription carries both sides.

Only futures combos have quotes

Option combos can only be sent with `IOC`/`FOK` and never rest on the order book, so **no combo quotes exist** for them. For a price reference, subscribe to the individual products and estimate from the net-price definition (see [Combo Orders](../../../order/Combo/)).

Build the combo contract with `api.contracts.combo()` before subscribing (`TXFR1`/`R2` continuous contracts are not accepted); see [Contract](../../../contract/#combo).

## Subscribe

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
contract:     Combo contract (built by api.contracts.combo() / combo_futures())
quote_type:   Subscription type {'tick', 'bid_ask'}
intraday_odd: Not supported for combo products, fixed to False

```

Mapping callbacks back

The `code` in callbacks (e.g. `'TXFH6/I6'`) equals `combo_contract.code`. When subscribing to several combos, build a lookup table first and map `code` back to the contract inside the callback:

```
combo_by_code = {c.code: c for c in api.contracts.combo_futures(root="TXF")}

```

Subscribe

```
shioaji data stream --code <CODE> --combo-with <CODE> [OPTIONS]

```

Quote Parameters:

```
--code:          Code of the combo's first product (near month, e.g. TXFH6)
--combo-with:    Code of the combo's second product (far month, e.g. TXFI6)
--security-type: Security type; use FUT for combos
--quote-type:    Subscription type {tick, bid_ask}, default tick

```

Combo subscriptions carry the two products in `contract.legs` (unlike the flat shape for regular products); legs must not carry an `action`, and `TXFR1`/`R2` continuous contracts are not accepted.

Subscribe

```
POST /api/v1/stream/subscribe
Content-Type: application/json

{
  "contract": {
    "legs": [
      {
        "security_type": <SecurityType>,
        "exchange": <Exchange>,
        "code": <string>
      }
    ],
    "combo_type": <ComboType, optional>
  },
  "quote_type": <QuoteType>
}

```

Quote Parameters:

```
contract.legs[].security_type: Security type {FUT}
contract.legs[].exchange:      Exchange {TAIFEX}
contract.legs[].code:          Product code; no action allowed (400 if present)
contract.combo_type:           Optional combo type; auto-derived when omitted
quote_type:                    Subscription type {Tick, BidAsk}

```

## Tick

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

api.subscribe(combo_contract, quote_type=sj.QuoteType.Tick)

# Unsubscribe
# api.unsubscribe(combo_contract, quote_type=sj.QuoteType.Tick)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/FOP/*/TFE/TXFH6/I6 | Event: Subscribe or Unsubscribe ok

TickFOPv1(
    code='TXFH6/I6',
    date=2026-08-12,
    time=15:56:09,
    close=172,
    volume=1,
)

```

Showing all fields

By default only a summary is printed. To access every field, customize the callback — see the [Callback](#callback) section below.

A combo only produces a tick when it actually trades, so tick volume is far lower than single products; use `BidAsk` to verify that a subscription is live.

In

```
shioaji data stream --code TXFH6 --combo-with TXFI6 --security-type FUT --quote-type tick
# Press Ctrl+C to stop; the CLI unsubscribes automatically

```

Out

```
Subscribed to TXFH6 tick (Ctrl+C to stop)
{"code":"TXFH6/I6","date":"2026-08-12","time":"16:01:06.089000","open":"153","underlying_price":"45518.07","bid_side_total_vol":27,"ask_side_total_vol":3,"avg_price":"162.533333","close":"169","high":"174","low":"153","amount":"169","total_amount":"4876","volume":1,"total_volume":30,"tick_type":2,"chg_type":1,"price_chg":"0","pct_chg":"0","simtrade":false}

```

In

```
# Step 1: subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {
      "legs": [
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
      ]
    },
    "quote_type": "Tick"
  }'

# Step 2: open the SSE stream (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/tick_fop

# Unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "contract": {
#       "legs": [
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
#       ]
#     },
#     "quote_type": "Tick"
#   }'

```

Out (Step 1: subscription response)

```
{"success":true,"message":"Subscription successful","subscription":{"contract":{"legs":[{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFH6","target_code":null},{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFI6","target_code":null}],"combo_type":null},"quote_type":"Tick","intraday_odd":false}}

```

Out (Step 2: SSE tick)

```
event:tick_fop
data:{"code":"TXFH6/I6","date":"2026-08-12","time":"16:01:06.089000","open":"153","underlying_price":"45518.07","bid_side_total_vol":27,"ask_side_total_vol":3,"avg_price":"162.533333","close":"169","high":"174","low":"153","amount":"169","total_amount":"4876","volume":1,"total_volume":30,"tick_type":2,"chg_type":1,"price_chg":"0","pct_chg":"0","simtrade":false}

```

### Attributes

The payload type is the same as futures/options (`TickFOPv1`); every price field is the combo net price:

Tick

```
code (str)                               Combo code (e.g. TXFH6/I6)
exchange (Exchange)                      Exchange
date (tuple)                             Date
time (tuple)                             Trade time
datetime (tuple)                         Date and time
open (Decimal)                           Open price
underlying_price (Decimal)               Underlying index price
avg_price (Decimal)                      Average price
close (Decimal)                          Deal price
high (Decimal)                           High since open
low (Decimal)                            Low since open
amount (Decimal)                         Deal amount (NTD)
total_amount (Decimal)                   Total amount (NTD)
volume (int)                             Deal volume (lot)
total_volume (int)                       Total volume (lot)
tick_type (int)                          Inner/outer {1: outer, 2: inner, 0: unknown}
chg_type (int)                           Change flag {1: limit up, 2: up, 3: flat, 4: down, 5: limit down}
price_chg (Decimal)                      Price change
pct_chg (Decimal)                        Change rate (%)
bid_side_total_vol (int)                 Total volume dealt on bid side (lot)
ask_side_total_vol (int)                 Total volume dealt on ask side (lot)
simtrade (bool)                          Simulated match

```

## BidAsk

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

api.subscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

# Unsubscribe
# api.unsubscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/FOP/*/TFE/TXFH6/I6 | Event: Subscribe or Unsubscribe ok

BidAskFOPv1(
    code='TXFH6/I6',
    date=2026-08-12,
    time=15:54:41,
    bid_price=[169, 168, 167, 166, 165],
    ask_price=[175, 176, 177, 178, 179],
    bid_volume=[4, 3, 2, 12, 16],
    ask_volume=[8, 1, 3, 3, 3],
)

```

Showing all fields

By default only a summary is printed. To access every field, customize the callback — see the [Callback](#callback) section below.

In

```
shioaji data stream --code TXFH6 --combo-with TXFI6 --security-type FUT --quote-type bid_ask
# Press Ctrl+C to stop; the CLI unsubscribes automatically

```

Out

```
Subscribed to TXFH6 bid_ask (Ctrl+C to stop)
{"code":"TXFH6/I6","date":"2026-08-12","time":"15:59:43.034000","bid_total_vol":30,"ask_total_vol":50,"bid_price":["169","168","167","166","165"],"bid_volume":[5,3,7,12,3],"diff_bid_vol":[0,0,0,0,-13],"ask_price":["173","174","175","176","177"],"ask_volume":[5,11,12,10,12],"diff_ask_vol":[0,0,0,0,0],"first_derived_bid_price":"0","first_derived_ask_price":"0","first_derived_bid_vol":0,"first_derived_ask_vol":0,"underlying_price":"45518.07","simtrade":false}

```

In

```
# Step 1: subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {
      "legs": [
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
      ]
    },
    "quote_type": "BidAsk"
  }'

# Step 2: open the SSE stream (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/bidask_fop

# Unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "contract": {
#       "legs": [
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
#       ]
#     },
#     "quote_type": "BidAsk"
#   }'

```

Out (Step 1: subscription response)

```
{"success":true,"message":"Subscription successful","subscription":{"contract":{"legs":[{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFH6","target_code":null},{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFI6","target_code":null}],"combo_type":null},"quote_type":"BidAsk","intraday_odd":false}}

```

Out (Step 2: SSE quote)

```
event:bidask_fop
data:{"code":"TXFH6/I6","date":"2026-08-12","time":"16:02:27.159000","bid_total_vol":26,"ask_total_vol":51,"bid_price":["169","168","167","166","165"],"bid_volume":[1,3,7,12,3],"diff_bid_vol":[0,0,0,0,0],"ask_price":["174","175","176","177","178"],"ask_volume":[7,14,11,11,8],"diff_ask_vol":[0,0,0,0,0],"first_derived_bid_price":"0","first_derived_ask_price":"0","first_derived_bid_vol":0,"first_derived_ask_vol":0,"underlying_price":"45518.07","simtrade":false}

```

### Attributes

The payload type is the same as futures/options (`BidAskFOPv1`); every price field is the combo net price:

BidAsk

```
code (str)                               Combo code (e.g. TXFH6/I6)
exchange (Exchange)                      Exchange
date (tuple)                             Date
time (tuple)                             Time
datetime (tuple)                         Date and time
bid_total_vol (int)                      Total bid volume (lot)
ask_total_vol (int)                      Total ask volume (lot)
bid_price (list[Decimal])                Best five bid prices
bid_volume (list[int])                   Best five bid volumes (lot)
diff_bid_vol (list[int])                 Bid volume changes (lot)
ask_price (list[Decimal])                Best five ask prices
ask_volume (list[int])                   Best five ask volumes (lot)
diff_ask_vol (list[int])                 Ask volume changes (lot)
first_derived_bid_price (Decimal)        First derived bid price
first_derived_ask_price (Decimal)        First derived ask price
first_derived_bid_vol (int)              First derived bid volume (lot)
first_derived_ask_vol (int)              First derived ask volume (lot)
underlying_price (Decimal)               Underlying index price
simtrade (bool)                          Simulated match

```

## Callback (Python only)

By default realtime quotes are shown with `print`, displaying only summary fields. Customize the callback to access every field and connect to your own applications. Avoid heavy computation inside the function. Combo quotes share the same FOP callbacks as futures/options; the `code` in the payload equals `combo_contract.code`.

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

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.Tick)

```

traditional style

```
from shioaji import TickFOPv1, Exchange

def quote_callback(exchange: Exchange, tick: TickFOPv1):
    print(f"{exchange} {tick}")

api.set_on_tick_fop_v1_callback(quote_callback)

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.Tick)

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

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

```

traditional style

```
from shioaji import BidAskFOPv1, Exchange

def quote_callback(exchange: Exchange, bidask: BidAskFOPv1):
    print(f"{exchange} {bidask}")

api.set_on_bidask_fop_v1_callback(quote_callback)

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

```
