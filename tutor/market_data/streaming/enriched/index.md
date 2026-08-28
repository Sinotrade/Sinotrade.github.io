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
    projection=None,
)

```

Quote Parameters:

```
contract:     index contract to subscribe (from api.contracts.get)
quote_type:   enriched data type {CalculatedIndex, IndexComponents}
intraday_odd: not supported for enriched data, keep False
version:      not supported for enriched data, omit it
projection:   projection, only for QuoteType.IndexComponents

```

Subscribe

```
POST /api/v1/stream/subscribe/calculated_index
POST /api/v1/stream/subscribe/index_components

```

Each enriched data type has its own endpoint; to unsubscribe, call the matching `/api/v1/stream/unsubscribe/...` with the same body.

Quote Parameters:

```
calculated_index:  {"index": <StreamContract>}
index_components:  {"index": <StreamContract>, "projection": <IndexComponentsProjection>}

```

## Overview

| QuoteType | projection | Description | Push cadence | | --- | --- | --- | --- | | `CalculatedIndex` | — | [Calculated index](#calculatedindex) | multiple per second | | `IndexComponents` | `component_ranking` | [Component ranking](#component-ranking) | once per second (every 5 seconds within an industry) | | `IndexComponents` | `group_metric` | [Industry metrics](#group-metric) | once per second | | `IndexComponents` | `group_ranking` | [Industry ranking](#group-ranking) | once per second |

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

## Components and Industries

Subscribe with `QuoteType.IndexComponents` and use `projection` to choose one of the three data types below.

Attention

`projection` is required; omitting it raises an error. It is only valid for `QuoteType.IndexComponents`; combining it with any other `quote_type` also raises an error.

### Component Ranking

A ranking of constituent stocks sorted by the chosen metric is pushed once per second; build `projection` with `component_ranking`:

Projection

```
sj.IndexComponentsProjection.component_ranking(metric, order, limit, group=None)

```

Projection Parameters:

```
metric: ranking metric                                    HTTP (metric)
        IndexComponentsComponentMetric.Contribution       contribution       contribution points
        IndexComponentsComponentMetric.PctChange          pct_chg            percentage change (%)
        IndexComponentsComponentMetric.Weight             weight             weight (%)
        IndexComponentsComponentMetric.Amount             amount             turnover
order:  sort order                                        HTTP (order)
        IndexComponentsRankingOrder.Desc                  desc               descending
        IndexComponentsRankingOrder.Asc                   asc                ascending
        IndexComponentsRankingOrder.AbsDesc               abs_desc           by absolute value, descending
        IndexComponentsRankingOrder.PositiveDesc          positive_desc      positive values only, descending
        IndexComponentsRankingOrder.NegativeAsc           negative_asc       negative values only, ascending
limit:  number of entries, 10 or 25
group:  industry category code (e.g. "24" for Semiconductor); when given, only stocks in that industry are ranked, pushed every 5 seconds; see category in Industry metrics for the codes

```

Tips

Only the following `order` / `limit` combinations are supported; any other combination raises `ValueError` when the projection is built: `Contribution` and `PctChange` accept `Desc` / 10, `AbsDesc` / 10, `PositiveDesc` / 25, `NegativeAsc` / 25; `Weight` and `Amount` accept `Desc` / 10 only; with `group`, only `Contribution` with `AbsDesc` / 10 and `Amount` with `Desc` / 10. Unsubscribing requires the same `projection` used to subscribe.

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndexComponents,
    projection=sj.IndexComponentsProjection.component_ranking(
        sj.IndexComponentsComponentMetric.Contribution,
        sj.IndexComponentsRankingOrder.AbsDesc,
        10,
        group="24",
    ),
)

# unsubscribe
# api.unsubscribe(
#     contract,
#     quote_type=sj.QuoteType.IndexComponents,
#     projection=sj.IndexComponentsProjection.component_ranking(
#         sj.IndexComponentsComponentMetric.Contribution,
#         sj.IndexComponentsRankingOrder.AbsDesc,
#         10,
#         group="24",
#     ),
# )

```

Out

