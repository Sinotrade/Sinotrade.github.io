商品合約將在很多地方被使用，例如下單、訂閱行情...等。

商品合約每日於以下時間更新：

商品合約更新資訊

- 07:50 期貨商品合約更新
- 08:00 全市場商品合約更新
- 14:45 期貨夜盤商品合約更新
- 17:15 期貨夜盤商品合約更新

## 載入商品合約

自 1.7.0 起，商品合約的載入方式與代碼規則有幾項調整：

- **不用再自己管理商品合約更新**：以前您得記住商品合約的更新時間、並挑在更新後才登入才能拿到最新商品，期貨夜盤的交易者尤其困擾。1.7.0 起，商品合約會在有更新時自動保持最新，您不必再關心更新時機。
- **登入更快**：登入不再下載整份商品合約，改為第一次查詢某類商品時才自動載入該類（例如查詢股票時才載入股票），不需等候整份下載完成即可開始操作。
- **只載入您用到的**：例如只交易股票時，不會載入期貨或選擇權的商品合約，節省下載流量與資源。
- **指數代碼標準化**：指數改用交易所代碼（如加權指數為 `IX0001`），與交易所一致、更為標準。

您不需要再自行設定下載參數或確認下載狀態，登入後直接查詢即可。

商品合約由 server 在 `shioaji server start` 啟動時自動完成載入（詳見[登入](../login/)頁面的 server 啟動 log），使用者無須額外操作。

## 取得商品合約

### 查詢單一商品

當您已經知道商品代碼（例如台積電 `2330`），可透過 `get` 直接查詢單一商品。股票、期貨、指數皆適用同一個方法，不需先區分商品類型。

用 `api.contracts.get(code)` 查詢：

In

```
api.contracts.get("2330")     # 股票
api.contracts.get("TXFR1")    # 期貨
api.contracts.get("IX0001")   # 指數
api.contracts.get("XXXX")     # 不存在的代碼

```

Out

```
Contract(security_type='STK', region='TW', exchange='TSE', code='2330')
Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFR1', target_code='TXFG6')
Contract(security_type='IND', region='TW', exchange='TSE', code='IX0001')
None

```

提醒

查無此代碼時回傳 `None`。

In

```
curl "http://localhost:8080/api/v1/data/contracts/2330"

```

Out

```
{"security_type":"STK","region":"TW","exchange":"TSE","code":"2330","target_code":null}

```

Parameters

```
security_type: 商品類別（選填）。指定後只在該類別中查找；不帶則自動判斷。
region:        市場別，預設 TW

```

Contract

```
security_type (str):   商品類型 {STK, IND, FUT, OPT, WRT}
region (str):          市場區域
exchange (str):        交易所
code (str):            商品代碼
target_code (str):     實際目標代碼，僅期貨連續月（如 TXFR1/R2）才有值

```

### 列出某一類商品

前面的查詢方式，都需要您先知道商品代碼。若您想瀏覽整個市場，或不確定代碼，可透過 `list` 列出某一類的所有商品，再從中篩選：

用 `api.contracts.list(security_type)` 列出：

In

```
api.contracts.list(sj.SecurityType.Stock)     # 證券
api.contracts.list(sj.SecurityType.Futures)   # 期貨
api.contracts.list(sj.SecurityType.Option)    # 選擇權
api.contracts.list(sj.SecurityType.Index)     # 指數
api.contracts.list(sj.SecurityType.Warrant)   # 權證

```

Out

```
[Contract(security_type='STK', region='TW', exchange='TSE', code='00400A'), Contract(security_type='STK', region='TW', exchange='TSE', code='00401A'), ...]
[Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='BRFI6'), Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='BRFR1', target_code='BRFI6'), ...]
[Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TGO14900H6'), Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TGO14900T6'), ...]
[Contract(security_type='IND', region='TW', exchange='OTC', code='EMP88'), Contract(security_type='IND', region='TW', exchange='OTC', code='GTCI'), ...]
[Contract(security_type='WRT', region='TW', exchange='TSE', code='03007T'), Contract(security_type='WRT', region='TW', exchange='TSE', code='030103'), ...]

```

以 `GET /api/v1/data/contracts` 查詢，結果以 `page` / `page_size` 分頁：

In

```
curl "http://localhost:8080/api/v1/data/contracts?security_type=STK&page=1&page_size=3"

```

Out

```
{"contracts":[{"security_type":"STK","region":"TW","exchange":"TSE","code":"00400A","target_code":null},{"security_type":"STK","region":"TW","exchange":"TSE","code":"00401A","target_code":null},{"security_type":"STK","region":"TW","exchange":"TSE","code":"00402A","target_code":null}],"security_type":"STK","region":"TW","page":1,"page_size":3,"max_page":1041,"total":3122}

```

