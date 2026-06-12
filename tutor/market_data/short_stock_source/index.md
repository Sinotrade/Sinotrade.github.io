ShortStockSources

```
api.short_stock_sources?

Signature:
    api.short_stock_sources(
        contracts: List[shioaji.contracts.Stock],
        timeout: int = 5000,
        cb: Callable[[shioaji.data.ShortStockSource], NoneType] = None,
    ) -> List[shioaji.data.ShortStockSource]

```

Parameters

```
contracts: list of contracts (from api.Contracts.Stocks.*)
timeout:   timeout in milliseconds
cb:        optional, callback function, used when timeout=0

```

ShortStockSources

```
$ shioaji data short-stock-sources --help

Get short stock sources (borrowable shares) for contracts

Usage: shioaji data short-stock-sources [OPTIONS] --codes <CODES>

Options:
      --codes <CODES>                  Comma-separated security codes (e.g. 2330,2317,2454)
      --security-type <SECURITY_TYPE>  Security type: STK, FUT, OPT, IND [default: STK]
      --exchange <EXCHANGE>            Exchange: TSE, OTC, TAIFEX [default: TSE]

```

Parameters

```
--codes:    comma-separated security codes (e.g. 2330,2317)
--exchange: optional, TSE or OTC, default TSE

```

ShortStockSources

```
POST /api/v1/data/short_stock_sources
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

Short stock sources only supports stocks (`security_type` = `"STK"`).

## Attributes

ShortStockSource

```
code (str):               security code
short_stock_source (int): short stock source
ts / datetime:            time (integer Unix timestamp in Python, ISO string in other languages)

```

## Examples

In

```
contracts = [api.Contracts.Stocks['2330'], api.Contracts.Stocks['2317']]
short_stock_sources = api.short_stock_sources(contracts)
short_stock_sources

```

Out

```
[ShortStockSource(code='2330', short_stock_source=0, ts=1779099174000000000),
 ShortStockSource(code='2317', short_stock_source=1225, ts=1779099174000000000)]

```

**To DataFrame (using polars)**

In

```
import polars as pl
df = pl.DataFrame(s.dict() for s in short_stock_sources).with_columns(
    pl.col("ts").cast(pl.Datetime("ns"))
)
df

```

Out

| code | short_stock_source | ts | | --- | --- | --- | | 2330 | 0 | 2026-05-18 10:12:54 | | 2317 | 1225 | 2026-05-18 10:12:54 |

In

```
shioaji data short-stock-sources --codes 2330,2317

```

Out

```
[2]{code,short_stock_source,datetime}:
  "2330",0,2026-06-12T01:27:03
  "2317",1086,2026-06-12T01:27:03

```

In

```
curl -X POST http://localhost:8080/api/v1/data/short_stock_sources \
  -H 'Content-Type: application/json' \
  -d '{
    "contracts": [
      {"security_type": "STK", "exchange": "TSE", "code": "2330"},
      {"security_type": "STK", "exchange": "TSE", "code": "2317"}
    ]
  }'

```

Out

```
[{"code":"2330","short_stock_source":0,"datetime":"2026-05-18T10:13:47"},{"code":"2317","short_stock_source":1225,"datetime":"2026-05-18T10:13:47"}]

```
