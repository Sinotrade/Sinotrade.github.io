當現貨觸發[注意股、警示股、處置股、管理股](../../market_data/disposition_attention/)等交易異常條件時，需先預收券款。

提醒

- 下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。
- 服務時間為交易日 8:00–14:30。

## 預收款項

reserve_earmarking / earmarking_detail

```
api.reserve_earmarking?

Signature:
    api.reserve_earmarking(
        contract: sj.Stock,
        share: int,
        price: float,
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ReserveEarmarkingResponse], None]] = None,
    ) -> sj.ReserveEarmarkingResponse

api.earmarking_detail?

Signature:
    api.earmarking_detail(
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.EarmarkStocksDetailResponse], None]] = None,
    ) -> sj.EarmarkStocksDetailResponse

```

Parameters

```
reserve_earmarking
    contract: 商品檔（由 api.Contracts.Stocks.* 取得）
    share:    預收股數
    price:    預收價格
    account:  證券帳號
    timeout:  逾時毫秒
    cb:       選填，callback 函式

earmarking_detail
    account:  證券帳號
    timeout:  逾時毫秒
    cb:       選填，callback 函式

```

reserve earmarking / earmarking-detail

```
$ shioaji reserve earmarking --help

Place an earmarking request (預收款項)

Usage: shioaji reserve earmarking [OPTIONS] --code <CODE> --share <SHARE> --price <PRICE>

Options:
      --code <CODE>        Stock code (e.g. 2890)
      --share <SHARE>      Number of shares
      --price <PRICE>      Price per share
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

$ shioaji reserve earmarking-detail --help

Get earmarking detail (預收款項明細)

Usage: shioaji reserve earmarking-detail [OPTIONS]

Options:
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

```

Parameters

```
reserve earmarking
    --code:    商品代碼
    --share:   預收股數
    --price:   預收價格
    --account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

reserve earmarking-detail
    --account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

```

reserve_earmarking / earmarking_detail

```
POST /api/v1/order/reserve_earmarking
Content-Type: application/json

{
  "contract": { "security_type": "STK", "exchange": <Exchange>, "code": <string> },
  "share": <integer>,
  "price": <number>,
  "account": { "broker_id": <string>, "account_id": <string> }
}

POST /api/v1/order/earmarking_detail
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

```

Parameters

```
reserve_earmarking
    contract.exchange: 交易所 {TSE, OTC}
    contract.code:     商品代碼
    share:             預收股數
    price:             預收價格
    account:           證券帳號

earmarking_detail
    account:           證券帳號

```

### 申請預收款項

Order

```
# 商品檔
contract = api.Contracts.Stocks.TSE.TSE1217
# 預收款項內容
share = 1000
price = 9

```

In

```
# 申請預收款項
resp = api.reserve_earmarking(contract, share, price, account=api.stock_account)
resp

```

Out

```
ReserveEarmarkingResponse(
    response=EarmarkingOrderResp(
        contract=Contract(
            security_type='STK',
            exchange='TSE',
            code='1217',
            target_code=''
        ),
        account=StockAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        ),
        share=1000,
        price=9,
        status=true,
        info='OK'
    ),
    error=None
)

```

In

```
shioaji reserve earmarking --code 1217 --share 1000 --price 9 --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract:
  security_type: STK
  exchange: TSE
  code: "1217"
  target_code: ""
account:
  account_type: S
  person_id: YOUR_PERSON_ID
  broker_id: YOUR_BROKER_ID
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""
share: 1000
price: 9
status: true
info: OK

```

In

```
curl -X POST http://localhost:8080/api/v1/order/reserve_earmarking \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {
      "security_type": "STK",
      "exchange": "TSE",
      "code": "1217"
    },
    "share": 1000,
    "price": 9,
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
{"contract":{"security_type":"STK","exchange":"TSE","code":"1217","target_code":""},"account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"share":1000,"price":9.0,"status":true,"info":"OK"}

```

### 查詢預收款項

In

```
resp = api.earmarking_detail(account=api.stock_account)
resp

```

Out