Parameters

```
security_type: 商品類型 {STK, FUT, OPT, IND, WRT}（必填）
region:        市場區域，預設 TW
page:          頁碼，從 1 起算；省略時預設 1
page_size:     每頁筆數，預設 1000

```

`page` 與 `page_size` 皆不帶時，會一次回傳全部商品（不分頁）；帶其中一個即進入分頁模式。

## 各類商品資訊

目前提供台股市場的證券、期貨、選擇權、指數與權證。以下分別說明各類商品的查詢方式與欄位。

### 取得商品詳細資訊

`get()` 回傳的 `Contract` 只包含識別商品所需的基本資訊（商品類型、交易所、代碼），這對於下單與訂閱行情已經足夠。若您還需要商品名稱、漲跌停價、交易單位等完整資料，可透過 `info` 取得該商品的完整資料：

將 `Contract` 傳入 `api.contracts.info()`：

In

```
c = api.contracts.get("2330")
api.contracts.info(c)

```

Out

```
StockInfo(Contract(security_type='STK', region='TW', exchange='TSE', code='2330'), code='2330', name='台積電', category='24', currency=<Currency.TWD: 'TWD'>, unit=1000.0, day_trade=<DayTrade.Yes: 'Yes'>, reference=2440.0, limit_up=2680.0, limit_down=2200.0, margin_trading_balance=0, short_selling_balance=99, trading_suspended=False, margin_loan_ratio=0.6, margin_quota_lots=0, short_margin_ratio=0.9, short_quota_lots=99, short_selling_suspended=False, disposition_level=0, attention_flag=False, short_below_par_eligible=True, slb_below_par_eligible=True, etf_constituent=True, settlement_type='0', update_date=datetime.date(2026, 7, 16))

```

依商品類型不同，`info()` 會回傳對應的資訊物件（`StockInfo`、`FuturesInfo`、`OptionInfo`、`IndexInfo`、`WarrantInfo`），各自的欄位說明見以下各類。

提醒

下單與訂閱行情只需要 `get()` 取得的 `Contract`，不需要額外呼叫 `info()`。

以 `GET /api/v1/data/contracts/{code}/info` 取得完整資訊：

In

```
curl "http://localhost:8080/api/v1/data/contracts/2330/info"

```

Out

```
{"security_type":"STK","region":"TW","exchange":"TSE","code":"2330","target_code":null,"name":"台積電","category":"24","currency":"TWD","unit":1000.0,"day_trade":"Yes","reference":2440.0,"limit_up":2680.0,"limit_down":2200.0,"margin_trading_balance":0,"short_selling_balance":99,"trading_suspended":false,"margin_loan_ratio":0.6,"margin_quota_lots":0,"short_margin_ratio":0.9,"short_quota_lots":99,"short_selling_suspended":false,"disposition_level":0,"attention_flag":false,"short_below_par_eligible":true,"slb_below_par_eligible":true,"etf_constituent":true,"settlement_type":"0","disposition_match_interval_min":null,"disposition_max_lots_single_order":null,"disposition_max_lots_total_orders":null,"disposition_prepay_ratio":null,"update_date":"2026-07-16"}

```

Parameters

```
security_type: 商品類別（選填）。指定後只在該類別中查找；不帶則自動判斷。
region:        市場別，預設 TW

```

### 證券

以證券代碼查詢，再取得詳細資訊：

In

```
c = api.contracts.get("2330")
api.contracts.info(c)

```

Out

```
StockInfo(
    Contract(security_type='STK', region='TW', exchange='TSE', code='2330'),
    code='2330',
    name='台積電',
    category='24',
    currency=<Currency.TWD: 'TWD'>,
    unit=1000.0,
    day_trade=<DayTrade.Yes: 'Yes'>,
    reference=2440.0,
    limit_up=2680.0,
    limit_down=2200.0,
    margin_trading_balance=0,
    short_selling_balance=99,
    trading_suspended=False,
    margin_loan_ratio=0.6,
    margin_quota_lots=0,
    short_margin_ratio=0.9,
    short_quota_lots=99,
    short_selling_suspended=False,
    disposition_level=0,
    attention_flag=False,
    short_below_par_eligible=True,
    slb_below_par_eligible=True,
    etf_constituent=True,
    settlement_type='0',
    update_date=datetime.date(2026, 7, 16),
)

```

StockInfo

