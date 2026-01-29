The feature of account_balance is used to query account balance of stock account and you need to [login](../../login) first.

In

```
api.account_balance?

```

Out

```
Signature:
    api.account_balance(
        account: shioaji.account.Account = None,
        timeout: int = 5000,
        cb: Callable[[shioaji.position.AccountBalance], NoneType] = None,
    )
Docstring: query stock account balance

```

In

```
api.account_balance()

```

Out

```
AccountBalance(
    status=<FetchStatus.Fetched: 'Fetched'>,
    acc_balance=100000.0,
    date='2023-01-06 13:30:00.000000',
    errmsg=''
)

```

In - with account parameter

```
api.account_balance(account=api.stock_account)

```

Out

```
AccountBalance(
    status=<FetchStatus.Fetched: 'Fetched'>,
    acc_balance=100000.0,
    date='2023-01-06 13:30:00.000000',
    errmsg=''
)

```

AccountBalance

```
status (FetchStatus): fetch status
acc_balance (float): account balance
date (str): query date
errmsg (str): error message

```
