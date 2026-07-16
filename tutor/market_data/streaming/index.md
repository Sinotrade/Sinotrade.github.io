Index real-time quotes are market data relayed live by the exchange, pushed only during trading hours. Subscribe the same way you subscribe a [contract](../../contract/) to start receiving them.

Reminder

Subscribing to real-time quotes does not consume bandwidth.

Indices have only one quote type

Indices provide only the index quote (Quote) — there is no tick (Tick) or five-tier best bid/ask (BidAsk). When subscribing, `quote_type` is always `Quote`.

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
contract:     the index contract to subscribe (from api.contracts.get or api.Contracts.Indexs)
quote_type:   indices support Quote only; can be omitted
intraday_odd: not supported for indices, always False

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
--code:          the index code to subscribe (e.g. IX0001)
--quote-type:    indices must pass quote (the default tick is rejected)
--security-type: security type; use IND for indices
--intraday-odd:  not supported for indices

```

Subscribe

```
POST /api/v1/stream/subscribe
Content-Type: application/json

{
  "security_type": <SecurityType>,
  "exchange":      <Exchange>,
  "code":          <string>,
  "quote_type":    <QuoteType>
}

```

Quote Parameters:

```
security_type: security type {IND}
exchange:      exchange {TSE, OTC}
code:          index code (e.g. IX0001)
quote_type:    indices support Quote only

```

## Quote

In

```
contract = api.contracts.get("IX0001")
api.subscribe(contract, quote_type=sj.QuoteType.Quote)

# unsubscribe
# api.unsubscribe(contract, quote_type=sj.QuoteType.Quote)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/IND/*/TSE/IX0001 | Event: Subscribe or Unsubscribe ok

QuoteIdxV1(
    code='IX0001',
    date=2026-07-16,
    time=11:52:45,
    close=45625.32,
    high=45713.2,
    low=44970.64,
)

```

Showing all fields

The default repr shows a summary only. For the full content, define a custom callback — see the [Callback](#callback) section below.

In

```
shioaji data stream --code IX0001 --security-type IND --quote-type quote
# press Ctrl+C to stop; the CLI unsubscribes automatically

```

Out

```
Subscribed to IX0001 quote (Ctrl+C to stop)
{
  "exchange": "TSE",
  "code": "IX0001",
  "Date": "2026-07-16",
  "Time": "11:52:15",
  "Reference": "45631.59",
  "Open": "45511.98",
  "High": "45713.2",
  "Low": "44970.64",
  "Close": "45622.63",
  "AmountSum": "618160656740",
  "Amount": "91988580",
  "Volume": 1129,
  "VolSum": 7424400,
  "Count": 2115431,
  "CountSum": 2115431,
  "PrevDate": "2026-07-15",
  "PrevAmountSum": "984081222880",
  "NoTrade": 7,
  "RaiseStop": 16,
  "Raise": 454,
  "Flat": 107,
  "Fall": 523,
  "FallStop": 0,
  "FundAmount": "40717826190",
  "FundVolume": 1732436,
  "FundCount": 345835,
  "StockAmount": "572675483130",
  "StockVolume": 3659291,
  "StockCount": 1691180,
  "BullAmount": "2326921150",
  "BullVolume": 1905951,
  "BullCount": 68360,
  "BearAmount": "77652940",
  "BearVolume": 107649,
  "BearCount": 4298,
  "TIBAmount": "2180957550",
  "TIBVolume": 2673,
  "TIBCount": 2052,
  "FixedAmount": "0",
  "FixedVolume": 0,
  "FixedCount": 0,
  "EstimateAmountSum": "857722570750"
}

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "IND",
    "exchange": "TSE",
    "code": "IX0001",
    "quote_type": "Quote"
  }'

# open SSE to receive index quotes (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/quote_idx

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "IND",
#     "exchange": "TSE",
#     "code": "IX0001",
#     "quote_type": "Quote"
#   }'

```

Out

```
event:quote_idx
data:{
  "exchange": "TSE",
  "code": "IX0001",
  "Date": "2026-07-16",
  "Time": "11:52:45",
  "Reference": "45631.59",
  "Open": "45511.98",
  "High": "45713.2",
  "Low": "44970.64",
  "Close": "45625.32",
  "AmountSum": "618594787860",
  "Amount": "95080930",
  "Volume": 918,
  "VolSum": 7430030,
  "Count": 2117449,
  "CountSum": 2117449,
  "PrevDate": "2026-07-15",
  "PrevAmountSum": "984081222880",
  "NoTrade": 7,
  "RaiseStop": 16,
  "Raise": 453,
  "Flat": 111,
  "Fall": 520,
  "FallStop": 0,
  "FundAmount": "40749825690",
  "FundVolume": 1733956,
  "FundCount": 346107,
  "StockAmount": "573076651430",
  "StockVolume": 3662426,
  "StockCount": 1692858,
  "BullAmount": "2327811230",
  "BullVolume": 1906903,
  "BullCount": 68423,
  "BearAmount": "77668600",
  "BearVolume": 107670,
  "BearCount": 4301,
  "TIBAmount": "2180957550",
  "TIBVolume": 2673,
  "TIBCount": 2052,
  "FixedAmount": "0",
  "FixedVolume": 0,
  "FixedCount": 0,
  "EstimateAmountSum": "857373233347"
}