```
code (str):                                商品代碼
name (str):                                商品名稱
category (str):                            產業別
currency (Currency):                       交易幣別
unit (float):                              交易單位
day_trade (DayTrade):                      當沖資格 {Yes, OnlyBuy, No}
reference (float):                         參考價
limit_up (float):                          漲停價
limit_down (float):                        跌停價
margin_trading_balance (int):              融資餘額
short_selling_balance (int):               融券餘額
trading_suspended (bool):                  暫停交易
margin_loan_ratio (float):                 融資成數
margin_quota_lots (int):                   融資配額張數
short_margin_ratio (float):                融券保證金成數
short_quota_lots (int):                    融券配額張數
short_selling_suspended (bool):            暫停融券
disposition_level (int):                   處置等級（無處置為 0）
attention_flag (bool):                     注意股票
short_below_par_eligible (bool):           可低於面額融券
slb_below_par_eligible (bool):             可低於面額借券
etf_constituent (bool):                    ETF 成分股
settlement_type (str):                     交割類型
disposition_match_interval_min (int):      處置撮合間隔（分鐘）
disposition_max_lots_single_order (int):   處置單筆上限（張）
disposition_max_lots_total_orders (int):   處置累計上限（張）
disposition_prepay_ratio (float):          處置預收比例
update_date (date):                        資料日期

```

- Python 的 SDK 物件 repr 中，值為 `None` 的欄位會被省略。

### 期貨

以期貨代碼查詢，再取得詳細資訊：

In

```
c = api.contracts.get("TXFR1")
api.contracts.info(c)

```

Out

```
FuturesInfo(
    Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFR1', target_code='TXFH6'),
    code='TXFR1',
    name='臺股期貨 近月',
    root='TXF',
    delivery_month='202608',
    delivery_date=datetime.date(2026, 8, 19),
    last_trading_date=datetime.date(2026, 8, 19),
    begin_date=datetime.date(2026, 5, 21),
    underlying_kind='I',
    underlying_code='IX0001',
    multiplier=200.0,
    contract_size=200.0,
    size_unit='pt',
    quote_ccy='TWD',
    tick_basis='fixed',
    tick=1.0,
    tick_value=200.0,
    spec_kind='index_fut',
    decimal_locator=2,
    dynamic_banding=True,
    flow_group='1',
    reference=46066.0,
    limit_up=50672.0,
    limit_down=41460.0,
    update_date=datetime.date(2026, 7, 16),
)

```

FuturesInfo

```
code (str):                  商品代碼
name (str):                  商品名稱
root (str):                  商品根代碼
delivery_month (str):        契約月份
delivery_date (date):        到期／交割日期
last_trading_date (date):    最後交易日
begin_date (date):           開始交易日
underlying_kind (str):       標的種類 {S 股票, I 指數, E 外匯, C 商品}
underlying_code (str):       標的代碼
multiplier (float):          契約乘數
contract_size (float):       契約規模
size_unit (str):             契約規模單位
quote_ccy (str):             報價幣別
tick_basis (str):            跳動規則基礎 {fixed 固定, price 依價格, premium 依權利金}
tick_rule (str):             跳動規則代碼
tick (float):                最小跳動點
tick_value (float):          每跳價值
spec_kind (str):             契約規格類型
decimal_locator (int):       價格小數位設定
dynamic_banding (bool):      動態價格穩定措施
flow_group (str):            流量管制組別
reference (float):           參考價
limit_up (float):            第一階段漲幅上限
limit_down (float):          第一階段跌幅下限
limit_up_2 (float):          第二階段漲幅上限
limit_down_2 (float):        第二階段跌幅下限
limit_up_3 (float):          第三階段漲幅上限
limit_down_3 (float):        第三階段跌幅下限
update_date (date):          資料日期

```

- Python 的 SDK 物件 repr 中，值為 `None` 的欄位會被省略。

spec_kind 契約規格類型

- `index_fut`：指數期貨
- `stock_fut`：個股期貨
- `etf_fut`：ETF 期貨
- `commodity`：商品期貨
- `fx`：外匯期貨
- `unknown`：尚未完成規格對照

#### 列出所有期貨商品

若您不確定有哪些期貨商品，可透過 `futures_roots` 列出所有期貨商品的代碼與名稱：

In

```
api.contracts.futures_roots()

```

Out

```
[
    ('BRF', '布蘭特原油期貨 202607'),
    ('BTF', '生技期貨 202608'),
    ('CAF', '南亞期貨 202608'),
    ('CBF', '中鋼期貨 202608'),
    ('CCF', '聯電期貨 202608'),
    ...
]

```

In

```
curl "http://localhost:8080/api/v1/data/contracts/futures/roots"

```

Out