```
EarmarkStocksDetailResponse(
    response=EarmarkStocksDetail(
        stocks=[
            EarmarkStockDetail(
                contract=Contract(
                    security_type='STK',
                    exchange='TSE',
                    code='1217',
                    target_code=''
                ),
                share=1000,
                price=9,
                amount=9020,
                order_datetime='2026-05-20T15:16:28+08:00',
                status=true,
                info='成功'
            )
        ],
        account=StockAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        )
    ),
    error=None
)

```

In

```
shioaji reserve earmarking-detail --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
stocks[1]:
  - contract:
      security_type: STK
      exchange: TSE
      code: "1217"
      target_code: ""
    share: 1000
    price: 9
    amount: 9020
    order_datetime: 2026-05-20T15:16:28+08:00
    status: true
    info: 成功
account:
  account_type: S
  person_id: YOUR_PERSON_ID
  broker_id: YOUR_BROKER_ID
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""

```

In

```
curl -X POST http://localhost:8080/api/v1/order/earmarking_detail \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
{"stocks":[{"contract":{"security_type":"STK","exchange":"TSE","code":"1217","target_code":""},"share":1000,"price":9.0,"amount":9020,"order_datetime":"2026-05-20T15:16:28+08:00","status":true,"info":"成功"}],"account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""}}

```

## 預收股票

reserve_stock / stock_reserve_summary / stock_reserve_detail

```
api.reserve_stock?

Signature:
    api.reserve_stock(
        contract: sj.Stock,
        share: int,
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ReserveStockResponse], None]] = None,
    ) -> sj.ReserveStockResponse

api.stock_reserve_summary?

Signature:
    api.stock_reserve_summary(
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ReserveStocksSummaryResponse], None]] = None,
    ) -> sj.ReserveStocksSummaryResponse

api.stock_reserve_detail?

Signature:
    api.stock_reserve_detail(
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ReserveStocksDetailResponse], None]] = None,
    ) -> sj.ReserveStocksDetailResponse

```

Parameters

```
reserve_stock
    contract: 商品檔（由 api.Contracts.Stocks.* 取得）
    share:    預收股數
    account:  證券帳號
    timeout:  逾時毫秒
    cb:       選填，callback 函式

stock_reserve_summary
    account:  證券帳號
    timeout:  逾時毫秒
    cb:       選填，callback 函式

stock_reserve_detail
    account:  證券帳號
    timeout:  逾時毫秒
    cb:       選填，callback 函式

```

reserve stock / summary / detail

```
$ shioaji reserve stock --help

Place a stock reserve request (預收股票)

Usage: shioaji reserve stock [OPTIONS] --code <CODE> --share <SHARE>

Options:
      --code <CODE>        Stock code (e.g. 2890)
      --share <SHARE>      Number of shares to reserve
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

$ shioaji reserve summary --help

Get stock reserve summary (預收券款摘要)

Usage: shioaji reserve summary [OPTIONS]

Options:
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

$ shioaji reserve detail --help

Get stock reserve detail (預收券款明細)

Usage: shioaji reserve detail [OPTIONS]

Options:
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

```

Parameters

```
reserve stock
    --code:    商品代碼
    --share:   預收股數
    --account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

reserve summary
    --account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

reserve detail
    --account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

```

reserve_stock / stock_reserve_summary / stock_reserve_detail

```
POST /api/v1/order/reserve_stock
Content-Type: application/json

{
  "contract": { "security_type": "STK", "exchange": <Exchange>, "code": <string> },
  "share": <integer>,
  "account": { "broker_id": <string>, "account_id": <string> }
}

POST /api/v1/order/stock_reserve_summary
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

POST /api/v1/order/stock_reserve_detail
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

```

Parameters

```
reserve_stock
    contract.exchange: 交易所 {TSE, OTC}
    contract.code:     商品代碼
    share:             預收股數
    account:           證券帳號

stock_reserve_summary
    account:           證券帳號

stock_reserve_detail
    account:           證券帳號

```

### 申請預收股票

Order

```
# 商品檔
contract = api.Contracts.Stocks.TSE.TSE1217
# 預收股數
share = 1000

```

In