```
IndexComponentsRankingUpdate(entries=10)(
    contract=Contract(code='IX0001', exchange='TSE'),
    projection=IndexComponentsProjection(kind='ranking', target='component', metric='contribution', order='abs_desc', limit=10, group='24'),
    date=datetime.date(2026, 8, 27),
    time=datetime.time(10, 42, 35),
    calculated_at=datetime.datetime(2026, 8, 27, 10, 42, 35, tzinfo=datetime.timezone(datetime.timedelta(seconds=28800))),
    reference_date=datetime.date(2026, 8, 27),
    market_phase=TwStockMarketPhase.continuous_trading,
    simtrade=False,

    entries=[
        IndexComponentRankingEntry(
            code='2330', category='24', price=Decimal('2425.00'),
            pct_chg=Decimal('0.41'), value=Decimal('79.51'), trading_status=TradingStatus.active,
        ),
        IndexComponentRankingEntry(
            code='2408', category='24', price=Decimal('546.00'),
            pct_chg=Decimal('5.61'), value=Decimal('27.55'), trading_status=TradingStatus.active,
        ),
        IndexComponentRankingEntry(
            code='2303', category='24', price=Decimal('117.00'),
            pct_chg=Decimal('-5.26'), value=Decimal('-25.05'), trading_status=TradingStatus.active,
        ),
        ... 4 entries omitted ...,
        IndexComponentRankingEntry(
            code='3443', category='24', price=Decimal('6075.00'),
            pct_chg=Decimal('-0.82'), value=Decimal('-2.05'), trading_status=TradingStatus.active,
        ),
        IndexComponentRankingEntry(
            code='6770', category='24', price=Decimal('71.10'),
            pct_chg=Decimal('1.57'), value=Decimal('1.59'), trading_status=TradingStatus.active,
        ),
        IndexComponentRankingEntry(
            code='2337', category='24', price=Decimal('128.00'),
            pct_chg=Decimal('1.99'), value=Decimal('1.52'), trading_status=TradingStatus.active,
        ),
    ],
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_components \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "component", "metric": "contribution", "order": "abs_desc", "limit": 10, "group": "24"}}'

# open SSE to receive the component ranking (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/index_components

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_components \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "component", "metric": "contribution", "order": "abs_desc", "limit": 10, "group": "24"}}'

```

Out

```
event:index_components
data:{
  "contract": {"security_type": "IND", "region": "TW", "exchange": "TSE", "code": "IX0001"},
  "projection": {"kind": "ranking", "target": "component", "metric": "contribution", "order": "abs_desc", "limit": 10, "group": "24"},
  "date": "2026-08-28",
  "time": "09:07:20.000000",
  "calculated_at": "2026-08-28T09:07:20.000000+08:00",
  "reference_date": "2026-08-28",
  "market_phase": "continuous_trading",
  "simtrade": false,
  "entries": [
    {"code": "2330", "category": "24", "value": "198.67", "price": "2435.00", "reference": "2410.00", "price_chg": "25.00", "pct_chg": "1.04", "reference_weight_ppm": 416563, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "2454", "category": "24", "value": "34.40", "price": "3935.00", "reference": "3865.00", "price_chg": "70.00", "pct_chg": "1.81", "reference_weight_ppm": 41319, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "2408", "category": "24", "value": "24.69", "price": "567.00", "reference": "541.00", "price_chg": "26.00", "pct_chg": "4.81", "reference_weight_ppm": 11173, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "2303", "category": "24", "value": "17.33", "price": "123.00", "reference": "118.50", "price_chg": "4.50", "pct_chg": "3.80", "reference_weight_ppm": 9928, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "3711", "category": "24", "value": "6.85", "price": "610.00", "reference": "605.00", "price_chg": "5.00", "pct_chg": "0.83", "reference_weight_ppm": 18028, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "2344", "category": "24", "value": "5.52", "price": "190.00", "reference": "186.00", "price_chg": "4.00", "pct_chg": "2.15", "reference_weight_ppm": 5579, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "7769", "category": "24", "value": "5.51", "price": "6445.00", "reference": "6345.00", "price_chg": "100.00", "pct_chg": "1.58", "reference_weight_ppm": 7609, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "3443", "category": "24", "value": "2.87", "price": "5990.00", "reference": "5920.00", "price_chg": "70.00", "pct_chg": "1.18", "reference_weight_ppm": 5288, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "6770", "category": "24", "value": "2.02", "price": "71.00", "reference": "69.60", "price_chg": "1.40", "pct_chg": "2.01", "reference_weight_ppm": 2185, "price_source": "regular", "trading_status": "active", "data_status": "live"},
    {"code": "6239", "category": "24", "value": "1.74", "price": "284.50", "reference": "277.00", "price_chg": "7.50", "pct_chg": "2.71", "reference_weight_ppm": 1402, "price_source": "regular", "trading_status": "active", "data_status": "live"}
  ]
}

```