```
[
    {"root":"BRF","name":"布蘭特原油期貨 202607"},
    {"root":"BTF","name":"生技期貨 202608"},
    {"root":"CAF","name":"南亞期貨 202608"},
    {"root":"CBF","name":"中鋼期貨 202608"},
    {"root":"CCF","name":"聯電期貨 202608"},
    ...
]

```

#### 列出商品的所有契約

知道期貨商品代碼後，可透過 `futures` 取得該商品底下的所有契約：

以商品代碼呼叫 `api.contracts.futures(root)`：

In

```
api.contracts.futures("TXF")

```

Out

```
[
    FuturesInfo(..., code='TXFH6', name='臺股期貨 202608', root='TXF', delivery_month='202608', ...),
    FuturesInfo(..., code='TXFR1', name='臺股期貨 近月', root='TXF', delivery_month='202608', ...),
    FuturesInfo(..., code='TXFI6', name='臺股期貨 202609', root='TXF', delivery_month='202609', ...),
    FuturesInfo(..., code='TXFR2', name='臺股期貨 次月', root='TXF', delivery_month='202609', ...),
    FuturesInfo(..., code='TXFJ6', name='臺股期貨 202610', root='TXF', delivery_month='202610', ...),
    ...
]

```

提醒

契約中除了各月份合約（如 `TXFH6`），也包含連續月合約（`TXFR1` 近月、`TXFR2` 次月），其 `target_code` 會指向當前對應的實際契約。

以 `GET /api/v1/data/contracts/futures?root={root}` 查詢：

In

```
curl "http://localhost:8080/api/v1/data/contracts/futures?root=TXF"

```

Out

```
[
    {"code":"TXFH6","name":"臺股期貨 202608","root":"TXF","delivery_month":"202608", ...},
    {"code":"TXFR1","name":"臺股期貨 近月","root":"TXF","delivery_month":"202608","target_code":"TXFH6", ...},
    {"code":"TXFI6","name":"臺股期貨 202609","root":"TXF","delivery_month":"202609", ...},
    ...
]

```

Parameters

```
root:            商品代碼（如 TXF）
underlying_code: 標的代碼（如 2330、IX0001），以標的反查期貨
delivery_month:  交割月份（如 202608），篩選特定月份
region:          市場別，預設 TW

```

`root` 與 `underlying_code` 不可同時帶入，擇一即可。

#### 列出標的的所有期貨

若您想知道某檔股票或指數有哪些期貨，可透過 `futures_by_underlying` 以標的反查。

以標的的 `Contract` 呼叫 `api.contracts.futures_by_underlying(contract)`。

以台積電為例，可取得個股期貨：

In

```
c = api.contracts.get("2330")
api.contracts.futures_by_underlying(c)

```

Out

```
[
    FuturesInfo(..., code='CDFH6', name='台積電期貨 202608', root='CDF', underlying_code='2330', ...),
    FuturesInfo(..., code='CDFR1', name='台積電期貨 近月', root='CDF', underlying_code='2330', ...),
    FuturesInfo(..., code='CDFI6', name='台積電期貨 202609', root='CDF', underlying_code='2330', ...),
    ...
    FuturesInfo(..., code='QFFH6', name='小型台積電期貨 202608', root='QFF', underlying_code='2330', ...),
    FuturesInfo(..., code='QFFR1', name='小型台積電期貨 近月', root='QFF', underlying_code='2330', ...),
    ...
]

```

以加權指數為例，可取得指數期貨：

In

```
c = api.contracts.get("IX0001")
api.contracts.futures_by_underlying(c)

```

Out

```
[
    FuturesInfo(..., code='MX4G6', name='小型臺指期貨 202607 W4', root='MX4', underlying_code='IX0001', ...),
    ...
    FuturesInfo(..., code='MXFH6', name='小型臺指期貨 202608', root='MXF', underlying_code='IX0001', ...),
    FuturesInfo(..., code='MXFR1', name='小型臺指期貨 近月', root='MXF', underlying_code='IX0001', ...),
    ...
    FuturesInfo(..., code='TMFH6', name='微型臺指期貨 202608', root='TMF', underlying_code='IX0001', ...),
    ...
    FuturesInfo(..., code='TXFH6', name='臺股期貨 202608', root='TXF', underlying_code='IX0001', ...),
    FuturesInfo(..., code='TXFR1', name='臺股期貨 近月', root='TXF', underlying_code='IX0001', ...),
    ...
]

```

提醒

同一個標的可能對應多個期貨商品。例如台積電有台積電期貨（`CDF`）與小型台積電期貨（`QFF`）；加權指數則有臺股期貨（`TXF`）、小型臺指期貨（`MXF`、`MX4`）與微型臺指期貨（`TMF`）。回傳結果會包含所有商品的所有契約。