```
# 申請預收股票
resp = api.reserve_stock(contract, share, account=api.stock_account)
resp

```

Out

```
ReserveStockResponse(
    response=ReserveOrderResp(
        contract=Contract(
            security_type='STK',
            exchange='TSE',
            code='1217',
            target_code=''
        ),
        account=StockAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        ),
        share=1000,
        status=true,
        info=''
    ),
    error=None
)

```

In

```
shioaji reserve stock --code 1217 --share 1000 --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract:
  security_type: STK
  exchange: TSE
  code: "1217"
  target_code: ""
account:
  account_type: S
  person_id: YOUR_PERSON_ID
  broker_id: YOUR_BROKER_ID
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""
share: 1000
status: true
info: ""

```

In

```
curl -X POST http://localhost:8080/api/v1/order/reserve_stock \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {
      "security_type": "STK",
      "exchange": "TSE",
      "code": "1217"
    },
    "share": 1000,
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
{"contract":{"security_type":"STK","exchange":"TSE","code":"1217","target_code":""},"account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"share":1000,"status":true,"info":""}

```

### 查詢預收股票狀態

In

```
resp = api.stock_reserve_summary(account=api.stock_account)
resp

```

Out

```
ReserveStocksSummaryResponse(
    response=ReserveStocksSummary(
        stocks=[
            ReserveStockSummary(
                contract=Contract(
                    security_type='STK',
                    exchange='TSE',
                    code='2890',
                    target_code=''
                ),
                available_share=5000,
                reserved_share=0
            )
        ],
        account=StockAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        )
    ),
    error=None
)

```

In

```
shioaji reserve summary --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
stocks[1]:
  - contract:
      security_type: STK
      exchange: TSE
      code: "2890"
      target_code: ""
    available_share: 5000
    reserved_share: 0
account:
  account_type: S
  person_id: YOUR_PERSON_ID
  broker_id: YOUR_BROKER_ID
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""

```

In

```
curl -X POST http://localhost:8080/api/v1/order/stock_reserve_summary \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
{"stocks":[{"contract":{"security_type":"STK","exchange":"TSE","code":"2890","target_code":""},"available_share":5000,"reserved_share":0}],"account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""}}

```

### 查詢預收股票明細

In

```
resp = api.stock_reserve_detail(account=api.stock_account)
resp

```

Out

```
ReserveStocksDetailResponse(
    response=ReserveStocksDetail(
        stocks=[
            ReserveStockDetail(
                contract=Contract(
                    security_type='STK',
                    exchange='TSE',
                    code='6153',
                    target_code=''
                ),
                share=1000,
                order_datetime='2026-05-20T15:16:28+08:00',
                status=true,
                info='已完成'
            )
        ],
        account=StockAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        )
    ),
    error=None
)

```

In

```
shioaji reserve detail --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
stocks[1]:
  - contract:
      security_type: STK
      exchange: TSE
      code: "6153"
      target_code: ""
    share: 1000
    order_datetime: 2026-05-20T15:16:28+08:00
    status: true
    info: 已完成
account:
  account_type: S
  person_id: YOUR_PERSON_ID
  broker_id: YOUR_BROKER_ID
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""

```

In

```
curl -X POST http://localhost:8080/api/v1/order/stock_reserve_detail \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
{"stocks":[{"contract":{"security_type":"STK","exchange":"TSE","code":"6153","target_code":""},"share":1000,"order_datetime":"2026-05-20T15:16:28+08:00","status":true,"info":"已完成"}],"account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""}}

```

### 應用範例

查詢所有名下證券帳號的圈券狀態，將可圈額度全數申請預收股票。

In

```
import shioaji as sj

api = sj.Shioaji()
accounts = api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
)
api.activate_ca(
    ca_path="your/ca/path/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="YOUR_PERSON_ID",
)

for account in accounts:
    if account.account_type == sj.AccountType.Stock:
        summary = api.stock_reserve_summary(account=account)
        for s in summary.stocks:
            if s.available_share:
                api.reserve_stock(
                    s.contract,
                    s.available_share,
                    account=account,
                )

```
