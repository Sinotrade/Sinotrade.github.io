CreditEnquires

```
api.credit_enquires?

Signature:
    api.credit_enquires(
        contracts: List[shioaji.contracts.Stock],
        timeout: int = 30000,
        cb: Callable[[shioaji.data.CreditEnquire], NoneType] = None,
    ) -> List[shioaji.data.CreditEnquire]

```

Parameters

```
contracts: list of contracts (from api.Contracts.Stocks.*)
timeout:   timeout in milliseconds
cb:        optional, callback function, used when timeout=0

```

CLI does not support credit enquires queries; please use Python / HTTP instead.

CreditEnquires

```
POST /api/v1/data/credit_enquire
Content-Type: application/json

{
  "contracts": [
    { "security_type": "STK", "exchange": <Exchange>, "code": <string> }
  ]
}

```

Parameters

```
contracts:                 list of contracts
contracts[].security_type: security type {'STK'}
contracts[].exchange:      exchange {'TSE', 'OTC'}
contracts[].code:          security code (e.g. 2330)

```

Reminder

Credit enquires only supports stocks (`security_type` = `"STK"`).

## Attributes

CreditEnquire

```
update_time (str):        update time
system (str):             system category
stock_id (str):           security code
margin_unit (int):        margin balance
short_unit (int):         short balance
margin_loan_ratio (int):  margin loan ratio
short_margin_ratio (int): short margin ratio

```

## Examples

In

```
contracts = [api.Contracts.Stocks['2330'], api.Contracts.Stocks['2890']]
credit_enquires = api.credit_enquires(contracts)
credit_enquires

```

Out

```
[CreditEnquire(update_time='2026-05-18 10:46:56.019666', system='ALL', stock_id='2330', margin_unit=776, short_unit=0, margin_loan_ratio=60, short_margin_ratio=90),
 CreditEnquire(update_time='2026-05-18 10:46:56.026375', system='ALL', stock_id='2890', margin_unit=0, short_unit=0, margin_loan_ratio=0, short_margin_ratio=0)]

```

**To DataFrame (using polars)**

In

```
import polars as pl
df = pl.DataFrame(c.dict() for c in credit_enquires)
df

```

Out

| update_time | system | stock_id | margin_unit | short_unit | margin_loan_ratio | short_margin_ratio | | --- | --- | --- | --- | --- | --- | --- | | 2026-05-18 10:46:56.019666 | ALL | 2330 | 776 | 0 | 60 | 90 | | 2026-05-18 10:46:56.026375 | ALL | 2890 | 0 | 0 | 0 | 0 |

In

```
curl -X POST http://localhost:8080/api/v1/data/credit_enquire \
  -H 'Content-Type: application/json' \
  -d '{
    "contracts": [
      {"security_type": "STK", "exchange": "TSE", "code": "2330"},
      {"security_type": "STK", "exchange": "TSE", "code": "2890"}
    ]
  }'

```

Out

```
[{"update_time":"2026-05-18 10:52:33.781753","system":"ALL","stock_id":"2330","margin_unit":776,"short_unit":0,"margin_loan_ratio":60,"short_margin_ratio":90},{"update_time":"2026-05-18 10:52:33.788285","system":"ALL","stock_id":"2890","margin_unit":0,"short_unit":0,"margin_loan_ratio":0,"short_margin_ratio":0}]

```