以標的反查期貨，用 `GET /api/v1/data/contracts/futures?underlying_code={code}`。

以台積電為例，可取得個股期貨：

In

```
curl "http://localhost:8080/api/v1/data/contracts/futures?underlying_code=2330"

```

Out

```
[
    {"code":"CDFH6","name":"台積電期貨 202608","root":"CDF","underlying_code":"2330", ...},
    {"code":"CDFR1","name":"台積電期貨 近月","root":"CDF","underlying_code":"2330","target_code":"CDFH6", ...},
    {"code":"QFFH6","name":"小型台積電期貨 202608","root":"QFF","underlying_code":"2330", ...},
    ...
]

```

以加權指數為例，可取得指數期貨：

In

```
curl "http://localhost:8080/api/v1/data/contracts/futures?underlying_code=IX0001"

```

Out

```
[
    {"code":"MXFH6","name":"小型臺指期貨 202608","root":"MXF","underlying_code":"IX0001", ...},
    {"code":"TMFH6","name":"微型臺指期貨 202608","root":"TMF","underlying_code":"IX0001", ...},
    {"code":"TXFH6","name":"臺股期貨 202608","root":"TXF","underlying_code":"IX0001", ...},
    ...
]

```

### 選擇權

以選擇權代碼查詢，再取得詳細資訊：

In

```
c = api.contracts.get("TXO34000H6")
api.contracts.info(c)

```

Out

```
OptionInfo(
    Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000H6'),
    code='TXO34000H6',
    name='臺指選擇權 202608 C 34000',
    root='TXO',
    delivery_month='202608',
    delivery_date=datetime.date(2026, 8, 19),
    last_trading_date=datetime.date(2026, 8, 19),
    begin_date=datetime.date(2026, 5, 21),
    strike_price=34000.0,
    option_right=<OptionRight.Call: 'C'>,
    expiry_weekday='Wed',
    week_of_month=3,
    underlying_kind='I',
    underlying_code='IX0001',
    multiplier=50.0,
    contract_size=50.0,
    size_unit='pt',
    quote_ccy='TWD',
    tick_basis='premium',
    tick_rule='tw_txo_premium_band',
    tick=10.0,
    tick_value=500.0,
    spec_kind='index_opt',
    decimal_locator=3,
    strike_decimal_locator=0,
    dynamic_banding=True,
    flow_group='1',
    reference=12100.0,
    limit_up=16660.0,
    limit_down=7540.0,
    update_date=datetime.date(2026, 7, 16),
)

```

OptionInfo

```
code (str):                     商品代碼
name (str):                     商品名稱
root (str):                     商品根代碼
delivery_month (str):           契約月份
delivery_date (date):           到期／交割日期
last_trading_date (date):       最後交易日
begin_date (date):              開始交易日
strike_price (float):           履約價
option_right (OptionRight):     買賣權 {Call, Put}
expiry_weekday (str):           到期星期
week_of_month (int):            月內到期週次
underlying_kind (str):          標的種類 {S 股票, I 指數, E 外匯, C 商品}
underlying_code (str):          標的代碼
multiplier (float):             契約乘數
contract_size (float):          契約規模
size_unit (str):                契約規模單位
quote_ccy (str):                報價幣別
tick_basis (str):               跳動規則基礎 {fixed 固定, price 依價格, premium 依權利金}
tick_rule (str):                跳動規則代碼
tick (float):                   最小跳動點
tick_value (float):             每跳價值
spec_kind (str):                契約規格類型
decimal_locator (int):          價格小數位設定
strike_decimal_locator (int):   履約價小數位
dynamic_banding (bool):         動態價格穩定措施
flow_group (str):               流量管制組別
reference (float):              參考價
limit_up (float):               第一階段漲幅上限
limit_down (float):             第一階段跌幅下限
limit_up_2 (float):             第二階段漲幅上限
limit_down_2 (float):           第二階段跌幅下限
limit_up_3 (float):             第三階段漲幅上限
limit_down_3 (float):           第三階段跌幅下限
update_date (date):             資料日期

```

- Python 的 SDK 物件 repr 中，值為 `None` 的欄位會被省略。

spec_kind 契約規格類型

- `index_opt`：指數選擇權
- `stock_opt`：個股選擇權
- `etf_opt`：ETF 選擇權
- `commodity_opt`：商品選擇權
- `unknown`：尚未完成規格對照

#### 列出所有選擇權商品

若您不確定有哪些選擇權商品，可透過 `option_roots` 列出所有選擇權商品的代碼與名稱：

