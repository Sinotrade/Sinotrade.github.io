用於查詢現貨交割帳戶餘額，需要先[登入](../../login)。

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

In - 帶 account 參數

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
status (FetchStatus): 資料回傳狀態
acc_balance (float): 餘額
date (str): 查詢日期
errmsg (str): 錯誤訊息

```
