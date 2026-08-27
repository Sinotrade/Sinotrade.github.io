即時加值資料（Enriched Data）是行情引擎在交易所原始行情之上即時運算產生的加值資料，僅在開盤時段推送。與一般即時行情相同，透過訂閱[商品合約](../../../contract/)的方式接收，只需指定對應的 `quote_type`。

提醒

即時加值資料訂閱不會佔用流量。

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
contract:     要訂閱的指數合約（由 api.contracts.get 取得）
quote_type:   加值資料類型 {CalculatedIndex, IndexComponents}
intraday_odd: 即時加值資料不支援，固定為 False
version:      即時加值資料不支援，省略即可
projection:   投影方式，僅 QuoteType.IndexComponents 使用

```

Subscribe

```
POST /api/v1/stream/subscribe/calculated_index
POST /api/v1/stream/subscribe/index_components

```

每種即時加值資料各有獨立端點；取消訂閱以相同 body 呼叫對應的 `/api/v1/stream/unsubscribe/...`。

Quote Parameters:

```
calculated_index:  {"index": <StreamContract>}
index_components:  {"index": <StreamContract>, "projection": <IndexComponentsProjection>}

```

## 類型總覽

| QuoteType | projection | 說明 | 推送頻率 | | --- | --- | --- | --- | | `CalculatedIndex` | — | [自算指數](#calculatedindex) | 一秒可多筆 | | `IndexComponents` | `component_ranking` | [成分股排行](#component-ranking) | 每秒一次（產業內每 5 秒） | | `IndexComponents` | `group_metric` | [產業類股指標](#group-metric) | 每秒一次 | | `IndexComponents` | `group_ranking` | [產業類股排行](#group-ranking) | 每秒一次 |

商品限制

加值資料皆以**指數合約**訂閱，目前僅支援 `IX0001`（加權指數）與 `IX0043`（櫃買指數）。

注意

- 即時加值資料不支援 `intraday_odd` 與 `version` 參數，帶入會直接報錯。
- CLI 的 `shioaji data stream` 指令不支援即時加值資料，請使用 Python 或 HTTP 介面。

## 自算指數

行情引擎依該指數的成分股成交即時試算指數值，更新頻率高於官方指數，同一秒內可能推送多筆。

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.CalculatedIndex,
)

# 取消訂閱
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
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/calculated_index \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}}'

# 開 SSE 收自算指數（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/calculated_index

# 取消訂閱
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

### 屬性

CalculatedIndex

```
code (str)                               指數代碼
date (str)                               日期
time (str)                               時間
open (float)                             開盤指數
high (float)                             最高指數
low (float)                              最低指數
close (float)                            最新指數
total_amount (int)                       累計成交金額 (NTD)
price_chg (float)                        漲跌
pct_chg (float)                          漲跌幅 (%)
simtrade (bool)                          試撮

```

## 成分股與產業類股

以 `QuoteType.IndexComponents` 訂閱，並以 `projection` 指定推送下列三種資料之一。

注意

`projection` 為必填參數，未帶會直接報錯；`projection` 也僅適用於 `QuoteType.IndexComponents`，與其他 `quote_type` 併用同樣會報錯。

### 成分股排行

每秒推送一次成分股排行，列出依指定指標排序的成分股；`projection` 以 `component_ranking` 建立：

Projection

```
sj.IndexComponentsProjection.component_ranking(metric, order, limit, group=None)

```

Projection Parameters:

```
metric: 排行指標                                          HTTP (metric)
        IndexComponentsComponentMetric.Contribution       contribution       貢獻點數
        IndexComponentsComponentMetric.PctChange          pct_chg            漲跌幅 (%)
        IndexComponentsComponentMetric.Weight             weight             權重 (%)
        IndexComponentsComponentMetric.Amount             amount             成交金額
order:  排序方式                                          HTTP (order)
        IndexComponentsRankingOrder.Desc                  desc               由高至低
        IndexComponentsRankingOrder.Asc                   asc                由低至高
        IndexComponentsRankingOrder.AbsDesc               abs_desc           絕對值由高至低
        IndexComponentsRankingOrder.PositiveDesc          positive_desc      僅正值，由高至低
        IndexComponentsRankingOrder.NegativeAsc           negative_asc       僅負值，由低至高
