Enriched data is value-added market data computed in real time by the quote engine on top of raw exchange feeds, and is only pushed during trading hours. Like regular streaming market data, you receive it by subscribing to a [contract](../../../contract/) with the corresponding `quote_type`.

Tips

Enriched data subscriptions do not count against your subscription quota.

Subscribe

```
>> api.subscribe?

Signature:
api.subscribe(
    contract,
    quote_type=None,
    intraday_odd=False,
    version=None,
    *,
    ranking=None,
)

```

Quote Parameters:

```
contract:     index contract to subscribe (from api.contracts.get)
quote_type:   enriched data type {CalculatedIndex, IndexContribution, IndustryContribution}
intraday_odd: not supported for enriched data, keep False
version:      not supported for enriched data, omit it
ranking:      ranking type, only for QuoteType.IndexContribution (keyword-only)

```

Subscribe

```
POST /api/v1/stream/subscribe/calculated_index
POST /api/v1/stream/subscribe/index_contribution
POST /api/v1/stream/subscribe/industry_contribution

```

Each enriched data type has its own endpoint; to unsubscribe, call the matching `/api/v1/stream/unsubscribe/...` with the same body.

Quote Parameters:

```
calculated_index:      {"index": <StreamContract>}
index_contribution:    {"index": <StreamContract>, "ranking": <ContributionRanking>}
industry_contribution: {"index": <StreamContract>}

```

## Overview

| QuoteType | Description | Push cadence | | --- | --- | --- | | `CalculatedIndex` | [Calculated index](#calculatedindex) | multiple per second | | `IndexContribution` | [Index contribution](#indexcontribution) (contribution points of individual stocks to the index) | once per second | | `IndustryContribution` | [Industry contribution](#industrycontribution) (contribution points of industry sectors to the index) | once per second |

Product restrictions

Enriched data is subscribed with **index contracts**, currently only `IX0001` (the TSE weighted index) and `IX0043` (the TPEx index).

Attention

- Enriched data does not support the `intraday_odd` and `version` parameters; passing them raises an error.
- The CLI `shioaji data stream` command does not support enriched data; use the Python or HTTP interface instead.

## Calculated Index

The quote engine computes the index in real time from its constituent-stock trades; it updates more frequently than the official index, and multiple updates may be pushed within the same second.

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.CalculatedIndex,
)

# unsubscribe
# api.unsubscribe(
#     contract,
#     quote_type=sj.QuoteType.CalculatedIndex,
# )

```

Out

```
CalculatedIndex(
    code='IX0001',
    date='2026/07/29',
    time='10:27:16.000000',
    open=41603.37,
    high=41711.37,
    low=40211.28,
    close=40385.25,
    total_amount=505597362400,
    price_chg=-1218.11,
    pct_chg=-2.93,
    simtrade=False,
)

```

Callback (decorator style)

Without a callback, each event is printed by default. To handle the data yourself, register a callback function with the decorator:

```
from shioaji import CalculatedIndex

@api.on_calculated_index()
def calculated_index_callback(idx: CalculatedIndex):
    print(idx)

```

Callback (traditional style)

```
from shioaji import CalculatedIndex

def calculated_index_callback(idx: CalculatedIndex):
    print(idx)

api.set_on_calculated_index_callback(calculated_index_callback)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/calculated_index \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}}'

# open SSE to receive the calculated index (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/calculated_index

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/calculated_index \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}}'

```

Out

```
event:calculated_index
data:{
  "code": "IX0001",
  "date": "2026/07/28",
  "time": "12:25:46.000000",
  "open": 43634.19,
  "high": 43634.19,
  "low": 41568.96,
  "close": 41936.96,
  "total_amount": 527835364040,
  "price_chg": -1697.23,
  "pct_chg": -3.89,
  "simtrade": false
}

```

### Attributes

CalculatedIndex

```
code (str)                               index code
date (str)                               date
time (str)                               time
open (float)                             open
high (float)                             high
low (float)                              low
close (float)                            latest index value
total_amount (int)                       cumulative turnover (NTD)
price_chg (float)                        price change
pct_chg (float)                          percentage change (%)
simtrade (bool)                          simulated trading