#### Attributes

IndexComponentsRankingUpdate

```
contract (Contract)                          index contract
projection (IndexComponentsProjection)       projection
date (datetime.date)                         date
time (datetime.time)                         time
calculated_at (datetime.datetime)            calculation time
reference_date (datetime.date)               reference price date
market_phase (TwStockMarketPhase)            market phase
simtrade (bool)                              simulated trading
entries (List[IndexComponentRankingEntry])   ranking list

```

IndexComponentRankingEntry

```
code (str)                               stock code
category (str)                           industry category code
price (Decimal)                          traded price
reference (Decimal)                      reference price
price_chg (Decimal)                      price change
pct_chg (Decimal)                        percentage change (%)
value (Decimal)                          metric value (per metric)
reference_weight_ppm (int)               reference weight (ppm)
price_source (PriceSource)               price source
trading_status (TradingStatus)           trading status
data_status (DataStatus)                 data status

```

### Industry Metrics

The chosen metric for every industry group is pushed once per second; build `projection` with `group_metric`:

Projection

```
sj.IndexComponentsProjection.group_metric(metric)

```

Projection Parameters:

```
metric: industry metric                                   HTTP (metric)
        IndexComponentsGroupMetric.Contribution           contribution               contribution points
        IndexComponentsGroupMetric.EqualWeightPerformance equal_weight_performance   equal-weighted change (%)
        IndexComponentsGroupMetric.WeightedPerformance    weighted_performance       weighted change (%)
        IndexComponentsGroupMetric.Weight                 weight                     weight (%)
        IndexComponentsGroupMetric.Amount                 amount                     turnover
        IndexComponentsGroupMetric.AmountShare            amount_share               turnover share (%)
        IndexComponentsGroupMetric.Breadth                breadth                    advance/decline breadth (%)

```

Tips

Unsubscribing requires the same `projection` used to subscribe.

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndexComponents,
    projection=sj.IndexComponentsProjection.group_metric(
        sj.IndexComponentsGroupMetric.Contribution,
    ),
)

# unsubscribe
# api.unsubscribe(
#     contract,
#     quote_type=sj.QuoteType.IndexComponents,
#     projection=sj.IndexComponentsProjection.group_metric(
#         sj.IndexComponentsGroupMetric.Contribution,
#     ),
# )

```

Out

```
IndexComponentsGroupUpdate(groups=32)(
    contract=Contract(code='IX0001', exchange='TSE'),
    projection=IndexComponentsProjection(kind='group_metric', target=None, metric='contribution', order=None, limit=None, group=None),
    date=datetime.date(2026, 8, 27),
    time=datetime.time(12, 22, 38),
    calculated_at=datetime.datetime(2026, 8, 27, 12, 22, 38, tzinfo=datetime.timezone(datetime.timedelta(seconds=28800))),
    reference_date=datetime.date(2026, 8, 27),
    market_phase=TwStockMarketPhase.continuous_trading,
    simtrade=False,
    unit=IndexComponentsUnit.points,

    groups=[
        IndexComponentGroupValue(
            category='1', name='水泥工業', item_count=7, value=Decimal('-0.62'),
        ),
        IndexComponentGroupValue(
            category='2', name='食品工業', item_count=25, value=Decimal('-2.00'),
        ),
        IndexComponentGroupValue(
            category='3', name='塑膠工業', item_count=21, value=Decimal('61.77'),
        ),
        ... 26 groups omitted ...,
        IndexComponentGroupValue(
            category='36', name='數位雲端', item_count=13, value=Decimal('-0.03'),
        ),
        IndexComponentGroupValue(
            category='37', name='運動休閒', item_count=18, value=Decimal('0.28'),
        ),
        IndexComponentGroupValue(
            category='38', name='居家生活', item_count=11, value=Decimal('-0.46'),
        ),
    ],
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_components \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "group_metric", "metric": "contribution"}}'

# open SSE to receive industry metrics (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/index_components

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_components \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "group_metric", "metric": "contribution"}}'