In

```
api.contracts.option_roots()

```

Out

```
[
    ('CAA', '南亞選擇權'),
    ('CAO', '南亞選擇權'),
    ('CBO', '中鋼選擇權'),
    ('CCA', '聯電選擇權'),
    ('CCO', '聯電選擇權'),
    ...
]

```

In

```
curl "http://localhost:8080/api/v1/data/contracts/options/roots"

```

Out

```
[
    {"root":"CAO","name":"南亞選擇權"},
    {"root":"CBO","name":"中鋼選擇權"},
    {"root":"CCA","name":"聯電選擇權"},
    {"root":"CCO","name":"聯電選擇權"},
    {"root":"CDA","name":"台積電選擇權"},
    ...
]

```

#### 列出商品的所有契約

知道選擇權商品代碼後，可透過 `options` 取得該商品底下的所有契約：

以商品代碼呼叫 `api.contracts.options(root)`：

In

```
api.contracts.options("TXO")

```

Out

```
[
    OptionInfo(..., code='TXO34000H6', name='臺指選擇權 202608 C 34000', root='TXO', strike_price=34000.0, option_right=<OptionRight.Call: 'C'>, ...),
    OptionInfo(..., code='TXO34000T6', name='臺指選擇權 202608 P 34000', root='TXO', strike_price=34000.0, option_right=<OptionRight.Put: 'P'>, ...),
    OptionInfo(..., code='TXO34100H6', name='臺指選擇權 202608 C 34100', root='TXO', strike_price=34100.0, option_right=<OptionRight.Call: 'C'>, ...),
    OptionInfo(..., code='TXO34100T6', name='臺指選擇權 202608 P 34100', root='TXO', strike_price=34100.0, option_right=<OptionRight.Put: 'P'>, ...),
    ...
]

```

以 `GET /api/v1/data/contracts/options?root={root}` 查詢。由於單一商品的契約數量龐大，可搭配 `delivery_month`、`option_right`、`strike_min` / `strike_max` 等參數篩選：

In

```
curl "http://localhost:8080/api/v1/data/contracts/options?root=TXO&option_right=C&strike_min=34000&strike_max=34100"

```

Out

```
[
    {"code":"TXO34000H6","name":"臺指選擇權 202608 C 34000","root":"TXO","strike_price":34000.0,"option_right":"C","delivery_month":"202608", ...},
    {"code":"TXO34100H6","name":"臺指選擇權 202608 C 34100","root":"TXO","strike_price":34100.0,"option_right":"C","delivery_month":"202608", ...},
    ...
]

```

Parameters

```
root:           選擇權商品代碼（必填）
delivery_month: 交割月份（如 202609），篩選特定月份
option_right:   買賣權 {C, P}
strike_min:     履約價下限
strike_max:     履約價上限
expiry_weekday: 到期星期（如 Wed，篩選週選擇權）
region:         市場別，預設 TW

```

### 指數

以指數代碼查詢，再取得詳細資訊：

In

```
c = api.contracts.get("IX0001")
api.contracts.info(c)

```

Out

```
IndexInfo(
    Contract(security_type='IND', region='TW', exchange='TSE', code='IX0001'),
    code='IX0001',
    name='發行量加權股價指數',
    reference=45631.59,
    open_time='09:00',
    close_time='13:30',
    update_date=datetime.date(2026, 7, 16),
)

```

IndexInfo

```
code (str):          商品代碼
name (str):          指數名稱
reference (float):   參考指數值
open_time (str):     行情開始時間
close_time (str):    行情結束時間
update_date (date):  資料日期

```

- Python 的 SDK 物件 repr 中，值為 `None` 的欄位會被省略。

### 權證

權證依標的分組，可透過 `warrants` 取得某檔股票或指數所發行的所有權證。以台積電為例：

以標的的 `Contract` 呼叫 `api.contracts.warrants(標的)`：

In

```
c = api.contracts.get("2330")
warrants = api.contracts.warrants(c)
warrants

```

Out

```
[
    WarrantInfo(..., code='03002T', name='台積電群益5A售12', ...),
    WarrantInfo(..., code='03011T', name='台積電凱基67售14', ...),
    WarrantInfo(..., code='03035T', name='台積電凱基5A售11', ...),
    ...
]

```

取其中一檔，即可看到該權證的完整資訊：

In

```
warrants[0]

```

Out

