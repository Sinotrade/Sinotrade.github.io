商品檔將在很多地方被使用，例如下單、訂閱行情...等。

商品檔每日於以下時間更新，請留意下載時機。

商品檔更新資訊

- 07:50 期貨商品檔更新
- 08:00 全市場商品檔更新
- 14:45 期貨夜盤商品檔更新
- 17:15 期貨夜盤商品檔更新

### 取得商品檔

下方提供兩種方法取得商品檔：

**方法 1**

[登入](../../tutor/login)成功後，將開始下載商品檔。但這個下載過程將不會影響其他的操作。若您想了解是否下載完成，可利用`Contracts.status`去得到下載狀態。`contracts_timeout` 設定為10000，它將等待10秒下載商品檔。

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    contracts_timeout=10000,
)

```

**方法 2**

若不想在登入時下載商品檔，將`fetch_contract` 設定為`False`。利用 `fetch_contracts` 下載商品檔

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    fetch_contract=False,
)
api.fetch_contracts(contract_download=True)

```

商品檔由 server 在 `shioaji server start` 啟動時自動完成載入（詳見[登入](../login/)頁面的 server 啟動 log），使用者無須額外操作。

### 商品檔資訊

目前我們所提供台股市場的商品包含：證券、期貨、選擇權以及指數。可從下列方法更詳細得到我們所提供的商品。

Contract

```
security_type (str): 商品類型 {STK, FUT, OPT, IND}
exchange (str): 交易所
code (str): 商品代碼
symbol (str): 符號
name (str): 商品名稱
category (str): 類別
currency (str): 計價幣別
delivery_month (str): 交割月份 (FUT/OPT)
delivery_date (str): 結算日 (FUT/OPT)
strike_price (float): 履約價 (OPT)
option_right (str): 買賣權別 (OPT)
underlying_kind (str): 標的類型 (FUT/OPT)
underlying_code (str): 標的商品代碼 (OPT)
unit (float): 單位
multiplier (int): 契約乘數 (FUT/OPT)
limit_up (float): 漲停價
limit_down (float): 跌停價
reference (float): 參考價
update_date (str): 更新日期
margin_trading_balance (int): 融資餘額 (STK)
short_selling_balance (int): 融券餘額 (STK)
day_trade (str): 可否當沖 {Yes, No, OnlyBuy} (STK)
target_code (str): 對應實際商品代碼，僅連續月（如 TXFR1/R2）才有值 (FUT)

```

- 未使用的欄位為空字串或 0
- Python 的 SDK 物件 repr 中，值為 0 的欄位會被省略

**查詢所有商品檔**

`api.Contracts` 會載入所有商品檔，並依商品類型分組。可用 `list(...)` 逐層列舉分類與商品。

列舉商品檔

```
list(api.Contracts)
# [('Indexs', (OTC, TAIFEX, TSE)), ('Stocks', (OES, OTC, TSE)), ...]

list(api.Contracts.Futures)
# [BRF(...), BTF(...), ...]

list(api.Contracts.Futures.TXF)
# [Future(code='TXFF6', ...), Future(code='TXFG6', ...), ...]

```

查找選擇權

```
txo_options = list(api.Contracts.Options.TXO)
txo_calls = [
    contract
    for contract in txo_options
    if contract.delivery_month == "202606"
    and contract.strike_price == 44000
    and contract.option_right == sj.OptionRight.Call
]
# [Option(code='TXO44000F6', symbol='TXO20260644000C', ...)]

```

請見下方各分類小節（證券 / 期貨 / 選擇權 / 指數）。

**查詢單一商品檔**

透過 `api.Contracts` 的分類存取單一商品檔，回傳對應的 SDK 物件（Stock / Future / Option / Index）。

#### 證券

In

```
api.Contracts.Stocks["2330"]
# 或 api.Contracts.Stocks.TSE.TSE2330

```

Out

