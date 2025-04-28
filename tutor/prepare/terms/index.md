Restricted by Taiwan's financial regulations, new users need to sign relevant documents and complete a test report in the simulation mode before using it in a production environment.

## Sign Documents

Please refer to [sign center](https://www.sinotrade.com.tw/newweb/Inside_Frame?URL=https://service.sinotrade.com.tw/signCenter/index/) and **read the documents carefully** before you sign.

## Test Report

To ensure that you fully understand how to use Shioaji, you need to complete the test in the simulation mode, which includes the following functions:

- `login`
- `place_order`

Attention

Service Hour:

- In response to the company's information security regulations, the test service is Monday to Friday 08:00 ~ 20:00
- 18:00 ~ 20:00: Only allow Taiwan IP
- 08:00 ~ 18:00: No limit

Version Restriction:

- version >= 1.2:\
  install command: `uv add shioaji` or `pip install -U shioaji`

Others:

- You should sign the API related document before you test!
- Stock and Futures account should be test separately.
- The time interval between stock place order test and futures place order test should be more than 1 second.

### Version Check

version

```
import shioaji as sj

print(sj.__version__)
# 1.0.0

```

- please note the **Version Restriction**.

### Login Test

Login

```
api = sj.Shioaji(simulation=True)   # Simulation Mode
api.login(
    api_key="YOUR_API_KEY",         # edit it
    secret_key="YOUR_SECRET_KEY"    # edit it
)

```

```
api = sj.Shioaji(simulation=True)   # Simulation Mode
api.login(
    person_id="YOUR_PERSON_ID",     # edit it
    passwd="YOUR_PASSWORD",         # edit it
)

```

- version >= 1.0: use `api_key` to login, if you haven't applied for the API Key, please refer to [Token](../token/) section.
- version < 1.0: use `person_id` to login.

### Place Order Test - Stock

Stock Order

```
# contract - edit it
contract = api.Contracts.Stocks.TSE["2890"]

# order - edit it
order = api.Order(
    price=18, 
    quantity=1, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.StockPriceType.LMT, 
    order_type=sj.constant.OrderType.ROD, 
    account=api.stock_account
)

# place order
trade = api.place_order(contract, order)
trade

```

```
# contract - edit it
contract = api.Contracts.Stocks.TSE["2890"]

# order - edit it
order = api.Order(
    price=18, 
    quantity=1, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.TFTStockPriceType.LMT, 
    order_type=sj.constant.TFTOrderType.ROD, 
    account=api.stock_account
)

# place order
trade = api.place_order(contract, order)
trade

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '218.32.76.102:80', IP 218.32.76.102:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 1) | Event: Session up

Trade(
    contract=Stock(...), 
    order=Order(...),
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        order_quantity=1,
        deals=[]
    )
)

```

- You should receive the message, `Response Code: 0 | Event Code: 0 | Info: host '218.32.76.102:80' ...`, which means that you have successfully connected to our testing server. The message will only appear on your first order. If you don't receive the connected message, please confirm that all the following conditions are met.

  1. Doing test in the service hour
  1. Version restriction
  1. `signed` is not present in your account

- order status should **NOT** be `Failed`. If you got `Failed` status, please modify your order correctly and then `place_order` again.

- [Contract](../../contract/)

- [Stock Order](../../order/Stock/)

### Place Order Test - Futures

Future Order

```
# near-month TXF - edit it
contract = min(
    [
        x for x in api.Contracts.Futures.TXF 
        if x.code[-2:] not in ["R1", "R2"]
    ],
    key=lambda x: x.delivery_date
)

# order - edit it
order = api.Order(
    action=sj.constant.Action.Buy,
    price=15000,
    quantity=1,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.OrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

# place order
trade = api.place_order(contract, order)
trade

```

```
# near-month TXF - edit it
contract = min(
    [
        x for x in api.Contracts.Futures.TXF 
        if x.code[-2:] not in ["R1", "R2"]
    ],
    key=lambda x: x.delivery_date
)

# order - edit it
order = api.Order(
    action=sj.constant.Action.Buy,
    price=15000,
    quantity=1,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.FuturesOrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

# place order
trade = api.place_order(contract, order)
trade

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '218.32.76.102:80', IP 218.32.76.102:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 1) | Event: Session up

Trade(
    contract=Future(...), 
    order=Order(...),
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        order_quantity=1,
        deals=[]
    )
)

```

- You should receive the message, `Response Code: 0 | Event Code: 0 | Info: host '218.32.76.102:80' ...`, which means that you have successfully connected to our testing server. The message will only appear on your first order. If you don't receive the connected message, please confirm that all the following conditions are met.

  1. Doing test in the service hour
  1. Version restriction
  1. `signed` is not present in your account

- order status should **NOT** be `Failed`. If you got `Failed` status, please modify your order correctly and then `place_order` again.

- [Contract](../../contract/)

- [Future Order](../../order/FutureOption/)

### Check if API tests has passed

Attention

Before you check, please confirm the following conditions are met.

- Sign the API related document before you test, or you will not pass the test.
- Doing test in service hour.
- Stock accounts and Futures accounts should be tested separately.
- Waiting for reviewing your tests at least 5 minutes.

Sign Status

```
import shioaji as sj

api = sj.Shioaji(simulation=False)   # Production Mode
accounts = api.login(
    api_key="YOUR_API_KEY",         # edit it
    secret_key="YOUR_SECRET_KEY"    # edit it
)
accounts

```

```
import shioaji as sj

api = sj.Shioaji(simulation=False)   # Production Mode
accounts = api.login(
    person_id="YOUR_PERSON_ID",     # edit it
    passwd="YOUR_PASSWORD",         # edit it
)
accounts

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '203.66.91.161:80', hostname '203.66.91.161:80' IP 203.66.91.161:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 1) | Event: Session up

[FutureAccount(person_id='QBCCAIGJBJ', broker_id='F002000', account_id='9100020', signed=True, username='PAPIUSER01'),
StockAccount(person_id='QBCCAIGJBJ', broker_id='9A95', account_id='0504350', username='PAPIUSER01')]

```

- `signed=True`: Congrats, done! Ex: FutureAccount.
- `signed=False` or `signed` not present: the account haven't passed the api tests or haven't been signed the api documents. Ex: StockAccount.

## CA

You must **apply** and **activate** the CA before `place_order`.

### Apply CA

1. Go to [SinoPac Securities](https://www.sinotrade.com.tw/CSCenter/CSCenter_13_3) to download eleader
1. Login eleader
1. Select (3303)帳號資料設定 from the 帳戶資料 above
1. Click "步驟說明"
1. CA Operation steps

### Activate CA

- If you use simulation account, you don't have to activate CA.
- If you are a macOS user, you may subject to version-issue. We suggest you to use [docker](https://github.com/Sinotrade/Shioaji) and run shioaji service on docker.

In

```
result = api.activate_ca(
    ca_path="/c/your/ca/path/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="Person ID of this Ca",
)

print(result)
# True

```

The Certification Path

In Windows you copy the file path with `\` to separate the file, you need to replace it with `/`.

#### Check CA expire time

In

```
api.get_ca_expiretime("Person ID")

```