```
WarrantInfo(
    Contract(security_type='WRT', region='TW', exchange='TSE', code='03002T'),
    code='03002T',
    underlying_code='2330',
    underlying_type='1',
    call_put='P',
    financial='W4',
    strike_price=1855.05,
    expiry_date=datetime.date(2026, 10, 16),
    last_trading_date=datetime.date(2026, 10, 14),
    exercise_ratio=0.019,
    exercise_style='European',
    listing_date=datetime.date(2026, 4, 17),
    exercise_start_date=datetime.date(2026, 10, 16),
    exercise_end_date=datetime.date(2026, 10, 16),
    barrier_upper=0.0,
    barrier_lower=0.0,
    residual_value=0.0,
    settlement_method='1',
    investor_restriction=' ',
    issue_size=541,
    name='台積電群益5A售12',
    reference=0.57,
    limit_up=5.1,
    limit_down=0.01,
    update_date=datetime.date(2026, 7, 16),
)

```

以 `GET /api/v1/data/contracts/warrants?underlying_code={code}` 查詢。權證數量龐大，可搭配 `call_put`、`strike_min` / `strike_max`、`expiry_from` / `expiry_to` 等參數篩選：

In

```
curl "http://localhost:8080/api/v1/data/contracts/warrants?underlying_code=2330&call_put=C&strike_min=1200&strike_max=1300"

```

Out

```
[
    {"code":"030573","name":"台積電統一68購01","underlying_code":"2330","call_put":"C","strike_price":1293.76,"exercise_style":"American", ...},
    ...
]

```

Parameters

```
underlying_code: 標的商品代碼（必填）
code:            權證代碼，指定單一權證
call_put:        認購／認售 {C, P}
strike_min:      履約價下限
strike_max:      履約價上限
expiry_from:     到期日起（YYYY-MM-DD）
expiry_to:       到期日迄（YYYY-MM-DD）
region:          市場別，預設 TW

```

WarrantInfo

```
code (str):                  商品代碼
name (str):                  權證名稱
underlying_code (str):       標的商品代碼
underlying_type (str):       標的商品類別
call_put (str):              認購／認售 {C 認購, P 認售}
financial (str):             證券別代碼
strike_price (float):        履約價
expiry_date (date):          到期日
last_trading_date (date):    最後交易日
exercise_ratio (float):      行使比例
exercise_style (str):        行使型態 {American 美式, European 歐式}
listing_date (date):         上市日
delisting_date (date):       下市日
exercise_start_date (date):  行使開始日
exercise_end_date (date):    行使截止日
barrier_upper (float):       上限障礙價
barrier_lower (float):       下限障礙價
residual_value (float):      剩餘價值／補償價
settlement_method (str):     履約結算方式
investor_restriction (str):  投資人限制類別
issue_size (int):            發行數量
reference (float):           參考價
limit_up (float):            漲停價
limit_down (float):          跌停價
update_date (date):          資料日期

```

- Python 的 SDK 物件 repr 中，值為 `None` 的欄位會被省略。

提醒

權證不支援 `api.contracts.info()`，請透過 `warrants()` 以標的查詢。

#### 列出所有權證標的

若您不確定有哪些標的發行了權證，可透過 `warrant_underlyings` 列出所有標的：

In

```
api.contracts.warrant_underlyings()

```

Out

```
[
    (Contract(security_type='STK', region='TW', exchange='TSE', code='0050'), '元大台灣50'),
    (Contract(security_type='STK', region='TW', exchange='TSE', code='0052'), '富邦科技'),
    (Contract(security_type='STK', region='TW', exchange='TSE', code='0056'), '元大高股息'),
    (Contract(security_type='STK', region='TW', exchange='TSE', code='0061'), '元大寶滬深'),
    (Contract(security_type='STK', region='TW', exchange='TSE', code='006205'), '富邦上証'),
    ...
]

```

提醒

回傳的 `Contract` 可以直接傳入上方的 `api.contracts.warrants()`。

以 `GET /api/v1/data/contracts/warrants/underlyings` 查詢。帶 `include_name=true` 時，回傳精簡的標的清單（含名稱與發行檔數）：

In

```
curl "http://localhost:8080/api/v1/data/contracts/warrants/underlyings?include_name=true"

```

Out

```
[
    {"underlying_code":"0050","name":"元大台灣50","warrant_count":443},
    {"underlying_code":"0052","name":"富邦科技","warrant_count":22},
    {"underlying_code":"00631L","name":"元大台灣50正2","warrant_count":310},
    {"underlying_code":"00632R","name":"元大台灣50反1","warrant_count":214},
    ...
]

```

Parameters

```
include_name: 是否帶入標的名稱與發行檔數，預設 false（僅回傳標的代碼等基本欄位）
region:       市場別，預設 TW

```

## 最小跳動單位