```
Stock(
    exchange=<Exchange.TSE: 'TSE'>,
    code='2330',
    symbol='TSE2330',
    name='台積電',
    category='24',
    unit=1000.0,
    limit_up=2440.0,
    limit_down=2000.0,
    reference=2220.0,
    update_date='2026/05/14',
    margin_trading_balance=167,
    day_trade=<DayTrade.Yes: 'Yes'>,
)

```

#### 期貨

In

```
api.Contracts.Futures["TXFR1"]
# 或 api.Contracts.Futures.TXF.TXFR1

```

Out

```
Future(
    code='TXFR1',
    symbol='TXFR1',
    name='臺股期貨近月',
    category='TXF',
    delivery_month='202605',
    delivery_date='2026/05/20',
    underlying_kind='I',
    unit=1.0,
    limit_up=45799.0,
    limit_down=37473.0,
    reference=41636.0,
    update_date='2026/05/15',
    target_code='TXFE6',
)

```

#### 選擇權

In

```
api.Contracts.Options["TXO20260532400C"]

```

Out

```
Option(
    code='TXO32400E6',
    symbol='TXO20260532400C',
    name='臺指選擇權F505月 32400C',
    category='TXO',
    delivery_month='202605',
    delivery_date='2026/05/20',
    strike_price=32400.0,
    option_right=<OptionRight.Call: 'C'>,
    underlying_kind='I',
    unit=1.0,
    limit_up=13400.0,
    limit_down=5060.0,
    reference=9230.0,
    update_date='2026/05/15',
)

```

#### 指數

In

```
api.Contracts.Indexs.TSE["001"]
# 或 api.Contracts.Indexs.TSE.TSE001

```

Out

```
Index(
    exchange=<Exchange.TSE: 'TSE'>,
    code='001',
    symbol='TSE001',
    name='加權指數',
)

```

`shioaji` CLI 沒有查詢商品檔的命令，請使用 Python 或 HTTP API。

使用 `curl` 對 server 發送 GET 請求，取得單一商品檔。

- URL 格式：`/api/v1/data/contracts/{code}?security_type=<TYPE>`
- `{code}`：商品代碼
- `security_type`：商品類型（`STK` / `FUT` / `OPT` / `IND`）

**證券**

In

```
curl "http://localhost:8080/api/v1/data/contracts/2330?security_type=STK"

```

Out

```
{"security_type":"STK","exchange":"TSE","code":"2330","symbol":"TSE2330","name":"台積電","category":"24","currency":"TWD","delivery_month":"","delivery_date":"","strike_price":0.0,"option_right":"","underlying_kind":"","underlying_code":"","unit":1000.0,"multiplier":0,"limit_up":2440.0,"limit_down":2000.0,"reference":2220.0,"update_date":"2026/05/14","margin_trading_balance":167,"short_selling_balance":0,"day_trade":"Yes","target_code":""}

```

**期貨**

In

```
curl "http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT"

```

Out

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202605","delivery_date":"2026/05/20","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":45799.0,"limit_down":37473.0,"reference":41636.0,"update_date":"2026/05/15","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFE6"}

```

**選擇權**

In

```
curl "http://localhost:8080/api/v1/data/contracts/TXO20260532400C?security_type=OPT"

```

Out

```
{"security_type":"OPT","exchange":"TAIFEX","code":"TXO32400E6","symbol":"TXO20260532400C","name":"臺指選擇權F505月 32400C","category":"TXO","currency":"TWD","delivery_month":"202605","delivery_date":"2026/05/20","strike_price":32400.0,"option_right":"C","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":13400.0,"limit_down":5060.0,"reference":9230.0,"update_date":"2026/05/15","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":""}

```

**指數**

In

```
curl "http://localhost:8080/api/v1/data/contracts/001?security_type=IND"

```

Out

```
{"security_type":"IND","exchange":"TSE","code":"001","symbol":"TSE001","name":"加權指數","category":"","currency":"TWD","delivery_month":"","delivery_date":"","strike_price":0.0,"option_right":"","underlying_kind":"","underlying_code":"","unit":0.0,"multiplier":0,"limit_up":0.0,"limit_down":0.0,"reference":0.0,"update_date":"","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":""}

```
