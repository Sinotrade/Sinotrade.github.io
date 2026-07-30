Market signals (Scanner) are signal data pushed by the quote engine as it scans the whole market in real time: an event is pushed as soon as any stock triggers the specified condition (price limit, rapid price move, volume burst, and so on), so the whole market is monitored without per-stock subscriptions. Subscribe with `subscribe_scanner()`: the `scanner` argument picks the scanner rule, and `region`, `security_type`, and `exchange` set the market scope to scan.

Subscribe

```
>> api.subscribe_scanner?

Signature: api.subscribe_scanner(scanner, *, region, security_type, exchange)

```

Scanner Parameters:

```
scanner:       scanner rule object (LimitScanner / PriceMoveScanner / VolumeScanner / StreamScanner)
region:        market, currently only Region.TW
security_type: security type, currently only SecurityType.Stock
exchange:      exchange {Exchange.TSE, Exchange.OTC}

```

Subscribe

```
POST /api/v1/stream/subscribe/scanner
Content-Type: application/json

{
  "scanner":       {"kind": "preset_rule", "id": <string>} | <StreamScanner>,
  "region":        <Region>,
  "security_type": <SecurityType>,
  "exchange":      <Exchange>
}

```

To unsubscribe, call `POST /api/v1/stream/unsubscribe/scanner` with the same body.

Scanner Parameters:

```
scanner:       scanner rule. Preset rules use {"kind": "preset_rule", "id": "..."}
               (see each rule list for ids); status filters use a plain string
               {"simtrade", "suspend"}
region:        market {TW}
security_type: security type {STK}
exchange:      exchange {TSE, OTC}

```

## Overview

