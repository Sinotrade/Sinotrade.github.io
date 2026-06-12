When holding stocks triggers transaction abnormalities such as being flagged as a [notice, warning, disposition, or management stock](../../market_data/disposition_attention/), the broker requires you to reserve shares or earmark funds in advance.

Reminder

- Before placing orders, you must first [log in](../../login/) and [activate your CA](../../prepare/terms/).
- Service hours are 8:00–14:30 on trading days.

## Earmarking

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
    contract: Contract object (from api.Contracts.Stocks.*)
    share:    Earmark share count
    price:    Earmark price
    account:  Stock account
    timeout:  Timeout in milliseconds
    cb:       Optional callback function

earmarking_detail
    account:  Stock account
    timeout:  Timeout in milliseconds
    cb:       Optional callback function

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
    --code:    security code
    --share:   earmark share count
    --price:   earmark price
    --account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default stock account

reserve earmarking-detail
    --account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default stock account

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
    contract.exchange: Exchange {TSE, OTC}
    contract.code:     Security code
    share:             Earmark share count
    price:             Earmark price
    account:           Stock account

earmarking_detail
    account:           Stock account

```

### Apply Earmarking

Order

```
# Contract
contract = api.Contracts.Stocks.TSE.TSE1217
# Earmark details
share = 1000
price = 9

```

In

```
# Apply earmarking
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

### Get Earmarking Detail

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
                info='Success'
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

## Reserve Stock

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
    contract: Contract object (from api.Contracts.Stocks.*)
    share:    Reserve share count
    account:  Stock account
    timeout:  Timeout in milliseconds
    cb:       Optional callback function

stock_reserve_summary
    account:  Stock account
    timeout:  Timeout in milliseconds
    cb:       Optional callback function

stock_reserve_detail
    account:  Stock account
    timeout:  Timeout in milliseconds
    cb:       Optional callback function

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
    --code:    security code
    --share:   reserve share count
    --account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default stock account

reserve summary
    --account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default stock account

reserve detail
    --account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default stock account

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
    contract.exchange: Exchange {TSE, OTC}
    contract.code:     Security code
    share:             Reserve share count
    account:           Stock account

stock_reserve_summary
    account:           Stock account

stock_reserve_detail
    account:           Stock account

```

### Apply Reserve Stock

Order

```
# Contract
contract = api.Contracts.Stocks.TSE.TSE1217
# Reserve share count
share = 1000

```

In

```
# Apply reserve stock
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

### Get Reserve Stock Summary

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

### Get Reserve Stock Detail

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
                info='Completed'
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

### Example

Query the reserve summary across all stock accounts under your name and apply reserve stock for the full available share.

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
