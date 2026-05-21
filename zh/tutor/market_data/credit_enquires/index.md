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
contracts: 商品檔列表（由 api.Contracts.Stocks.* 取得）
timeout:   逾時毫秒
cb:        選填，callback 函式，timeout=0 時使用

```

CLI 目前不支援資券餘額查詢，請改用 Python / HTTP。

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
contracts:                 商品檔列表
contracts[].security_type: 商品類型 {'STK'}
contracts[].exchange:      交易所 {'TSE', 'OTC'}
contracts[].code:          商品代碼（例如 2330）

```

提醒

資券餘額僅支援證券 (`security_type` = `"STK"`)。

## 屬性

CreditEnquire

```
update_time (str):        更新時間
system (str):             類別
stock_id (str):           商品代碼
margin_unit (int):        資餘額
short_unit (int):         券餘額
margin_loan_ratio (int):  融資成數
short_margin_ratio (int): 融券成數

```

## 範例

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

**轉成 DataFrame（以 polars 示範）**

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