```

## Index Contribution

A per-stock contribution ranking is pushed once per second, listing the constituent stocks contributing most to that index's movement; specify the ranking type with the keyword argument `ranking`:

ContributionRanking

```
# Python                                 HTTP (ranking)
ContributionRanking.Top10                top10            top 10 by contribution points
ContributionRanking.Abs10                abs10            top 10 by absolute contribution points
ContributionRanking.Positive25           positive25       top 25 positive contributors
ContributionRanking.Negative25           negative25       top 25 negative contributors

```

Tips

`ranking` is required; omitting it raises an error. It is only valid for `QuoteType.IndexContribution`; combining it with any other `quote_type` also raises an error.

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndexContribution,
    ranking=sj.ContributionRanking.Top10,
)

# unsubscribe
# api.unsubscribe(
#     contract,
#     quote_type=sj.QuoteType.IndexContribution,
#     ranking=sj.ContributionRanking.Top10,
# )

```

Out

```
IndexContribution(
    ranking=<ContributionRanking.top10: 'top10'>,
    code='IX0001',
    date='2026/07/29',
    time='10:28:25.000000',
    entries=[
        {'code': '2317', 'price': 239.0, 'reference': 238.0, 'price_chg': 1.0, 'pct_chg': 0.42016806722689076, 'points': 4.3},
        {'code': '2357', 'price': 753.0, 'reference': 735.0, 'price_chg': 18.0, 'pct_chg': 2.4489795918367347, 'points': 4.1},
        {'code': '2880', 'price': 42.35, 'reference': 41.4, 'price_chg': 0.95, 'pct_chg': 2.2946859903381642, 'points': 4.06},
        {'code': '2207', 'price': 520.0, 'reference': 500.0, 'price_chg': 20.0, 'pct_chg': 4.0, 'points': 3.42},
        {'code': '2603', 'price': 203.0, 'reference': 200.0, 'price_chg': 3.0, 'pct_chg': 1.5, 'points': 1.99},
        {'code': '2615', 'price': 85.9, 'reference': 83.6, 'price_chg': 2.3, 'pct_chg': 2.751196172248804, 'points': 1.98},
        {'code': '3034', 'price': 502.0, 'reference': 492.5, 'price_chg': 9.5, 'pct_chg': 1.9289340101522845, 'points': 1.77},
        {'code': '4904', 'price': 107.5, 'reference': 106.0, 'price_chg': 1.5, 'pct_chg': 1.4150943396226416, 'points': 1.66},
        {'code': '3231', 'price': 171.5, 'reference': 170.0, 'price_chg': 1.5, 'pct_chg': 0.8823529411764706, 'points': 1.46},
        {'code': '2923', 'price': 40.2, 'reference': 37.65, 'price_chg': 2.55, 'pct_chg': 6.772908366533864, 'points': 1.36},
    ],
    simtrade=False,
)

```

Callback (decorator style)

Without a callback, each event is printed by default. To handle the data yourself, register a callback function with the decorator:

```
from shioaji import IndexContribution

@api.on_index_contribution()
def index_contribution_callback(ic: IndexContribution):
    print(ic)

```

Callback (traditional style)

```
from shioaji import IndexContribution

def index_contribution_callback(ic: IndexContribution):
    print(ic)

api.set_on_index_contribution_callback(index_contribution_callback)

```

In

```
# subscribe (ranking: top10 / abs10 / positive25 / negative25)
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_contribution \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "ranking": "top10"}'

# open SSE to receive index contribution (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/index_contribution

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_contribution \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "ranking": "top10"}'

```

Out