```

Out

```
event:index_components
data:{
  "contract": {"security_type": "IND", "region": "TW", "exchange": "TSE", "code": "IX0001"},
  "projection": {"kind": "group_metric", "metric": "contribution"},
  "date": "2026-08-28",
  "time": "09:09:29.000000",
  "calculated_at": "2026-08-28T09:09:29.000000+08:00",
  "reference_date": "2026-08-28",
  "market_phase": "continuous_trading",
  "simtrade": false,
  "unit": "points",
  "groups": [
    {"category": "1", "name": "水泥工業", "item_count": 7, "value": "-0.22"},
    {"category": "2", "name": "食品工業", "item_count": 25, "value": "-1.38"},
    {"category": "3", "name": "塑膠工業", "item_count": 21, "value": "19.52"},
    {"category": "4", "name": "紡織纖維", "item_count": 42, "value": "-0.84"},
    {"category": "5", "name": "電機機械", "item_count": 50, "value": "-4.36"},
    {"category": "6", "name": "電器電纜", "item_count": 16, "value": "0.43"},
    {"category": "8", "name": "玻璃陶瓷", "item_count": 5, "value": "-0.08"},
    {"category": "9", "name": "造紙工業", "item_count": 7, "value": "-0.03"},
    {"category": "10", "name": "鋼鐵工業", "item_count": 31, "value": "-0.47"},
    {"category": "11", "name": "橡膠工業", "item_count": 11, "value": "-0.16"},
    ...
  ]
}

```

#### Attributes

IndexComponentsGroupUpdate

```
contract (Contract)                          index contract
projection (IndexComponentsProjection)       projection
date (datetime.date)                         date
time (datetime.time)                         time
calculated_at (datetime.datetime)            calculation time
reference_date (datetime.date)               reference price date
market_phase (TwStockMarketPhase)            market phase
simtrade (bool)                              simulated trading
unit (IndexComponentsUnit)                   unit of value
groups (List[IndexComponentGroupValue])      industry list

```

IndexComponentGroupValue

```
category (str)                           industry category code
name (str)                               industry name
item_count (int)                         number of constituent stocks
value (Decimal)                          metric value (per metric)

```

### Industry Ranking

A ranking of industry groups sorted by the chosen metric is pushed once per second; build `projection` with `group_ranking`:

Projection

```
sj.IndexComponentsProjection.group_ranking(metric, order, limit)

```

Projection Parameters:

```
metric: industry metric                                   HTTP (metric)
        IndexComponentsGroupMetric.Contribution           contribution               contribution points
        IndexComponentsGroupMetric.EqualWeightPerformance equal_weight_performance   equal-weighted change (%)
        IndexComponentsGroupMetric.WeightedPerformance    weighted_performance       weighted change (%)
        IndexComponentsGroupMetric.Weight                 weight                     weight (%)
        IndexComponentsGroupMetric.Amount                 amount                     turnover
        IndexComponentsGroupMetric.Breadth                breadth                    advance/decline breadth (%)
order:  sort order                                        HTTP (order)
        IndexComponentsRankingOrder.Desc                  desc                       descending
        IndexComponentsRankingOrder.Asc                   asc                        ascending
        IndexComponentsRankingOrder.AbsDesc               abs_desc                   by absolute value, descending
        IndexComponentsRankingOrder.PositiveDesc          positive_desc              positive values only, descending
        IndexComponentsRankingOrder.NegativeAsc           negative_asc               negative values only, ascending
limit:  number of entries, 10

```

Tips

Only the following `metric` / `order` combinations are supported; any other combination raises `ValueError` when the projection is built: `Contribution`, `EqualWeightPerformance`, `WeightedPerformance`, `Breadth` with `AbsDesc` / 10; `Weight`, `Amount` with `Desc` / 10. Unsubscribing requires the same `projection` used to subscribe.

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndexComponents,
    projection=sj.IndexComponentsProjection.group_ranking(
        sj.IndexComponentsGroupMetric.Contribution,
        sj.IndexComponentsRankingOrder.AbsDesc,
        10,
    ),
)

# unsubscribe
# api.unsubscribe(
#     contract,
#     quote_type=sj.QuoteType.IndexComponents,
#     projection=sj.IndexComponentsProjection.group_ranking(
#         sj.IndexComponentsGroupMetric.Contribution,
#         sj.IndexComponentsRankingOrder.AbsDesc,
#         10,
#     ),
# )

```

Out

