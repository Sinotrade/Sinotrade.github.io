Contract objects are used in many places, such as placing orders and subscribing to quotes.

Contracts are updated daily at the following times:

Contract update schedule

- 07:50 Futures contract update
- 08:00 Full-market contract update
- 14:45 Futures night-session contract update
- 17:15 Futures night-session contract update

## Load Contracts

Since 1.7.0, the way contracts are loaded and coded has a few adjustments:

- **No more managing contract updates yourself**: previously you had to remember when contracts were refreshed and log in only after the update to get the latest ones — a particular hassle for futures night-session traders. From 1.7.0, contracts stay up to date automatically, so you no longer need to worry about update timing.
- **Faster login**: login no longer downloads the full contract set; instead, each security type is loaded automatically the first time you query it (for example, querying a stock loads stocks), so you can start working without waiting for the full set to download.
- **Only what you use is loaded**: if you only trade stocks, futures and options contracts are never downloaded, saving bandwidth and resources.
- **Standardized index codes**: indices now use their exchange codes (for example, the TAIEX is `IX0001`), consistent with the exchange and more standard.

You no longer need to configure download arguments or check the download status — just log in and query.

Contracts are loaded automatically by the server when `shioaji server start` is executed (see the server startup log on the [Login](../login/) page). No additional action is required.

## Get Contracts

