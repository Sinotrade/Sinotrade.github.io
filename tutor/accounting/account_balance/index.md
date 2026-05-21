Query **stock settlement account** balance. [Login](../../login) is required first.

Note

Currently only SinoPac Bank, sub-account, and LINE Bank are supported.

AccountBalance

```
api.account_balance?

Signature:
    api.account_balance(
        account: shioaji.account.Account = None,
        timeout: int = 5000,
        cb: Callable[[shioaji.position.AccountBalance], NoneType] = None,
    ) -> shioaji.position.AccountBalance

```

Parameters

```
account: optional, stock account (defaults to api.stock_account)
timeout: timeout in milliseconds
cb:      optional, callback function, used when timeout=0

```

AccountBalance

```
shioaji portfolio balance [--account BROKER_ID-ACCOUNT_ID]

```

Parameters

```
--account: optional, BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567); defaults to the default stock account if omitted

```

AccountBalance

```
POST /api/v1/portfolio/account_balance
Content-Type: application/json

{
  "account_type": "S",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: account type, fixed as "S"
broker_id:    optional, broker ID
account_id:   optional, account ID
person_id:    optional, personal ID

```

## Attributes

AccountBalance

```
status (FetchStatus): fetch status
acc_balance (float):  balance
date (str):           query time
errmsg (str):         error message

```

## Examples

In

```
api.account_balance()

```

Out

```
AccountBalance(
    acc_balance=100000,
    date='2026-05-19 09:05:30.873436',
    errmsg=''
)

```

**With specific account**

In

```
api.account_balance(account=api.stock_account)

```

In

```
shioaji portfolio balance

```

Out

```
acc_balance: 100000
date: 2026-05-19 09:08:53.786742
errmsg: ""

```

**With specific account**

In

```
shioaji portfolio balance --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/account_balance \
  -H 'Content-Type: application/json' \
  -d '{}'

```

Out

```
{"acc_balance":100000.0,"date":"2026-05-19 09:21:10.085711","errmsg":""}

```

**With specific account**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/account_balance \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```