```
IndexComponentsGroupUpdate(groups=10)(
    contract=Contract(code='IX0001', exchange='TSE'),
    projection=IndexComponentsProjection(kind='ranking', target='group', metric='contribution', order='abs_desc', limit=10, group=None),
    date=datetime.date(2026, 8, 27),
    time=datetime.time(10, 43, 4),
    calculated_at=datetime.datetime(2026, 8, 27, 10, 43, 4, tzinfo=datetime.timezone(datetime.timedelta(seconds=28800))),
    reference_date=datetime.date(2026, 8, 27),
    market_phase=TwStockMarketPhase.continuous_trading,
    simtrade=False,
    unit=IndexComponentsUnit.points,

    groups=[
        IndexComponentGroupValue(
            category='24', name='半導體業', item_count=96, value=Decimal('109.90'),
        ),
        IndexComponentGroupValue(
            category='28', name='電子零組件業', item_count=104, value=Decimal('81.66'),
        ),
        IndexComponentGroupValue(
            category='3', name='塑膠工業', item_count=21, value=Decimal('62.17'),
        ),
        ... 4 groups omitted ...,
        IndexComponentGroupValue(
            category='5', name='電機機械', item_count=50, value=Decimal('15.85'),
        ),
        IndexComponentGroupValue(
            category='27', name='通信網路業', item_count=46, value=Decimal('11.89'),
        ),
        IndexComponentGroupValue(
            category='23', name='油電燃氣', item_count=8, value=Decimal('6.42'),
        ),
    ],
)

```

In

```
# subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_components \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "group", "metric": "contribution", "order": "abs_desc", "limit": 10}}'

# open SSE to receive the industry ranking (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data/index_components

# unsubscribe
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_components \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "group", "metric": "contribution", "order": "abs_desc", "limit": 10}}'

```

Out

```
event:index_components
data:{
  "contract": {"security_type": "IND", "region": "TW", "exchange": "TSE", "code": "IX0001"},
  "projection": {"kind": "ranking", "target": "group", "metric": "contribution", "order": "abs_desc", "limit": 10},
  "date": "2026-08-28",
  "time": "09:12:01.000000",
  "calculated_at": "2026-08-28T09:12:01.000000+08:00",
  "reference_date": "2026-08-28",
  "market_phase": "continuous_trading",
  "simtrade": false,
  "unit": "points",
  "groups": [
    {"category": "24", "name": "半導體業", "item_count": 96, "value": "321.15"},
    {"category": "28", "name": "電子零組件業", "item_count": 104, "value": "103.47"},
    {"category": "25", "name": "電腦及週邊設備業", "item_count": 64, "value": "29.90"},
    {"category": "17", "name": "金融保險", "item_count": 32, "value": "27.44"},
    {"category": "31", "name": "其他電子業", "item_count": 46, "value": "24.16"},
    {"category": "26", "name": "光電業", "item_count": 68, "value": "17.17"},
    {"category": "3", "name": "塑膠工業", "item_count": 21, "value": "13.81"},
    {"category": "15", "name": "航運業", "item_count": 28, "value": "-7.18"},
    {"category": "27", "name": "通信網路業", "item_count": 46, "value": "5.68"},
    {"category": "5", "name": "電機機械", "item_count": 50, "value": "-3.77"}
  ]
}

```

#### Attributes

IndexComponentsGroupUpdate

```
contract (Contract)                          index contract
projection (IndexComponentsProjection)       projection
date (datetime.date)                         date
time (datetime.time)                         time
calculated_at (datetime.datetime)            calculation time
reference_date (datetime.date)               reference price date
market_phase (TwStockMarketPhase)            market phase
simtrade (bool)                              simulated trading
unit (IndexComponentsUnit)                   unit of value
groups (List[IndexComponentGroupValue])      industry list

```

IndexComponentGroupValue

```
category (str)                           industry category code
name (str)                               industry name
item_count (int)                         number of constituent stocks
value (Decimal)                          metric value (per metric)

```

## Callback

Without a callback, each event is printed by default. To handle the data yourself, register a callback function with the decorator:

### Calculated Index

Callback (decorator style)

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

### Components and Industries

Component ranking, industry metrics, and industry ranking share `on_index_components`; the type received depends on the `projection`:

Callback (decorator style)

```
from shioaji import IndexComponentsRankingUpdate, IndexComponentsGroupUpdate

@api.on_index_components()
def index_components_callback(update: IndexComponentsRankingUpdate | IndexComponentsGroupUpdate):
    print(update)

```

Callback (traditional style)

```
from shioaji import IndexComponentsRankingUpdate, IndexComponentsGroupUpdate

def index_components_callback(update: IndexComponentsRankingUpdate | IndexComponentsGroupUpdate):
    print(update)

api.set_on_index_components_callback(index_components_callback)

```
