The feature of settlements is used to query settlements of stock account and you need to [login](../../login) first.

## Settlements

In

```
api.settlements?

```

Out

```
Signature:
api.settlements(
    account: shioaji.account.Account = None,
    timeout: int = 5000,
    cb: Callable[[List[shioaji.position.SettlementV1]], NoneType] = None,
) -> List[shioaji.position.SettlementV1]
Docstring: query stock account of settlements

```

In

```
settlements = api.settlements(api.stock_account)   
settlements

```

Out

```
[
    SettlementV1(date=datetime.date(2022, 10, 13), amount=0.0, T=0),
    SettlementV1(date=datetime.date(2022, 10, 14), amount=0.0, T=1),
    SettlementV1(date=datetime.date(2022, 10, 17), amount=0.0, T=2)
]

```

To DataFrame

In

```
df = pd.DataFrame([s.__dict__ for s in settlements]).set_index("T")
df

```

out

| T | date | amount | | --- | --- | --- | | 0 | 2022-10-13 | 0 | | 1 | 2022-10-14 | 0 | | 2 | 2022-10-17 | 0 |

SettlementV1

```
date (datetime.date): date of Tday
amount (float): settlement amount
T (int): Tday

```
