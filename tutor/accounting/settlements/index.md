Query **stock account** settlements. [Login](../../login) is required first.

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
account: optional, stock account (defaults to api.stock_account)
timeout: timeout in milliseconds
cb:      optional, callback function, used when timeout=0

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
account_type: account type, fixed as "S"
broker_id:    optional, broker ID
account_id:   optional, account ID
person_id:    optional, personal ID

```

## Attributes

SettlementV1

```
date (datetime.date): settlement date
amount (float):       settlement amount
T (int):              Tday

```

## Examples

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

**Convert to DataFrame (polars example)**

In

```
import polars as pl
settlements = api.settlements()
df = pl.DataFrame(s.dict() for s in settlements)
df

```

Out

| date | amount | T | | --- | --- | --- | | 2026-05-21 | 100000 | 0 | | 2026-05-22 | 0 | 1 | | 2026-05-25 | 0 | 2 |

**With specific account**

In

```
api.settlements(account=api.stock_account)

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

**With specific account**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/settlements \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```