期貨與選擇權的最小跳動單位（tick）會隨價格或權利金而變化。`FuturesInfo` / `OptionInfo` 的三個欄位一起描述這個規則：

- **`tick_basis`** — 跳動單位如何決定：
  - `fixed`：整個商品固定一個跳動單位，直接使用 `tick` / `tick_value`。
  - `price`：依價格區間變動（如股票期貨）。
  - `premium`：依權利金區間變動（選擇權）。
- **`tick_rule`** — 當 `tick_basis` 非 `fixed` 時，指向對應的級距規則代碼（如 `tw_txo_premium_band`）；`fixed` 商品此欄為 `None`。

若 `tick_basis` 非 `fixed`，可透過 `tick_bands` 取得完整的級距表：

傳入 `FuturesInfo` / `OptionInfo`：

In

```
c = api.contracts.get("TXO31200G6")
info = api.contracts.info(c)
api.contracts.tick_bands(info)

```

Out

```
[
    {'min': 0.0, 'max': 10.0, 'tick': 0.1},
    {'min': 10.0, 'max': 50.0, 'tick': 0.5},
    {'min': 50.0, 'max': 500.0, 'tick': 1.0},
    {'min': 500.0, 'max': 1000.0, 'tick': 5.0},
    {'min': 1000.0, 'max': None, 'tick': 10.0},
]

```

先查詢商品資訊取得其 `tick_rule`，再以 `GET /api/v1/data/contracts/tick-bands/{rule}` 查詢級距表（`security_type` 為必填）。以台積電期貨為例：

In

```
# 1. 查詢商品資訊，取得 tick_rule
curl "http://localhost:8080/api/v1/data/contracts/CDFR1/info?security_type=FUT"
# 回傳含 "tick_basis":"price", "tick_rule":"tw_stock_fut_price_band"

# 2. 以該 tick_rule 查詢級距表
curl "http://localhost:8080/api/v1/data/contracts/tick-bands/tw_stock_fut_price_band?security_type=FUT"

```

Out

```
{
    "region": "TW",
    "security_type": "FUT",
    "rule": "tw_stock_fut_price_band",
    "basis": "price",
    "bands": [
        {"min":0.0,"max":10.0,"tick":0.01},
        {"min":10.0,"max":50.0,"tick":0.05},
        {"min":50.0,"max":100.0,"tick":0.1},
        {"min":100.0,"max":500.0,"tick":0.5},
        {"min":500.0,"max":2500.0,"tick":1.0},
        {"min":2500.0,"max":null,"tick":5.0}
    ]
}

```

Parameters

```
security_type: 商品類別 {FUT, OPT}（必填）
region:        市場別，預設 TW

```

每個區間代表「價格（或權利金）落在 `min`（含）到 `max`（不含）之間時，最小跳動為 `tick`」。`max` 為 `None` 表示該區間往上無上限。

提醒

`tick_bands()` 僅適用於 `tick_rule` 有值的期貨與選擇權（如股票期貨、選擇權）。對固定跳動商品（`tick_basis='fixed'`、`tick_rule=None`，如指數期貨）呼叫會拋出 `ShioajiValueError`，這類商品直接使用 `tick` 欄位即可。

## 相容性

1.7.0 之前的 `api.Contracts`（大寫 C）寫法在 1.7.0 仍可使用，您現有的程式碼不需修改即可運作。與新版 `api.contracts` 不同的是，舊寫法會直接回傳完整的資訊物件（相當於新版 `get()` + `info()` 的結果）：

In

```
api.Contracts.Stocks["2330"]
api.Contracts.Futures.TXF.TXFR1

```

Out

```
StockInfo(Contract(security_type='STK', region='TW', exchange='TSE', code='2330'), code='2330', name='台積電', ...)
FuturesInfo(Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFR1', target_code='TXFG6'), code='TXFR1', name='臺股期貨 近月', ...)

```

注意

- 舊寫法回傳的物件已改為 1.7.0 的資訊物件（`StockInfo`、`FuturesInfo` 等），不再是先前版本的 `Stock`、`Future`。
- 1.7.0 起指數改用交易所代碼（如加權指數為 `IX0001`），先前版本的指數代碼（如 `001`）已不適用。若您的程式使用舊的指數代碼，請改用交易所代碼。

列出某一類商品的端點，1.5 以 `POST /api/v1/data/contracts` + JSON body 查詢，1.7.0 改為 `GET` + query 參數。查詢單一商品的 `GET /api/v1/data/contracts/{code}` 維持不變。此外，1.7.0 新增了期貨、選擇權、權證等多個查詢端點。以上各端點的用法，見本頁上方各節。
