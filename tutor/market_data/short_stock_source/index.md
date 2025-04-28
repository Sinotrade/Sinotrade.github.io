Short Stock Sources

```
>> api.short_stock_sources?

Signature:
api.short_stock_sources(
    contracts: List[shioaji.contracts.Stock],
    timeout: int = 5000,
    cb: Callable[[shioaji.data.ShortStockSource], NoneType] = None,
) -> List[shioaji.data.ShortStockSource]

```

## Example

In

```
contracts = [
    api.Contracts.Stocks['2330'], 
    api.Contracts.Stocks['2317']
]
short_stock_sources = api.short_stock_sources(contracts)
short_stock_sources

```

Out

```
[
    ShortStockSource(code='2330', short_stock_source=58260, ts=1673943433000000000),
    ShortStockSource(code='2317', short_stock_source=75049, ts=1673943433000000000)
]

```

To DataFrame

In

```
df = pd.DataFrame(s.__dict__ for s in short_stock_sources)
df.ts = pd.to_datetime(df.ts)
df

```

Out

| code | short_stock_source | ts | | --- | --- | --- | | 2330 | 58260 | 2023-01-17 08:17:13 | | 2317 | 75049 | 2023-01-17 08:17:13 |

## Attributes

ShortStockSource

```
code (str): contract id
short_stock_source (float): short stock source
ts (int): timeStamp

```
