用於查詢**證券帳戶**交割款，需要先[登入](../../login)。

settlements

```
api.settlements?

Signature:
    api.settlements(
        account: shioaji.account.Account = None,
        timeout: int = 5000,
        cb: Callable[[List[shioaji.position.SettlementV1]], NoneType] = None,
    ) -> List[shioaji.position.SettlementV1]

```

Parameters

```
account: 選填，證券帳戶（省略則使用 api.stock_account）
timeout: 逾時毫秒
cb:      選填，callback 函式，timeout=0 時使用

```

settlements

```
$ shioaji portfolio settlements --help

Get settlement list (date/amount/T, stock account)

Usage: shioaji portfolio settlements [OPTIONS]

Options:
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

```

Parameters

```
--account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

```

settlements

```
POST /api/v1/portfolio/settlements
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

SettlementV1

```
date (datetime.date): 交割日期
amount (float):       交割金額
T (int):              Tday

```

## 範例

In

```
api.settlements()

```

Out

```
[
    SettlementV1(date='2026-05-21', amount=100000, T=0),
    SettlementV1(date='2026-05-22', amount=0, T=1),
    SettlementV1(date='2026-05-25', amount=0, T=2),
]

```

**轉成 DataFrame（以 polars 示範）**

In

```
import polars as pl
settlements = api.settlements()
df = pl.DataFrame(s.dict() for s in settlements)
df

```

Out

| date | amount | T | | --- | --- | --- | | 2026-05-21 | 100000 | 0 | | 2026-05-22 | 0 | 1 | | 2026-05-25 | 0 | 2 |

**指定帳戶**

In

```
api.settlements(account=api.stock_account)

```

In

```
shioaji portfolio settlements

```

Out

```
[3]{date,amount,T}:
  "2026-05-21",100000,0
  "2026-05-22",0,1
  "2026-05-25",0,2

```

**指定帳戶**

In

```
shioaji portfolio settlements --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/settlements \
  -H 'Content-Type: application/json' \
  -d '{}'

```

Out

```
[
  {"date": "2026-05-21", "amount": 100000.0, "T": 0},
  {"date": "2026-05-22", "amount": 0.0, "T": 1},
  {"date": "2026-05-25", "amount": 0.0, "T": 2}
]

```

**指定帳戶**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/settlements \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```