limit:  筆數，10 或 25
group:  產業類別代碼（如 "24" 為半導體業），帶入則只排該產業內的成分股，每 5 秒推送一次；代碼見產業類股指標的 category

```

提醒

`order` / `limit` 僅支援以下組合，其他組合在建立 projection 時即會拋出 `ValueError`：`Contribution`、`PctChange` 可用 `Desc` / 10、`AbsDesc` / 10、`PositiveDesc` / 25、`NegativeAsc` / 25；`Weight`、`Amount` 僅 `Desc` / 10；帶入 `group` 時僅 `Contribution` 搭配 `AbsDesc` / 10、`Amount` 搭配 `Desc` / 10。取消訂閱需帶入與訂閱時相同的 `projection`。

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

# 取消訂閱
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
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_components \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "component", "metric": "contribution", "order": "abs_desc", "limit": 10, "group": "24"}}'

# 開 SSE 收成分股排行（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/index_components

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_components \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "component", "metric": "contribution", "order": "abs_desc", "limit": 10, "group": "24"}}'

```

#### 屬性

IndexComponentsRankingUpdate

```
contract (Contract)                          指數合約
projection (IndexComponentsProjection)       投影方式
date (datetime.date)                         日期
time (datetime.time)                         時間
calculated_at (datetime.datetime)            計算時間
reference_date (datetime.date)               參考價基準日
market_phase (TwStockMarketPhase)            盤別
simtrade (bool)                              試撮
entries (List[IndexComponentRankingEntry])   排行清單

```

IndexComponentRankingEntry

```
code (str)                               股票代碼
category (str)                           產業類別代碼
price (Decimal)                          成交價
reference (Decimal)                      參考價
price_chg (Decimal)                      漲跌
pct_chg (Decimal)                        漲跌幅 (%)
value (Decimal)                          指標值（依 metric）
reference_weight_ppm (int)               參考權重 (ppm)
price_source (PriceSource)               價格來源
trading_status (TradingStatus)           交易狀態
data_status (DataStatus)                 資料狀態

```

### 產業類股指標

每秒推送一次全部產業類股的指標值；`projection` 以 `group_metric` 建立：

Projection

```
sj.IndexComponentsProjection.group_metric(metric)

```

Projection Parameters:

```
metric: 產業指標                                          HTTP (metric)
        IndexComponentsGroupMetric.Contribution           contribution               貢獻點數
        IndexComponentsGroupMetric.EqualWeightPerformance equal_weight_performance   等權重漲跌幅 (%)
        IndexComponentsGroupMetric.WeightedPerformance    weighted_performance       加權漲跌幅 (%)
        IndexComponentsGroupMetric.Weight                 weight                     權重 (%)
        IndexComponentsGroupMetric.Amount                 amount                     成交金額
        IndexComponentsGroupMetric.AmountShare            amount_share               成交金額占比 (%)
        IndexComponentsGroupMetric.Breadth                breadth                    漲跌家數比 (%)

```

提醒

取消訂閱需帶入與訂閱時相同的 `projection`。

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

# 取消訂閱
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
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_components \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "group_metric", "metric": "contribution"}}'

# 開 SSE 收產業類股指標（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/index_components

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_components \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "group_metric", "metric": "contribution"}}'

```

#### 屬性

IndexComponentsGroupUpdate

```
contract (Contract)                          指數合約
projection (IndexComponentsProjection)       投影方式
date (datetime.date)                         日期
time (datetime.time)                         時間
calculated_at (datetime.datetime)            計算時間
reference_date (datetime.date)               參考價基準日
market_phase (TwStockMarketPhase)            盤別
simtrade (bool)                              試撮
unit (IndexComponentsUnit)                   value 的單位
groups (List[IndexComponentGroupValue])      產業清單

```

IndexComponentGroupValue

```
category (str)                           產業類別代碼
name (str)                               產業名稱
item_count (int)                         成分股家數
value (Decimal)                          指標值（依 metric）

