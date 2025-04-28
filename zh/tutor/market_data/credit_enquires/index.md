Credit Enquires

```
>> api.credit_enquires?

Signature:
api.credit_enquires(
    contracts: List[shioaji.contracts.Stock],
    timeout: int = 30000,
    cb: Callable[[shioaji.data.CreditEnquire], NoneType] = None,
) -> List[shioaji.data.CreditEnquire]

```

## Example

In

```
contracts = [
    api.Contracts.Stocks['2330'],
    api.Contracts.Stocks['2890']
]
credit_enquires = api.credit_enquires(contracts)
credit_enquires

```

Out

```
[
    CreditEnquire(update_time='2020-12-11 13:30:13', system='HE', stock_id='2330', margin_unit=1381), 
    CreditEnquire(update_time='2020-12-11 13:30:02', system='HC', stock_id='2330', margin_unit=1371), 
    CreditEnquire(update_time='2020-12-11 13:30:05', system='HN', stock_id='2330', margin_unit=1357), 
    CreditEnquire(update_time='2020-12-11 13:30:03', system='HF', stock_id='2330', margin_unit=1314), 
    CreditEnquire(update_time='2020-12-09 10:56:05', system='HE', stock_id='2890'), 
    CreditEnquire(update_time='2020-12-11 09:33:04', system='HN', stock_id='2890'), 
    CreditEnquire(update_time='2020-12-02 09:01:03', system='HF', stock_id='2890')
]

```

To DataFrame

In

```
df = pd.DataFrame(c.__dict__ for c in credit_enquires)
df.update_time = pd.to_datetime(df.update_time)
df

```

Out

| | margin_unit | short_unit | stock_id | system | update_time | | --- | --- | --- | --- | --- | --- | | 0 | 1381 | 0 | 2330 | HE | 2020-12-11 13:30:13 | | 1 | 1371 | 0 | 2330 | HC | 2020-12-11 13:30:02 | | 2 | 1357 | 0 | 2330 | HN | 2020-12-11 14:31:19 | | 3 | 1314 | 0 | 2330 | HF | 2020-12-11 14:31:19 | | 4 | 0 | 0 | 2890 | HE | 2020-12-09 10:56:05 | | 5 | 0 | 0 | 2890 | HN | 2020-12-11 09:33:04 | | 6 | 0 | 0 | 2890 | HF | 2020-12-02 09:01:03 |

## Attributes

CreditEnquire

```
update_time (str): update time
system (str): system
stock_id (str): stock id
margin_unit (int): margin unit
short_unit (int): short unit

```