```
event:index_contribution
data:{
  "ranking": "top10",
  "code": "IX0001",
  "date": "2026/07/28",
  "time": "12:32:07.000000",
  "entries": [
    {"code": "3665", "price": 2205.0, "reference": 2150.0, "price_chg": 55.0, "pct_chg": 2.558139534883721, "points": 3.29},
    {"code": "2886", "price": 49.8, "reference": 49.4, "price_chg": 0.4, "pct_chg": 0.8097165991902834, "points": 1.82},
    {"code": "5269", "price": 1465.0, "reference": 1385.0, "price_chg": 80.0, "pct_chg": 5.776173285198556, "points": 1.82},
    {"code": "2207", "price": 505.0, "reference": 498.0, "price_chg": 7.0, "pct_chg": 1.4056224899598393, "points": 1.2},
    {"code": "2618", "price": 42.65, "reference": 41.95, "price_chg": 0.7, "pct_chg": 1.66865315852205, "points": 1.16},
    {"code": "2610", "price": 21.85, "reference": 21.25, "price_chg": 0.6, "pct_chg": 2.823529411764706, "points": 1.13},
    {"code": "2923", "price": 36.0, "reference": 34.45, "price_chg": 1.55, "pct_chg": 4.499274310595065, "points": 0.83},
    {"code": "1101", "price": 24.7, "reference": 24.4, "price_chg": 0.3, "pct_chg": 1.2295081967213115, "points": 0.69},
    {"code": "3045", "price": 114.0, "reference": 113.5, "price_chg": 0.5, "pct_chg": 0.4405286343612335, "points": 0.57},
    {"code": "5871", "price": 121.0, "reference": 120.0, "price_chg": 1.0, "pct_chg": 0.8333333333333334, "points": 0.53}
  ],
  "simtrade": false
}

```

### Attributes

IndexContribution

```
ranking (ContributionRanking)            ranking type
code (str)                               index code
date (str)                               date
time (str)                               time
entries (List[IndexContributionEntry])   contribution ranking list
simtrade (bool)                          simulated trading

```

IndexContributionEntry

```
code (str)                               stock code
price (float)                            traded price
reference (float)                        reference price
price_chg (float)                        price change
pct_chg (float)                          percentage change (%)
points (float)                           contribution points

```

## Industry Contribution

An industry contribution ranking is pushed once per second, listing each industry sector's contribution points to that index's movement, sorted from highest to lowest.

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndustryContribution,
)

# unsubscribe
# api.unsubscribe(
#     contract,
#     quote_type=sj.QuoteType.IndustryContribution,
# )

```

Out

```
IndustryContribution(
    code='IX0001',
    date='2026/07/30',
    time='09:03:47.000000',
    entries=[
        {'category': '2', 'points': 1.69},
        {'category': '1', 'points': 0.01},
        {'category': '16', 'points': 0.01},
        {'category': '14', 'points': -0.02},
        {'category': '9', 'points': -0.07},
        {'category': '30', 'points': -0.11},
        {'category': '11', 'points': -0.13},
        {'category': '38', 'points': -0.21},
        {'category': '36', 'points': -0.27},
        {'category': '18', 'points': -0.29},
        ...
    ],
    simtrade=False,
    index_close=39600.94,
    index_price_chg=-438.24,
)

```

Callback (decorator style)

Without a callback, each event is printed by default. To handle the data yourself, register a callback function with the decorator:

```
from shioaji import IndustryContribution

@api.on_industry_contribution()
def industry_contribution_callback(ind: IndustryContribution):
    print(ind)

```

Callback (traditional style)

```
from shioaji import IndustryContribution

def industry_contribution_callback(ind: IndustryContribution):
    print(ind)

api.set_on_industry_contribution_callback(industry_contribution_callback)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/industry_contribution \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}}'

# open SSE to receive industry contribution (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/industry_contribution

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/industry_contribution \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}}'

```

Out

```
event:industry_contribution
data:{
  "code": "IX0001",
  "date": "2026/07/30",
  "time": "09:29:25.000000",
  "entries": [
    {"category": "24", "points": 251.05},
    {"category": "28", "points": 64.66},
    {"category": "17", "points": 20.81},
    {"category": "26", "points": 7.74},
    {"category": "3", "points": 4.81},
    {"category": "12", "points": 2.09},
    {"category": "21", "points": 0.94},
    {"category": "10", "points": 0.79},
    {"category": "18", "points": 0.52},
    {"category": "1", "points": 0.36},
    ...
  ],
  "simtrade": false,
  "index_close": 40310.28,
  "index_price_chg": 271.1
}

```

### Attributes

IndustryContribution

```
code (str)                                index code
date (str)                                date
time (str)                                time
entries (List[IndustryContributionEntry]) industry contribution list
simtrade (bool)                           simulated trading
index_close (float)                       latest index value
index_price_chg (float)                   index price change (the entries' points sum to it)

```

IndustryContributionEntry

```
category (str)                           industry category code
points (float)                           contribution points

```
