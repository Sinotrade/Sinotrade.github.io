用於查詢**現貨交割帳戶**餘額，需要先[登入](../../login)。

提醒

目前僅支援永豐銀行、分戶帳、LINE Bank 查詢。

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
account: 選填，股票帳戶（省略則使用 api.stock_account）
timeout: 逾時毫秒
cb:      選填，callback 函式，timeout=0 時使用

```

AccountBalance

```
shioaji portfolio balance [--account BROKER_ID-ACCOUNT_ID]

```

Parameters

```
--account: 選填，BROKER_ID-ACCOUNT_ID 格式（例如 9A00-1234567），省略則使用預設股票帳戶

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
account_type: 帳戶類型，固定為 "S"
broker_id:    選填，券商代碼
account_id:   選填，帳戶代碼
person_id:    選填，身分證字號

```

## 屬性

AccountBalance

```
status (FetchStatus): 資料回傳狀態
acc_balance (float):  餘額
date (str):           查詢時間
errmsg (str):         錯誤訊息

```

## 範例

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

**指定帳戶**

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

**指定帳戶**

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

**指定帳戶**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/account_balance \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```