When you query a product, `get()` returns a **contract object (`Contract`)**, which contains the fields needed to identify a product (security type, exchange, code) — enough for placing orders and subscribing to quotes. If you need the product name, limit-up/down prices, and other full details, see [Get Contract Details](#contract-details).

### Query a Single Contract

When you already know the product code (for example, TSMC `2330`), query a single contract directly via `get`. Stocks, futures, and indices all use the same method — you do not need to know the security type in advance.

In

```
api.contracts.get("2330")     # stock
api.contracts.get("TXFR1")    # futures
api.contracts.get("IX0001")   # index
api.contracts.get("XXXX")     # non-existent code

```

Out

```
Contract(security_type='STK', region='TW', exchange='TSE', code='2330')
Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFR1', target_code='TXFG6')
Contract(security_type='IND', region='TW', exchange='TSE', code='IX0001')
None

```

Reminder

`None` is returned when the code is not found.

In

```
curl "http://localhost:8080/api/v1/data/contracts/2330?security_type=STK"

```

Out

```
{"security_type":"STK","region":"TW","exchange":"TSE","code":"2330","target_code":null}

```

Parameters

```
security_type: security type (optional). When given, looks up only within that type; otherwise resolved automatically.
region:        market region, defaults to TW

```

Contract

```
security_type (str):   security type {STK, IND, FUT, OPT, WRT}
region (str):          market region
exchange (str):        exchange
code (str):            product code
target_code (str):     resolved target code; only continuous-month futures (e.g. TXFR1/R2) carry a value

```

### List Contracts by Security Type

The queries above all require you to know the product code. If you want to browse the whole market, or you are not sure of the code, list every contract of a security type via `list` and filter from there:

Use `api.contracts.list(security_type)`:

In

```
api.contracts.list(sj.SecurityType.Stock)     # stocks
api.contracts.list(sj.SecurityType.Futures)   # futures
api.contracts.list(sj.SecurityType.Option)    # options
api.contracts.list(sj.SecurityType.Index)     # indices
api.contracts.list(sj.SecurityType.Warrant)   # warrants

```

Out

```
[Contract(security_type='STK', region='TW', exchange='TSE', code='00400A'), Contract(security_type='STK', region='TW', exchange='TSE', code='00401A'), ...]
[Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='BRFI6'), Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='BRFR1', target_code='BRFI6'), ...]
[Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TGO14900H6'), Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TGO14900T6'), ...]
[Contract(security_type='IND', region='TW', exchange='OTC', code='EMP88'), Contract(security_type='IND', region='TW', exchange='OTC', code='GTCI'), ...]
[Contract(security_type='WRT', region='TW', exchange='TSE', code='03007T'), Contract(security_type='WRT', region='TW', exchange='TSE', code='030103'), ...]

```

Query with `GET /api/v1/data/contracts`; results are paginated with `page` / `page_size`:

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
security_type: security type {STK, FUT, OPT, IND, WRT} (required)
region:        market region, defaults to TW
page:          page number, starting from 1; defaults to 1 when omitted
page_size:     items per page, defaults to 1000

```

When both `page` and `page_size` are omitted, all contracts are returned at once (no pagination); passing either one enters paginated mode.

## Contracts by Security Type

Stocks, futures, options, indices, and warrants are offered for the Taiwan market. Each security type's query methods and fields are described below.

### Get Contract Details

If you need the product name, limit-up/limit-down prices, trading unit, and other full details, get the product's **contract info object** via `info()`:

Pass the contract object (`Contract`) to `api.contracts.info()`:

In

```
c = api.contracts.get("2330")
api.contracts.info(c)

```

Out

```
StockInfo(Contract(security_type='STK', region='TW', exchange='TSE', code='2330'), code='2330', name='台積電', category='24', currency=<Currency.TWD: 'TWD'>, unit=1000.0, day_trade=<DayTrade.Yes: 'Yes'>, reference=2440.0, limit_up=2680.0, limit_down=2200.0, margin_trading_balance=0, short_selling_balance=99, trading_suspended=False, margin_loan_ratio=0.6, margin_quota_lots=0, short_margin_ratio=0.9, short_quota_lots=99, margin_shortable=True, sbl_shortable=True, below_ref_shortable=True, disposition_level=0, attention_flag=False, etf_constituent=True, settlement_type='0', update_date=datetime.date(2026, 7, 16))

```

Depending on the security type, `info()` returns the corresponding contract info object (`StockInfo`, `FuturesInfo`, `OptionInfo`, `IndexInfo`, `WarrantInfo`); the fields of each are described in the sections below.

Reminder

Placing orders and subscribing to quotes only need the contract object (`Contract`) returned by `get()`; calling `info()` is not required.

Get the full info with `GET /api/v1/data/contracts/{code}/info`:

In

```
curl "http://localhost:8080/api/v1/data/contracts/2330/info"

```

Out

```
{"security_type":"STK","region":"TW","exchange":"TSE","code":"2330","target_code":null,"name":"台積電","category":"24","currency":"TWD","unit":1000.0,"day_trade":"Yes","reference":2440.0,"limit_up":2680.0,"limit_down":2200.0,"margin_trading_balance":0,"short_selling_balance":99,"trading_suspended":false,"margin_loan_ratio":0.6,"margin_quota_lots":0,"short_margin_ratio":0.9,"short_quota_lots":99,"margin_shortable":true,"sbl_shortable":true,"below_ref_shortable":true,"disposition_level":0,"attention_flag":false,"etf_constituent":true,"settlement_type":"0","disposition_match_interval_min":null,"disposition_max_lots_single_order":null,"disposition_max_lots_total_orders":null,"disposition_prepay_ratio":null,"update_date":"2026-07-16"}

```

Parameters

```
security_type: security type (optional). When given, looks up only within that type; otherwise resolved automatically.
region:        market region, defaults to TW

```

### Stocks

Query by stock code, then get the details:

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
    margin_shortable=True,
    sbl_shortable=True,
    below_ref_shortable=True,
    disposition_level=0,
    attention_flag=False,
    etf_constituent=True,
    settlement_type='0',
    update_date=datetime.date(2026, 7, 16),
)

```

StockInfo

```
code (str):                                product code
name (str):                                product name
category (str):                            industry category
currency (Currency):                       trading currency
unit (float):                              trading unit
day_trade (DayTrade):                      day trade eligibility {Yes, OnlyBuy, No}
reference (float):                         reference price
limit_up (float):                          limit-up price
limit_down (float):                        limit-down price
margin_trading_balance (int):              margin trading balance
short_selling_balance (int):               short selling balance
trading_suspended (bool):                  trading suspended
margin_loan_ratio (float):                 margin loan ratio
margin_quota_lots (int):                   margin quota (lots)
short_margin_ratio (float):                short selling margin ratio
short_quota_lots (int):                    short selling quota (lots)
margin_shortable (bool):                   margin short selling allowed
sbl_shortable (bool):                      SBL short selling allowed
below_ref_shortable (bool):                short selling below reference price allowed
disposition_level (int):                   disposition level (0 when not under disposition)
attention_flag (bool):                     attention stock
etf_constituent (bool):                    ETF constituent
settlement_type (str):                     settlement type
disposition_match_interval_min (int):      disposition matching interval (minutes)
disposition_max_lots_single_order (int):   disposition max lots per order
disposition_max_lots_total_orders (int):   disposition max lots across orders
disposition_prepay_ratio (float):          disposition prepayment ratio
update_date (date):                        data date

```

- In the Python SDK object repr, fields whose value is `None` are omitted.

### Futures

Query by futures code, then get the details:

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
code (str):                  product code
name (str):                  product name
root (str):                  product root
delivery_month (str):        delivery month
delivery_date (date):        expiry / settlement date
last_trading_date (date):    last trading date
begin_date (date):           first trading date
underlying_kind (str):       underlying kind {S stock, I index, E FX, C commodity}
underlying_code (str):       underlying code
multiplier (float):          contract multiplier
contract_size (float):       contract size
size_unit (str):             contract size unit
quote_ccy (str):             quote currency
tick_basis (str):            tick basis {fixed, price, premium}
tick_rule (str):             tick rule code
tick (float):                minimum tick
tick_value (float):          value per tick
spec_kind (str):             contract spec kind
decimal_locator (int):       price decimal places
dynamic_banding (bool):      dynamic price banding
flow_group (str):            flow control group
reference (float):           reference price
limit_up (float):            tier-1 upper limit
limit_down (float):          tier-1 lower limit
limit_up_2 (float):          tier-2 upper limit
limit_down_2 (float):        tier-2 lower limit
limit_up_3 (float):          tier-3 upper limit
limit_down_3 (float):        tier-3 lower limit
update_date (date):          data date

```

- In the Python SDK object repr, fields whose value is `None` are omitted.

spec_kind — contract spec kind

- `index_fut`: index futures
- `stock_fut`: single-stock futures
- `etf_fut`: ETF futures
- `commodity`: commodity futures
- `fx`: FX futures
- `unknown`: spec mapping not yet complete

#### List All Futures Products

If you are not sure which futures products exist, list every futures product code and name via `futures_roots`:

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

#### List All Contracts of a Product

Once you know the futures product code, get every contract under that product via `futures`:

Call `api.contracts.futures(root)` with the product code:

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

Reminder

Besides the individual month contracts (e.g. `TXFH6`), the result also includes continuous-month contracts (`TXFR1` front month, `TXFR2` next month), whose `target_code` points to the currently resolved contract.

Query with `GET /api/v1/data/contracts/futures?root={root}`:

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
root:            product code (e.g. TXF)
underlying_code: underlying code (e.g. 2330, IX0001), to look up futures by underlying
delivery_month:  delivery month (e.g. 202608), to filter a specific month
region:          market region, defaults to TW

```

`root` and `underlying_code` cannot be used together; pass only one.

#### List All Futures of an Underlying

To find out which futures exist for a stock or an index, look them up by underlying via `futures_by_underlying`.

Call `api.contracts.futures_by_underlying(contract)` with the underlying's `Contract`.

For TSMC, this returns the single-stock futures:

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

For the TAIEX, this returns the index futures:

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

Reminder

One underlying may map to several futures products. TSMC has TSMC futures (`CDF`) and mini TSMC futures (`QFF`); the TAIEX has TAIEX futures (`TXF`), mini TAIEX futures (`MXF`, `MX4`), and micro TAIEX futures (`TMF`). The result covers every contract of every such product.

Look up futures by underlying with `GET /api/v1/data/contracts/futures?underlying_code={code}`.

For TSMC, this returns the single-stock futures:

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

For the TAIEX, this returns the index futures:

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

### Options

Query by option code, then get the details:

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
code (str):                     product code
name (str):                     product name
root (str):                     product root
delivery_month (str):           delivery month
delivery_date (date):           expiry / settlement date
last_trading_date (date):       last trading date
begin_date (date):              first trading date
strike_price (float):           strike price
option_right (OptionRight):     call or put {Call, Put}
expiry_weekday (str):           expiry weekday
week_of_month (int):            week of month within the delivery month
underlying_kind (str):          underlying kind {S stock, I index, E FX, C commodity}
underlying_code (str):          underlying code
multiplier (float):             contract multiplier
contract_size (float):          contract size
size_unit (str):                contract size unit
quote_ccy (str):                quote currency
tick_basis (str):               tick basis {fixed, price, premium}
tick_rule (str):                tick rule code
tick (float):                   minimum tick
tick_value (float):             value per tick
spec_kind (str):                contract spec kind
decimal_locator (int):          price decimal places
strike_decimal_locator (int):   strike price decimal places
dynamic_banding (bool):         dynamic price banding
flow_group (str):               flow control group
reference (float):              reference price
limit_up (float):               tier-1 upper limit
limit_down (float):             tier-1 lower limit
limit_up_2 (float):             tier-2 upper limit
limit_down_2 (float):           tier-2 lower limit
limit_up_3 (float):             tier-3 upper limit
limit_down_3 (float):           tier-3 lower limit
update_date (date):             data date

```

- In the Python SDK object repr, fields whose value is `None` are omitted.

spec_kind — contract spec kind

- `index_opt`: index options
- `stock_opt`: single-stock options
- `etf_opt`: ETF options
- `commodity_opt`: commodity options
- `unknown`: spec mapping not yet complete

#### List All Option Products

If you are not sure which option products exist, list every option product code and name via `option_roots`:

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

#### List All Contracts of a Product

Once you know the option product code, get every contract under that product via `options`:

Call `api.contracts.options(root)` with the product code:

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

Query with `GET /api/v1/data/contracts/options?root={root}`. Since a single product has a large number of contracts, you can filter with `delivery_month`, `option_right`, `strike_min` / `strike_max`, and more:

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
root:           option product code (required)
delivery_month: delivery month (e.g. 202609), to filter a specific month
option_right:   call or put {C, P}
strike_min:     strike price lower bound
strike_max:     strike price upper bound
expiry_weekday: expiry weekday (e.g. Wed, to filter weekly options)
region:         market region, defaults to TW

```

### Indices

Query by index code, then get the details:

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
code (str):          product code
name (str):          index name
reference (float):   reference index value
open_time (str):     quote start time
close_time (str):    quote end time
update_date (date):  data date

```

- In the Python SDK object repr, fields whose value is `None` are omitted.

### Warrants

Warrants are grouped by underlying. Get every warrant issued on a stock or index via `warrants`. For TSMC:

Call `api.contracts.warrants(underlying)` with the underlying's `Contract`:

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

Take one of them to see the full details of that warrant:

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

Query with `GET /api/v1/data/contracts/warrants?underlying_code={code}`. Since the number of warrants is large, you can filter with `call_put`, `strike_min` / `strike_max`, `expiry_from` / `expiry_to`, and more:

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
underlying_code: underlying product code (required)
code:            warrant code, to specify a single warrant
call_put:        call or put {C, P}
strike_min:      strike price lower bound
strike_max:      strike price upper bound
expiry_from:     expiry date from (YYYY-MM-DD)
expiry_to:       expiry date to (YYYY-MM-DD)
region:          market region, defaults to TW

```

WarrantInfo

```
code (str):                  product code
name (str):                  warrant name
underlying_code (str):       underlying code
underlying_type (str):       underlying type
call_put (str):              call / put {C call, P put}
financial (str):             security type code
strike_price (float):        strike price
expiry_date (date):          expiry date
last_trading_date (date):    last trading date
exercise_ratio (float):      exercise ratio
exercise_style (str):        exercise style {American, European}
listing_date (date):         listing date
delisting_date (date):       delisting date
exercise_start_date (date):  exercise start date
exercise_end_date (date):    exercise end date
barrier_upper (float):       upper barrier price
barrier_lower (float):       lower barrier price
residual_value (float):      residual / compensation value
settlement_method (str):     settlement method
investor_restriction (str):  investor restriction type
issue_size (int):            issue size
reference (float):           reference price
limit_up (float):            limit-up price
limit_down (float):          limit-down price
update_date (date):          data date

```

- In the Python SDK object repr, fields whose value is `None` are omitted.

Reminder

Warrants do not support `api.contracts.info()`; query them via `warrants()` from the underlying.

#### List All Warrant Underlyings

If you are not sure which underlyings have warrants issued, list them via `warrant_underlyings`:

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

Reminder

The returned contract object (`Contract`) can be passed straight to `api.contracts.warrants()` above.

Query with `GET /api/v1/data/contracts/warrants/underlyings`. With `include_name=true`, a compact underlying list is returned (with names and warrant counts):

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
include_name: whether to include the underlying name and warrant count, defaults to false (returns only the underlying code and basic fields)
region:       market region, defaults to TW

```

## Combo Contracts

TAIFEX offers **combination orders**, which bundle two futures/options contracts into a single order traded as one, such as futures time spreads and option straddles; see the TAIFEX [order types introduction](https://www.taifex.com.tw/cht/4/oamIntroduction) for the definitions and rules of each type. In Shioaji the combination to trade is represented by a **combo contract (`ComboContract`)**; the same contract works for both [combo orders](../order/Combo/) and [combo market data](../market_data/streaming/combo/) (streaming, snapshots, historical data).

Put the two products' contract objects (`Contract`) into `legs` of `api.contracts.combo()` to build a combo contract; the products you pick and their order inside `legs` determine the **combo type**, with the order defined by TAIFEX and not reversible:

| Target type | `sj.ComboType` | Pick two products | Order `legs=[first, second]` | `combo_type` | | --- | --- | --- | --- | --- | | **Futures** | | | | | | Time spread | `TimeSpread` | Same product, different delivery months | `[near, far]` | auto-derived | | Weekly time spread | `WeeklyTimeSpread` | Same family, at least one weekly contract | `[near expiry, far expiry]` | auto-derived | | **Options** | | | | | | Time spread | `TimeSpread` | Same product, strike, and right; different expiries | `[near expiry, far expiry]` | auto-derived | | Call spread | `PriceSpread` | Two Calls, same expiry, different strikes | `[higher strike, lower strike]` | auto-derived | | Put spread | `PriceSpread` | Two Puts, same expiry, different strikes | `[lower strike, higher strike]` | auto-derived | | Straddle | `Straddle` | Call and Put, same expiry and strike | `[Call, Put]` | **required** | | Strangle | `Strangle` | Call and Put, same expiry, different strikes | `[Call, Put]` | auto-derived | | Conversion/Reversal | `ConversionReversal` | Call and Put, same expiry and strike | `[Call, Put]` | **required** |

Why Straddle and Conversion/Reversal require combo_type

Their component products are identical, but on TAIFEX they are two different combo products: the direction expansion differs (Straddle `Buy` = buy Call and buy Put; Conversion = sell Call, buy Put) and so does the net-price definition (Call+Put vs Put−Call). It cannot be inferred from the components, so omitting it raises `sj.ShioajiValueError`. Other types are auto-derived; an explicit value must match the components.

A built contract carries **no buy/sell direction**; whether you buy or sell the combo is decided at order time by `ComboOrder.action` — see [Combo Orders](../order/Combo/).

contracts.combo

```
api.contracts.combo?

Signature:
    api.contracts.combo(
        legs: List[sj.BaseContract],
        combo_type: Optional[sj.ComboType] = None,
    ) -> sj.ComboContract

```

Parameters

```
legs:       Two products' contract objects (from api.contracts.get()); order per the table above.
            Must be concrete delivery months — TXFR1/R2 continuous contracts are not accepted
combo_type: Optional combo type; most shapes are auto-derived, see the table above

```

sj.ComboContract

```
legs (List[BaseContract]):  Component products
combo_type (ComboType):     Combo type
region (str):               Market region
code (str):                 Exchange-native combo code (e.g. TXFH6/I6), identical to the
                            code in market-data callbacks; generated by Shioaji — never
                            hand-build the slash code as input. Not available for option combos
managed (bool):             Whether the contract was built by contracts.combo()

```

contracts/combo

```
POST /api/v1/data/contracts/combo
Content-Type: application/json

{
  "legs": [
    {
      "security_type": <SecurityType>,
      "exchange": <Exchange>,
      "code": <string>
    }
  ],
  "combo_type": <ComboType, optional>
}

```

Parameters

```
legs[].security_type: Security type {FUT, OPT}
legs[].exchange:      Exchange
legs[].code:          Product code; R1/R2 continuous contracts are not accepted,
                      and legs must not carry an action (400 if present)
combo_type:           Optional combo type; auto-derived when omitted

```

### Example

Futures (time spread):

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(
    legs=[near, far],
)
combo_contract

```

Out

```
ComboContract(
    legs=[
        Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFH6'),
        Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFI6')
    ],
    combo_type=TimeSpread
)

```

Options (straddle):

In

```
call = api.contracts.get("TXO34000I6")
put = api.contracts.get("TXO34000U6")
straddle_contract = api.contracts.combo(
    legs=[call, put],
    combo_type=sj.ComboType.Straddle,
)
straddle_contract

```

Out

```
ComboContract(
    legs=[
        Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000I6'),
        Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000U6')
    ],
    combo_type=Straddle
)

```

Invalid combos

A wrong leg order, or omitting a required `combo_type`, raises `sj.ShioajiValueError` (a subclass of Python's `ValueError`) at build time, e.g.:

```
contracts: validation: combo legs are reversed for TimeSpread; expected canonical exchange order
contracts: validation: combo shape is ambiguous ([Straddle, ConversionReversal]); pass combo_type explicitly

```

In

```
curl -X POST http://localhost:8080/api/v1/data/contracts/combo \
  -H 'Content-Type: application/json' \
  -d '{
    "legs": [
      {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
      {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
    ]
  }'

```

Out

```
{"code":"TXFH6/I6","legs":[{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFH6","target_code":null},{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFI6","target_code":null}],"region":"TW","exchange":"TAIFEX","combo_type":"TimeSpread","managed":true}

```

### Listing Futures Combos

Not sure which pair to build? `combo_futures` lists every currently valid time-spread combo of a futures family, ready to use with no ordering work. Futures time spreads only; build option combos with `contracts.combo()`.

contracts.combo_futures

```
api.contracts.combo_futures?

Signature:
    api.contracts.combo_futures(
        root: str,
        region: sj.Region = sj.Region.TW,
    ) -> List[sj.ComboContract]

```

Parameters

```
root:   Futures product family (e.g. TXF)
region: Market region, default Taiwan

```

In

```
combos = api.contracts.combo_futures(root="TXF")
[c.code for c in combos]

```

Out

```
['TXFH6/I6',
 'TXFH6/J6',
 'TXFH6/L6',
 'TXFH6/C7',
 'TXFH6/F7',
 'TXFI6/J6',
 'TXFI6/L6',
 'TXFI6/C7',
 'TXFI6/F7',
 'TXFJ6/L6',
 'TXFJ6/C7',
 'TXFJ6/F7',
 'TXFL6/C7',
 'TXFL6/F7',
 'TXFC7/F7']

```

The list is computed from local contract data (expired contracts excluded). It does not guarantee live orders exist for every pair — check quotes for actual markets.

contracts/combo/futures

```
GET /api/v1/data/contracts/combo/futures?root=<string>

```

Parameters

```
root: Futures product family (e.g. TXF)

```

In

```
curl 'http://localhost:8080/api/v1/data/contracts/combo/futures?root=TXF'

```

Out

```
[{"code":"TXFH6/I6","legs":[{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFH6","target_code":null},{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFI6","target_code":null}],"region":"TW","exchange":"TAIFEX","combo_type":"TimeSpread","managed":true},{"code":"TXFH6/J6","legs":[...],"region":"TW","exchange":"TAIFEX","combo_type":"TimeSpread","managed":true},...]

```

## Tick Bands

The minimum tick of futures and options varies with price or premium. Three fields on `FuturesInfo` / `OptionInfo` describe this together:

- **`tick_basis`** — how the tick is determined:
  - `fixed`: one tick for the whole product; use `tick` / `tick_value` directly.
  - `price`: varies by price band (e.g. single-stock futures).
  - `premium`: varies by premium band (options).
- **`tick_rule`** — when `tick_basis` is not `fixed`, the tick-rule code to apply (e.g. `tw_txo_premium_band`); `None` for fixed-tick products.

When `tick_basis` is not `fixed`, get the full band table via `tick_bands`:

Pass a `FuturesInfo` / `OptionInfo`:

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

Query the contract info first to obtain its `tick_rule`, then query the band table with `GET /api/v1/data/contracts/tick-bands/{rule}` (`security_type` is required). Using TSMC futures as an example:

In

```
# 1. Query the contract info to get tick_rule
curl "http://localhost:8080/api/v1/data/contracts/CDFR1/info?security_type=FUT"
# response contains "tick_basis":"price", "tick_rule":"tw_stock_fut_price_band"

# 2. Query the band table with that tick_rule
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
security_type: security type {FUT, OPT} (required)
region:        market region, defaults to TW

```

Each band means "when the price (or premium) is between `min` (inclusive) and `max` (exclusive), the minimum tick is `tick`." A `max` of `None` means the band has no upper bound.

Reminder

`tick_bands()` only applies to futures and options with a non-null `tick_rule` (e.g. single-stock futures, options). Calling it on a fixed-tick product (`tick_basis='fixed'`, `tick_rule=None`, e.g. index futures) raises `ShioajiValueError`; use the `tick` field directly for those.

## Compatibility

The pre-1.7.0 `api.Contracts` (capital C) access style still works in 1.7.0; your existing code runs without changes. Unlike the new `api.contracts`, the legacy style returns the full contract info object directly (equivalent to the new `get()` + `info()`):

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

Note

- The objects returned by the legacy style are now the 1.7.0 contract info objects (`StockInfo`, `FuturesInfo`, etc.), no longer the pre-1.7.0 `Stock` / `Future`.
- Since 1.7.0, indices use their exchange codes (for example, the TAIEX is `IX0001`); the pre-1.7.0 index codes (such as `001`) no longer apply. If your code uses the old index codes, switch to the exchange codes.

The endpoint for listing contracts of a security type was `POST /api/v1/data/contracts` with a JSON body in 1.5; 1.7.0 changes it to `GET` + query parameters. Looking up a single contract with `GET /api/v1/data/contracts/{code}` is unchanged. In addition, 1.7.0 adds several new query endpoints for futures, options, warrants, and more. See the sections earlier on this page for how to use each endpoint.