| Scanner | Description | Rules | | --- | --- | --- | | `LimitScanner` | [Price Limit](#limitscanner) | `bid_near_limit_up` `bid_touch_limit_up` `limit_up_unlocked` `ask_near_limit_down` `ask_touch_limit_down` `limit_down_unlocked` | | `PriceMoveScanner` | [Rapid Price Move](#pricemovescanner) | `trade_surge` `trade_drop` `bid_surge` `ask_drop` | | `VolumeScanner` | [Volume Burst](#volumescanner) | `burst` | | `StreamScanner` | [Status Filter](#streamscanner) | `Simtrade` `Suspend` |

Product restrictions

- Currently Taiwan stocks only (`Region.TW`, `SecurityType.Stock`), with `Exchange.TSE` or `Exchange.OTC`.
- `region`, `security_type`, and `exchange` are required keyword-only arguments.

## Price Limit

Tracks a stock as it approaches its price limits: signals are pushed when the quote **nears** the limit price, **touches** it, and when the limit is **unlocked**.

Rules

```
# Python                                 HTTP (id)
LimitScanner.bid_near_limit_up()         bid_near_limit_up        bid price nearing limit up
LimitScanner.bid_touch_limit_up()        bid_touch_limit_up       bid price touching limit up
LimitScanner.limit_up_unlocked()         limit_up_unlocked        limit up unlocked
LimitScanner.ask_near_limit_down()       ask_near_limit_down      ask price nearing limit down
LimitScanner.ask_touch_limit_down()      ask_touch_limit_down     ask price touching limit down
LimitScanner.limit_down_unlocked()       limit_down_unlocked      limit down unlocked

```

In

```
api.subscribe_scanner(
    scanner=sj.LimitScanner.ask_near_limit_down(),
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# unsubscribe
# api.unsubscribe_scanner(
#     scanner=sj.LimitScanner.ask_near_limit_down(),
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerSignalEvent(
    scanner=LimitScanner.ask_near_limit_down(),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '4977',
        'datetime': (2026, 7, 29, 10, 42, 36, 701220),
        'open': Decimal('123'),
        'close': Decimal('112.5'),
        'high': Decimal('125'),
        'low': Decimal('112'),
        ...
    },
    extra={
        'previous_best_price': Decimal('112.5'),
        'trigger_price': Decimal('112.5'),
        'limit_price': Decimal('112'),
    },
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": {"kind": "preset_rule", "id": "ask_near_limit_down"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# open SSE to receive market signals (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/scanner

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": {"kind": "preset_rule", "id": "ask_near_limit_down"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanner": "ask_near_limit_down",
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "6672",
    "date": "2026-07-29",
    "time": "11:00:33.983434",
    "open": "204",
    "close": "180.5",
    "high": "204",
    "low": "180",
    ...
  },
  "extra": {
    "previous_best_price": "181",
    "trigger_price": "180.5",
    "limit_price": "180"
  }
}

```

### Attributes

LimitScannerExtra

```
previous_best_price (Optional[Decimal])  previous best price (None on first trigger)
trigger_price (Decimal)                  best price that triggered the signal
limit_price (Decimal)                    limit price

```

## Rapid Price Move

A signal is pushed when a stock's price moves more than 1% within 1 second with a change of at least 3 ticks; each stock then cools down for 1 second.

Rules

```
# Python                                 HTTP (id)
PriceMoveScanner.trade_surge()           trade_price_surge        trade price surging
PriceMoveScanner.trade_drop()            trade_price_drop         trade price dropping
PriceMoveScanner.bid_surge()             bid_price_surge          bid price surging
PriceMoveScanner.ask_drop()              ask_price_drop           ask price dropping

```

In

```
api.subscribe_scanner(
    scanner=sj.PriceMoveScanner.trade_drop(),
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# unsubscribe
# api.unsubscribe_scanner(
#     scanner=sj.PriceMoveScanner.trade_drop(),
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerSignalEvent(
    scanner=PriceMoveScanner.trade_price_drop(),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '4956',
        'datetime': (2026, 7, 29, 10, 38, 54, 975780),
        'open': Decimal('26.8'),
        'close': Decimal('24.6'),
        'high': Decimal('27.2'),
        'low': Decimal('24.6'),
        ...
    },
    extra={
        'reference_time': '10:38:54.975780',
        'reference_price': Decimal('24.85'),
        'change_price': Decimal('-0.25'),
        'change_percent': Decimal('-1.006'),
        'tick_change': 5,
        'elapsed_ms': 0,
    },
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": {"kind": "preset_rule", "id": "trade_price_drop"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# open SSE to receive market signals (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/scanner

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": {"kind": "preset_rule", "id": "trade_price_drop"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanner": "trade_price_drop",
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "8045",
    "date": "2026-07-29",
    "time": "10:58:56.269181",
    "open": "55.8",
    "close": "50.6",
    "high": "56.2",
    "low": "50.6",
    ...
  },
  "extra": {
    "reference_time": "10:58:56.269181",
    "reference_price": "51.2",
    "change_price": "-0.6",
    "change_percent": "-1.1719",
    "tick_change": 6,
    "elapsed_ms": 0
  }
}

```

### Attributes

PriceMoveExtra

```
reference_time (str)                     reference time of comparison
reference_price (Decimal)                reference price of comparison
change_price (Decimal)                   price change over the window
change_percent (Decimal)                 percentage change over the window (%)
tick_change (int)                        tick change over the window
elapsed_ms (int)                         milliseconds elapsed since the reference time

```

## Volume Burst

A signal is pushed when a single trade's value exceeds the day's threshold; each stock then cools down for 5 seconds. The threshold is recomputed by the server every day from the previous session's trade-value distribution, and every event carries the day's threshold in its `threshold` field.

Rules

```
# Python                                 HTTP (id)
VolumeScanner.burst()                    volume_burst             volume burst

```

In

```
api.subscribe_scanner(
    scanner=sj.VolumeScanner.burst(),
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# unsubscribe
# api.unsubscribe_scanner(
#     scanner=sj.VolumeScanner.burst(),
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerSignalEvent(
    scanner=VolumeScanner.volume_burst(),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '2454',
        'datetime': (2026, 7, 29, 10, 39, 22, 260204),
        'open': Decimal('3315'),
        'close': Decimal('3050'),
        'high': Decimal('3335'),
        'low': Decimal('3035'),
        ...
    },
    extra={
        'amount': 27450000,
        'volume': 9,
        'price': Decimal('3050'),
        'threshold': 25000000,
    },
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": {"kind": "preset_rule", "id": "volume_burst"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# open SSE to receive market signals (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/scanner

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": {"kind": "preset_rule", "id": "volume_burst"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanner": "volume_burst",
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "6669",
    "date": "2026-07-29",
    "time": "10:57:35.360442",
    "open": "5430",
    "close": "5100",
    "high": "5475",
    "low": "5095",
    ...
  },
  "extra": {
    "amount": 25500000,
    "volume": 5,
    "price": "5100",
    "threshold": 25000000
  }
}

```

### Attributes

VolumeBurstExtra

```
amount (int)                             value of the single trade (TWD)
volume (int)                             size of the single trade (lot)
price (Decimal)                          traded price
threshold (int)                          the threshold in force today (TWD)

```

## Status Filter

Pushes quotes of stocks in a particular state: `Simtrade` for simulated matching, `Suspend` for suspended trading. Simulated matching is not limited to the opening/closing sessions — stocks entering periodic call auction intraday (disposition stocks, or after triggering the intraday volatility interruption mechanism) are pushed as well.

Rules

```
# Python                                 HTTP (scanner)
StreamScanner.Simtrade                   simtrade                 simulated matching
StreamScanner.Suspend                    suspend                  suspended trading

```

In

```
api.subscribe_scanner(
    scanner=sj.StreamScanner.Simtrade,
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# unsubscribe
# api.unsubscribe_scanner(
#     scanner=sj.StreamScanner.Simtrade,
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerQuoteEvent(
    scanners=(<StreamScanner.simtrade: 'simtrade'>,),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '3090',
        'datetime': (2026, 7, 29, 10, 43, 21, 25653),
        'open': Decimal('138'),
        'close': Decimal('126.5'),
        'high': Decimal('138'),
        'low': Decimal('126.5'),
        'simtrade': True,
        ...
    },
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": "simtrade", "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# open SSE to receive market signals (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/scanner

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": "simtrade", "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanners": ["simtrade"],
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "2492",
    "date": "2026-07-29",
    "time": "11:02:09.266137",
    "open": "234.5",
    "close": "220.5",
    "high": "234.5",
    "low": "220.5",
    "simtrade": true,
    ...
  }
}

```

### Attributes

ScannerQuoteEvent

```
scanners (Tuple[StreamScanner, ...])     matched status filters (can match several at once)
region (Region)                          market
security_type (SecurityType)             security type
exchange (Exchange)                      exchange
quote (QuoteSTKv1Core)                   stock quote

```

- The `quote` fields are the same as the Quote of [stock streaming](../stocks/).

## Callback (Python only)

All market signals share a single callback. Without one, each event is printed in the default format; once set, the callback takes over. The event type depends on the subscription: rule subscriptions (price limit, rapid price move, volume burst) push `ScannerSignalEvent`, status filters push `ScannerQuoteEvent`, and a `ScannerGapEvent` arrives after a reconnection to report how many events were missed. Avoid heavy computation inside the function.

Decorator style

```
from shioaji import (
    ScannerSignalEvent, ScannerQuoteEvent, ScannerGapEvent,
    LimitScanner, PriceMoveScanner, VolumeScanner,
)

@api.on_scanner()
def scanner_callback(event):
    if isinstance(event, ScannerSignalEvent):
        if isinstance(event.scanner, LimitScanner):
            print("price limit:", event.quote.code, event.extra)
        elif isinstance(event.scanner, PriceMoveScanner):
            print("rapid price move:", event.quote.code, event.extra)
        elif isinstance(event.scanner, VolumeScanner):
            print("volume burst:", event.quote.code, event.extra)
    elif isinstance(event, ScannerQuoteEvent):
        print("status filter:", event.scanners, event.quote.code)
    elif isinstance(event, ScannerGapEvent):
        print(f"dropped_count={event.dropped_count}")

```

Traditional style

```
from shioaji import (
    ScannerSignalEvent, ScannerQuoteEvent, ScannerGapEvent,
    LimitScanner, PriceMoveScanner, VolumeScanner,
)

def scanner_callback(event):
    if isinstance(event, ScannerSignalEvent):
        if isinstance(event.scanner, LimitScanner):
            print("price limit:", event.quote.code, event.extra)
        elif isinstance(event.scanner, PriceMoveScanner):
            print("rapid price move:", event.quote.code, event.extra)
        elif isinstance(event.scanner, VolumeScanner):
            print("volume burst:", event.quote.code, event.extra)
    elif isinstance(event, ScannerQuoteEvent):
        print("status filter:", event.scanners, event.quote.code)
    elif isinstance(event, ScannerGapEvent):
        print(f"dropped_count={event.dropped_count}")

api.set_on_scanner_callback(scanner_callback)

```

Matching a single rule

To match one specific rule, compare for equality, e.g. `event.scanner == LimitScanner.ask_near_limit_down()`.
