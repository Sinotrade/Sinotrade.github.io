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
    *,
    ranking=None,
)

```

Quote Parameters:

```
contract:     要訂閱的指數合約（由 api.contracts.get 取得）
quote_type:   加值資料類型 {CalculatedIndex, IndexContribution, IndustryContribution}
intraday_odd: 即時加值資料不支援，固定為 False
version:      即時加值資料不支援，省略即可
ranking:      排行方式，僅 QuoteType.IndexContribution 使用（keyword-only）

```

Subscribe

```
POST /api/v1/stream/subscribe/calculated_index
POST /api/v1/stream/subscribe/index_contribution
POST /api/v1/stream/subscribe/industry_contribution

```

每種即時加值資料各有獨立端點；取消訂閱以相同 body 呼叫對應的 `/api/v1/stream/unsubscribe/...`。

Quote Parameters:

```
calculated_index:      {"index": <StreamContract>}
index_contribution:    {"index": <StreamContract>, "ranking": <ContributionRanking>}
industry_contribution: {"index": <StreamContract>}

```

## 類型總覽

| QuoteType | 說明 | 推送頻率 | | --- | --- | --- | | `CalculatedIndex` | [自算指數](#calculatedindex) | 一秒可多筆 | | `IndexContribution` | [指數貢獻](#indexcontribution)（個股對指數的貢獻點數） | 每秒一次 | | `IndustryContribution` | [產業貢獻](#industrycontribution)（類股對指數的貢獻點數） | 每秒一次 |

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

Callback（decorator 方式）

未設定 callback 時預設直接印出。如需自行處理資料，可用 decorator 註冊 callback 函式：

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

## 指數貢獻

每秒推送一次個股貢獻排行，列出對該指數漲跌貢獻最大的成分股，排行方式以 keyword 參數 `ranking` 指定：

ContributionRanking

```
# Python                                 HTTP (ranking)
ContributionRanking.Top10                top10            貢獻點數前 10 名
ContributionRanking.Abs10                abs10            貢獻點數絕對值前 10 名
ContributionRanking.Positive25           positive25       正貢獻前 25 名
ContributionRanking.Negative25           negative25       負貢獻前 25 名

```

提醒

`ranking` 為必填參數，未帶會直接報錯；`ranking` 也僅適用於 `QuoteType.IndexContribution`，與其他 `quote_type` 併用同樣會報錯。

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndexContribution,
    ranking=sj.ContributionRanking.Top10,
)

# 取消訂閱
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

Callback（decorator 方式）

未設定 callback 時預設直接印出。如需自行處理資料，可用 decorator 註冊 callback 函式：

```
from shioaji import IndexContribution

@api.on_index_contribution()
def index_contribution_callback(ic: IndexContribution):
    print(ic)

```

Callback（傳統方式）

```
from shioaji import IndexContribution

def index_contribution_callback(ic: IndexContribution):
    print(ic)

api.set_on_index_contribution_callback(index_contribution_callback)

```

In

```
# 訂閱（ranking：top10 / abs10 / positive25 / negative25）
curl -X POST http://localhost:8080/api/v1/stream/subscribe/index_contribution \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}, "ranking": "top10"}'

# 開 SSE 收指數貢獻（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/index_contribution

# 取消訂閱
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

### 屬性

IndexContribution

```
ranking (ContributionRanking)            排行方式
code (str)                               指數代碼
date (str)                               日期
time (str)                               時間
entries (List[IndexContributionEntry])   貢獻排行清單
simtrade (bool)                          試撮

```

IndexContributionEntry

```
code (str)                               股票代碼
price (float)                            成交價
reference (float)                        參考價
price_chg (float)                        漲跌
pct_chg (float)                          漲跌幅 (%)
points (float)                           貢獻點數

```

## 產業貢獻

每秒推送一次產業貢獻排行，列出各產業類股對該指數漲跌的貢獻點數，依貢獻由高至低排列。

In

```
contract = api.contracts.get("IX0001")
api.subscribe(
    contract,
    quote_type=sj.QuoteType.IndustryContribution,
)

# 取消訂閱
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

Callback（decorator 方式）

未設定 callback 時預設直接印出。如需自行處理資料，可用 decorator 註冊 callback 函式：

```
from shioaji import IndustryContribution

@api.on_industry_contribution()
def industry_contribution_callback(ind: IndustryContribution):
    print(ind)

```

Callback（傳統方式）

```
from shioaji import IndustryContribution

def industry_contribution_callback(ind: IndustryContribution):
    print(ind)

api.set_on_industry_contribution_callback(industry_contribution_callback)

```

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/industry_contribution \
  -H 'Content-Type: application/json' \
  -d '{"index": {"security_type": "IND", "exchange": "TSE", "code": "IX0001", "target_code": null}}'

# 開 SSE 收產業貢獻（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/industry_contribution

# 取消訂閱
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

### 屬性

IndustryContribution

```
code (str)                                指數代碼
date (str)                                日期
time (str)                                時間
entries (List[IndustryContributionEntry]) 產業貢獻清單
simtrade (bool)                           試撮
index_close (float)                       最新指數
index_price_chg (float)                   指數漲跌（entries 貢獻點數加總等於此值）

```

IndustryContributionEntry

```
category (str)                           產業類別代碼
points (float)                           貢獻點數

```
