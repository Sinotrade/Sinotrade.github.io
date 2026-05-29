Restricted by Taiwan's financial regulations, new users need to sign relevant documents and complete a test report in the simulation mode before using it in a production environment.

Open Account

You must have a [SinoPac account](https://www.sinotrade.com.tw/openact?utm_campaign=OP_inchannel&utm_source=newweb&utm_medium=button_top&strProd=0037&strWeb=0035) before starting.

## API Signing

Please refer to the [Sign Center](https://www.sinotrade.com.tw/newweb/signCenter/signCenterIndex/) and **read the documents carefully** before you sign.

Note

Stock and futures must be signed separately. Please complete the ones you use.

## API Test

To ensure you fully understand how to use Shioaji, you need to complete the test in simulation mode, which includes:

- Login test `login`
- Order test `place_order`

Attention

Service Hour:

- For company security policy, the test service runs Monday to Friday 08:00 ~ 20:00
- 18:00 ~ 20:00: Taiwan IP only
- 08:00 ~ 18:00: No restriction

Version Restriction:

- version >= 1.2

Others:

- The API document signing must be earlier than the API test time for review to pass
- Stock and Futures accounts must be tested separately
- The interval between stock / futures order tests must be at least 1 second for the system to record

### Version Check

```
import shioaji as sj
print(sj.__version__)

```

```
shioaji server check

```

```
curl http://localhost:8080/api/v1/info

```

### Login Test

Login

```
api = sj.Shioaji(simulation=True)  # Simulation Mode
accounts = api.login(
    api_key="YOUR_API_KEY",         # edit it
    secret_key="YOUR_SECRET_KEY"    # edit it
)

# Verify login by listing accounts
print(accounts)

```

```
# .env (in the working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # edit it
SJ_SEC_KEY=YOUR_SECRET_KEY             # edit it
SJ_PRODUCTION=false                    # simulation mode

# Start server (auto-reads .env and logs in)
shioaji server start

# Verify login by listing accounts
shioaji auth accounts

```

```
# .env (in the working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # edit it
SJ_SEC_KEY=YOUR_SECRET_KEY             # edit it
SJ_PRODUCTION=false                    # simulation mode

# Start server (run in terminal, auto-reads .env and logs in)
shioaji server start

# Verify login by listing accounts
curl http://localhost:8080/api/v1/auth/accounts

```

### Place Order Test - Stock

Stock

```
# contract - edit it
contract = api.Contracts.Stocks.TSE.TSE2890

# stock order - edit it
order = sj.StockOrder(
    action=sj.Action.Buy,                    # buy / sell
    price=28,                                # price
    quantity=1,                              # quantity
    price_type=sj.StockPriceType.LMT,        # price type
    order_type=sj.OrderType.ROD,             # order condition
    order_lot=sj.StockOrderLot.Common,       # order lot
    order_cond=sj.StockOrderCond.Cash,       # order condition
    account=api.stock_account                # trading account
)

# place order
trade = api.place_order(contract, order)
trade

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '210.59.255.161:80', hostname '210.59.255.161:80' IP 210.59.255.161:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up

Trade(
    contract=Contract(...),
    order=Order(...),
    status=OrderStatus(
        id='000019',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 15, 14, 44, 43, 371915, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
    )
)

```

Stock

```
# contract, order, and account - edit it
shioaji order place \
    --code 2890 \
    --action buy \
    --price 28 \
    --quantity 1 \
    --price-type lmt \
    --order-type rod \
    --order-lot common \
    --order-cond cash \
    --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract: ...
order: ...
status:
  id: "00005C"
  status: PendingSubmit
  status_code: "00"
  order_ts: 1778828991.03281
  msg: ""
  modified_ts: 0
  modified_price: 0
  order_quantity: 0
  deal_quantity: 0
  cancel_quantity: 0

```

Stock

```
# contract, order, and account - edit it
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H "Content-Type: application/json" \
  -d '{
    "contract": {"security_type": "STK", "exchange": "TSE", "code": "2890"},
    "stock_order": {
      "action": "Buy",
      "price": 28,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "ROD",
      "order_lot": "Common",
      "order_cond": "Cash",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{
  "contract": ...,
  "order": ...,
  "status": {
    "id": "000066",
    "status": "PendingSubmit",
    "status_code": "00",
    "order_ts": 1778829088.557384,
    "msg": "",
    "modified_ts": 0.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 0,
    "deals": []
  }
}

```

### Place Order Test - Futures

Futures

```
# contract - edit it
contract = api.Contracts.Futures.TXF.TXFE6

# futures order - edit it
order = sj.FuturesOrder(
    action=sj.Action.Buy,                    # buy / sell
    price=37000,                             # price
    quantity=1,                              # quantity
    price_type=sj.FuturesPriceType.LMT,      # price type
    order_type=sj.OrderType.ROD,             # order condition
    octype=sj.FuturesOCType.Auto,            # open/close type
    account=api.futopt_account               # trading account
)

# place order
trade = api.place_order(contract, order)
trade

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '210.59.255.161:80', hostname '210.59.255.161:80' IP 210.59.255.161:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up

Trade(
    contract=Contract(...),
    order=Order(...),
    status=OrderStatus(
        id='000122',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 15, 15, 51, 27, 582363, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
    )
)

```

Futures

```
# contract, order, and account - edit it
shioaji order place \
    --code TXFE6 \
    --security-type FUT \
    --action buy \
    --price 37000 \
    --quantity 1 \
    --price-type lmt \
    --order-type rod \
    --octype auto \
    --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract: ...
order: ...
status:
  id: "000137"
  status: PendingSubmit
  status_code: "00"
  order_ts: 1778831763.269576
  msg: ""
  modified_ts: 0
  modified_price: 0
  order_quantity: 0
  deal_quantity: 0
  cancel_quantity: 0

```

Futures

```
# contract, order, and account - edit it
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H "Content-Type: application/json" \
  -d '{
    "contract": {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFE6"},
    "futures_order": {
      "action": "Buy",
      "price": 37000,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "ROD",
      "octype": "Auto",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{
  "contract": ...,
  "order": ...,
  "status": {
    "id": "000153",
    "status": "PendingSubmit",
    "status_code": "00",
    "order_ts": 1778832017.53043,
    "msg": "",
    "modified_ts": 0.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 0,
    "deals": [],
    "web_id": ""
  }
}

```

- An order status of `PendingSubmit` (in transit) or `Submitted` (sent) means the order was placed successfully; if it's `Failed`, correct the order and run `place_order` again.
- [Contract](../../contract/)
- [Futures Order](../../order/FutureOption/)

### Check if API tests has passed

Attention

Before you check, please confirm the following conditions are met.

- Sign the API related document before you test, or you will not pass the test.
- Doing test in service hour.
- Stock accounts and Futures accounts should be tested separately.
- Waiting for reviewing your tests at least 5 minutes.

Go to the sign center to check your account's test status.

[Stock API Sign Center](https://www.sinotrade.com.tw/newweb/signCenter/S_openAPI/)

[Futures API Sign Center](https://www.sinotrade.com.tw/newweb/signCenter/F_openApi/)

Note

If you only need shioaji, completing the **signing** and **python test** is sufficient; the `T4 test` is not required.

Log in with production mode and inspect the `signed` field on each account.

```
api = sj.Shioaji(simulation=False)  # production mode
accounts = api.login(
    api_key="YOUR_API_KEY",         # edit it
    secret_key="YOUR_SECRET_KEY"    # edit it
)

# check accounts (inspect signed status)
print(accounts)

```

```
# .env (in working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # edit it
SJ_SEC_KEY=YOUR_SECRET_KEY             # edit it
SJ_PRODUCTION=true                     # production mode

# start the server (reads .env, completes login)
shioaji server start

# check accounts (inspect signed status)
shioaji auth accounts

```

```
# .env (in working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # edit it
SJ_SEC_KEY=YOUR_SECRET_KEY             # edit it
SJ_PRODUCTION=true                     # production mode

# start the server in another terminal (reads .env, completes login)
shioaji server start

# check accounts (inspect signed status)
curl http://localhost:8080/api/v1/auth/accounts

```