```

### 產業類股排行

每秒推送一次產業類股排行，列出依指定指標排序的產業；`projection` 以 `group_ranking` 建立：

Projection

```
sj.IndexComponentsProjection.group_ranking(metric, order, limit)

```

Projection Parameters:

```
metric: 產業指標                                          HTTP (metric)
        IndexComponentsGroupMetric.Contribution           contribution               貢獻點數
        IndexComponentsGroupMetric.EqualWeightPerformance equal_weight_performance   等權重漲跌幅 (%)
        IndexComponentsGroupMetric.WeightedPerformance    weighted_performance       加權漲跌幅 (%)
        IndexComponentsGroupMetric.Weight                 weight                     權重 (%)
        IndexComponentsGroupMetric.Amount                 amount                     成交金額
        IndexComponentsGroupMetric.Breadth                breadth                    漲跌家數比 (%)
order:  排序方式                                          HTTP (order)
        IndexComponentsRankingOrder.Desc                  desc                       由高至低
        IndexComponentsRankingOrder.Asc                   asc                        由低至高
        IndexComponentsRankingOrder.AbsDesc               abs_desc                   絕對值由高至低
        IndexComponentsRankingOrder.PositiveDesc          positive_desc              僅正值，由高至低
        IndexComponentsRankingOrder.NegativeAsc           negative_asc               僅負值，由低至高
limit:  筆數，10

```

提醒

`metric` / `order` 僅支援以下組合，其他組合在建立 projection 時即會拋出 `ValueError`：`Contribution`、`EqualWeightPerformance`、`WeightedPerformance`、`Breadth` 搭配 `AbsDesc` / 10；`Weight`、`Amount` 搭配 `Desc` / 10。取消訂閱需帶入與訂閱時相同的 `projection`。

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

# 取消訂閱
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
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_components \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "group", "metric": "contribution", "order": "abs_desc", "limit": 10}}'

# 開 SSE 收產業類股排行（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/index_components

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/index_components \
#   -H 'Content-Type: application/json' \
#   -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "projection": {"kind": "ranking", "target": "group", "metric": "contribution", "order": "abs_desc", "limit": 10}}'

```

#### 屬性

IndexComponentsGroupUpdate

```
contract (Contract)                          指數合約
projection (IndexComponentsProjection)       投影方式
date (datetime.date)                         日期
time (datetime.time)                         時間
calculated_at (datetime.datetime)            計算時間
reference_date (datetime.date)               參考價基準日
market_phase (TwStockMarketPhase)            盤別
simtrade (bool)                              試撮
unit (IndexComponentsUnit)                   value 的單位
groups (List[IndexComponentGroupValue])      產業清單

```

IndexComponentGroupValue

```
category (str)                           產業類別代碼
name (str)                               產業名稱
item_count (int)                         成分股家數
value (Decimal)                          指標值（依 metric）

```

## Callback

未設定 callback 時預設直接印出。如需自行處理資料，可用 decorator 註冊 callback 函式：

### 自算指數

Callback（decorator 方式）

```
from shioaji import CalculatedIndex

@api.on_calculated_index()
def calculated_index_callback(idx: CalculatedIndex):
    print(idx)

```

Callback（傳統方式）

```
from shioaji import CalculatedIndex

def calculated_index_callback(idx: CalculatedIndex):
    print(idx)

api.set_on_calculated_index_callback(calculated_index_callback)

```

### 成分股與產業類股

成分股排行、產業類股指標、產業類股排行共用 `on_index_components`，收到的型別依 `projection` 而定：

Callback（decorator 方式）

```
from shioaji import IndexComponentsRankingUpdate, IndexComponentsGroupUpdate

@api.on_index_components()
def index_components_callback(update: IndexComponentsRankingUpdate | IndexComponentsGroupUpdate):
    print(update)

```

Callback（傳統方式）

```
from shioaji import IndexComponentsRankingUpdate, IndexComponentsGroupUpdate

def index_components_callback(update: IndexComponentsRankingUpdate | IndexComponentsGroupUpdate):
    print(update)

api.set_on_index_components_callback(index_components_callback)

```