```

### Attributes

QuoteIdxV1

```
code (str)                               index code
exchange (Exchange)                      exchange
date (date)                              date
time (time)                              time
datetime (datetime)                      date and time
reference (Decimal)                      previous close
open (Decimal)                           open
high (Decimal)                           high
low (Decimal)                            low
close (Decimal)                          latest index value
amount_sum (Decimal)                     cumulative turnover (NTD)
amount (Decimal)                         turnover (NTD)
volume (int)                             volume (lot)
vol_sum (int)                            cumulative volume (lot)
count (int)                              cumulative trade count
count_sum (int)                          cumulative trade count
prev_date (date)                         previous trading day
prev_amount_sum (Decimal)                previous-day total turnover (NTD)
no_trade (int)                           not traded (constituents)
limit_up_count (int)                     limit up (constituents)
raise_count (int)                        up (constituents)
flat_count (int)                         unchanged (constituents)
fall_count (int)                         down (constituents)
limit_down_count (int)                   limit down (constituents)
fund_amount (Decimal)                    fund total turnover (NTD)｜broad-market only
fund_volume (int)                        fund total volume (lot)｜broad-market only
fund_count (int)                         fund total trade count｜broad-market only
stock_amount (Decimal)                   stock total turnover (NTD)｜broad-market only
stock_volume (int)                       stock total volume (lot)｜broad-market only
stock_count (int)                        stock total trade count｜broad-market only
bull_amount (Decimal)                    call warrant total turnover (NTD)｜broad-market only
bull_volume (int)                        call warrant total volume (lot)｜broad-market only
bull_count (int)                         call warrant total trade count｜broad-market only
bear_amount (Decimal)                    put warrant total turnover (NTD)｜broad-market only
bear_volume (int)                        put warrant total volume (lot)｜broad-market only
bear_count (int)                         put warrant total trade count｜broad-market only
tib_amount (Decimal)                     innovation board total turnover (NTD)｜broad-market only
tib_volume (int)                         innovation board total volume (lot)｜broad-market only
tib_count (int)                          innovation board total trade count｜broad-market only
fixed_amount (Decimal)                   after-hours fixed-price total turnover (NTD)｜broad-market only
fixed_volume (int)                       after-hours fixed-price total volume (lot)｜broad-market only
fixed_count (int)                        after-hours fixed-price total trade count｜broad-market only
estimate_amount_sum (Decimal)            estimated closing total turnover (NTD)｜broad-market only

```

- Fields marked "broad-market only" are present only for broad-market indices such as the TAIEX; a regular index (e.g. `EMP88`) carries only the standard fields above, with the rest as `None`.

## Callback (Python only)

By default, real-time quotes are displayed via `print`, showing only a summary of fields. You can modify the callback function to obtain the full field content and connect it to other applications (quote management, touch orders, etc.). Avoid doing computation inside the function.

### Quote

decorator style

```
from shioaji import QuoteIdxV1

@api.on_quote_idx_v1()
def quote_callback(quote: QuoteIdxV1):
    print(f"code={quote.code}")
    print(f"exchange={quote.exchange}")
    print(f"date={quote.date}")
    print(f"time={quote.time}")
    print(f"datetime={quote.datetime}")
    print(f"reference={quote.reference}")
    print(f"open={quote.open}")
    print(f"high={quote.high}")
    print(f"low={quote.low}")
    print(f"close={quote.close}")
    print(f"amount_sum={quote.amount_sum}")
    print(f"volume={quote.volume}")
    print(f"vol_sum={quote.vol_sum}")

contract = api.contracts.get("IX0001")
api.subscribe(contract, quote_type=sj.QuoteType.Quote)

```

traditional style

```
from shioaji import QuoteIdxV1

def quote_callback(quote: QuoteIdxV1):
    print(quote)

api.set_on_quote_idx_v1_callback(quote_callback)

contract = api.contracts.get("IX0001")
api.subscribe(contract, quote_type=sj.QuoteType.Quote)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/IND/*/TSE/IX0001 | Event: Subscribe or Unsubscribe ok
code=IX0001
exchange=Exchange.TSE
date=2026-07-16
time=11:52:45
datetime=2026-07-16 11:52:45
reference=45631.59
open=45511.98
high=45713.2
low=44970.64
close=45625.32
amount_sum=618594787860
volume=918
vol_sum=7430030

```
