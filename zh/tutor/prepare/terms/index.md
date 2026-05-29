受限於台灣金融法規，新用戶首次使用需簽署相關文件並在測試模式完成測試報告才能進行正式環境的使用。

開戶

在開始之前必須先擁有[永豐金帳戶](https://www.sinotrade.com.tw/openact?utm_campaign=OP_inchannel&utm_source=newweb&utm_medium=button_top&strProd=0037&strWeb=0035)。

## API 簽署

請參見[簽署中心](https://www.sinotrade.com.tw/newweb/signCenter/signCenterIndex/)並在簽署前**仔細閱讀文件**。

注意

證券與期貨需各別簽署，請依您的使用狀況分別完成。

## API測試

確保您完全理解如何使用，需在模擬模式完成測試報告，內容包含以下功能:

- 登入測試 `login`
- 下單測試 `place_order`

Attention

可測試時間:

- 因應公司資訊安全規定，測試報告服務為星期一至五 08:00 ~ 20:00
- 18:00 ~ 20:00: 只允許台灣IP
- 08:00 ~ 18:00: 沒有限制

版本限制:

- 版本 >= 1.2

其他:

- API下單簽署時間須早於API測試的時間，以利審核通過
- 證券、期貨戶須各別測試
- 證券/期貨下單測試，需間隔1秒以上，以利系統留存測試紀錄

### 查詢使用版本

```
import shioaji as sj
print(sj.__version__)

```

```
shioaji server check

```

```
curl http://localhost:8080/api/v1/info

```

### 登入測試

登入

```
api = sj.Shioaji(simulation=True)  # 模擬模式
accounts = api.login(
    api_key="金鑰",     # 請修改此處
    secret_key="密鑰"   # 請修改此處
)

# 確認帳戶（驗證已登入）
print(accounts)

```

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=false                    # 模擬模式

# 啟動 server（自動讀取 .env，完成登入）
shioaji server start

# 確認帳戶（驗證已登入）
shioaji auth accounts

```

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=false                    # 模擬模式

# 啟動 server（在 terminal 執行，自動讀取 .env，完成登入）
shioaji server start

# 確認帳戶（驗證已登入）
curl http://localhost:8080/api/v1/auth/accounts

```

### 證券下單測試

證券

```
# 商品檔 - 請修改此處
contract = api.Contracts.Stocks.TSE.TSE2890

# 證券委託單 - 請修改此處
order = sj.StockOrder(
    action=sj.Action.Buy,                    # 買賣別
    price=28,                                # 價格
    quantity=1,                              # 數量
    price_type=sj.StockPriceType.LMT,        # 價格別
    order_type=sj.OrderType.ROD,             # 委託條件
    order_lot=sj.StockOrderLot.Common,       # 委託別
    order_cond=sj.StockOrderCond.Cash,       # 委託種類
    account=api.stock_account                # 下單帳號
)

# 下單
trade = api.place_order(contract, order)
trade

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '210.59.255.161:80', hostname '210.59.255.161:80' IP 210.59.255.161:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up

Trade(
    contract=Contract(...),
    order=Order(...),
    status=OrderStatus(
        id='000019',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 15, 14, 44, 43, 371915, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
    )
)

```

證券

```
# 商品檔、委託單與帳號 - 請修改此處
shioaji order place \
    --code 2890 \
    --action buy \
    --price 28 \
    --quantity 1 \
    --price-type lmt \
    --order-type rod \
    --order-lot common \
    --order-cond cash \
    --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract: ...
order: ...
status:
  id: "00005C"
  status: PendingSubmit
  status_code: "00"
  order_ts: 1778828991.03281
  msg: ""
  modified_ts: 0
  modified_price: 0
  order_quantity: 0
  deal_quantity: 0
  cancel_quantity: 0

```

證券

```
# 商品檔、委託單與帳號 - 請修改此處
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H "Content-Type: application/json" \
  -d '{
    "contract": {"security_type": "STK", "exchange": "TSE", "code": "2890"},
    "stock_order": {
      "action": "Buy",
      "price": 28,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "ROD",
      "order_lot": "Common",
      "order_cond": "Cash",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{
  "contract": ...,
  "order": ...,
  "status": {
    "id": "000066",
    "status": "PendingSubmit",
    "status_code": "00",
    "order_ts": 1778829088.557384,
    "msg": "",
    "modified_ts": 0.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 0,
    "deals": []
  }
}

```

### 期貨下單測試

期貨

```
# 商品檔 - 請修改此處
contract = api.Contracts.Futures.TXF.TXFE6

# 期貨委託單 - 請修改此處
order = sj.FuturesOrder(
    action=sj.Action.Buy,                    # 買賣別
    price=37000,                             # 價格
    quantity=1,                              # 數量
    price_type=sj.FuturesPriceType.LMT,      # 價格別
    order_type=sj.OrderType.ROD,             # 委託條件
    octype=sj.FuturesOCType.Auto,            # 倉別
    account=api.futopt_account               # 下單帳號
)

# 下單
trade = api.place_order(contract, order)
trade

```

Out

```
Response Code: 0 | Event Code: 0 | Info: host '210.59.255.161:80', hostname '210.59.255.161:80' IP 210.59.255.161:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up

Trade(
    contract=Contract(...),
    order=Order(...),
    status=OrderStatus(
        id='000122',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 15, 15, 51, 27, 582363, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
    )
)

```

期貨

```
# 商品檔、委託單與帳號 - 請修改此處
shioaji order place \
    --code TXFE6 \
    --security-type FUT \
    --action buy \
    --price 37000 \
    --quantity 1 \
    --price-type lmt \
    --order-type rod \
    --octype auto \
    --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract: ...
order: ...
status:
  id: "000137"
  status: PendingSubmit
  status_code: "00"
  order_ts: 1778831763.269576
  msg: ""
  modified_ts: 0
  modified_price: 0
  order_quantity: 0
  deal_quantity: 0
  cancel_quantity: 0

```

期貨

```
# 商品檔、委託單與帳號 - 請修改此處
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H "Content-Type: application/json" \
  -d '{
    "contract": {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFE6"},
    "futures_order": {
      "action": "Buy",
      "price": 37000,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "ROD",
      "octype": "Auto",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{
  "contract": ...,
  "order": ...,
  "status": {
    "id": "000153",
    "status": "PendingSubmit",
    "status_code": "00",
    "order_ts": 1778832017.53043,
    "msg": "",
    "modified_ts": 0.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 0,
    "deals": [],
    "web_id": ""
  }
}

```

- 委託單狀態為 `PendingSubmit`（傳送中）或 `Submitted`（已送出）均表示委託成功；若為 `Failed`，請修正委託單內容後重新執行 `place_order`。
- [商品檔](../../contract/)
- [期貨委託下單](../../order/FutureOption/)

### 查詢是否通過API測試

Attention

在查詢前，請確認以下狀況均符合

- API下單簽署時間須早於API測試的時間，以利審核通過
- 在可測試時間進行測試
- 證券、期貨戶須各別測試
- 等待API測試審核(約5分鐘)

至簽署中心查看帳號的測試狀態。

[證券 API 簽署中心](https://www.sinotrade.com.tw/newweb/signCenter/S_openAPI/)

[期貨 API 簽署中心](https://www.sinotrade.com.tw/newweb/signCenter/F_openApi/)

說明

若您僅需使用 shioaji，完成 **簽署** 與 **python 測試** 即可，`T4 測試` 不需要完成。

以正式模式登入後查看 `accounts`，確認 `signed` 欄位。

```
api = sj.Shioaji(simulation=False)  # 正式模式
accounts = api.login(
    api_key="金鑰",     # 請修改此處
    secret_key="密鑰"   # 請修改此處
)

# 確認帳戶（檢視 signed 狀態）
print(accounts)

```

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=true                     # 正式模式

# 啟動 server（自動讀取 .env，完成登入）
shioaji server start

# 確認帳戶（檢視 signed 狀態）
shioaji auth accounts

```

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=true                     # 正式模式

# 啟動 server（在 terminal 執行，自動讀取 .env，完成登入）
shioaji server start

# 確認帳戶（檢視 signed 狀態）
curl http://localhost:8080/api/v1/auth/accounts

```
