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
contracts: 商品檔列表（由 api.Contracts.Stocks.* 取得）
timeout:   逾時毫秒
cb:        選填，callback 函式，timeout=0 時使用

```

CLI 目前不支援或有券源查詢，請改用 Python / HTTP。

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
contracts:                 商品檔列表
contracts[].security_type: 商品類型 {'STK'}
contracts[].exchange:      交易所 {'TSE', 'OTC'}
contracts[].code:          商品代碼（例如 2330）

```

提醒

或有券源僅支援證券 (`security_type` = `"STK"`)。

## 屬性

ShortStockSource

```
code (str):               商品代碼
short_stock_source (int): 或有券源
ts / datetime:            時間（Python 為 Unix 時間戳，其他語言為 ISO 字串）

```

## 範例

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

**轉成 DataFrame（以 polars 示範）**

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
