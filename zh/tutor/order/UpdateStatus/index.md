提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

在取得 `Trade` 狀態前，必須先呼叫 `update_status` 更新。預設會更新名下所有帳號的委託；若只想更新單一帳號，將該帳號傳入 `account`；若只想更新單一委託，將該 `Trade` 物件以關鍵字參數 `trade=` 傳入。更新完成後，可從 `api.list_trades()` 取得最新的 `Trade` 清單，或直接讀取傳入的 `trade` 物件中的 `status` 確認狀態。

update_status

```
api.update_status?

Signature:
    api.update_status(
        account: Optional[sj.Account] = None,
        *,
        trade: Optional[sj.Trade] = None,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[], None]] = None,
    ) -> None

```

Parameters

```
account: 證券或期貨帳號；省略則更新名下所有帳號
trade:   指定要更新的 Trade 物件（關鍵字參數）
timeout: 逾時毫秒
cb:      選填，callback 函式

```

update_status

```
POST /api/v1/order/update_status
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

```

Parameters

```
account: 證券或期貨帳號

```

## 屬性

OrderStatus

```
id (str):                  關聯 Order 物件編碼
status (OrderStatus):      委託狀態，{
                              Cancelled:     已刪除,
                              Filled:        完全成交,
                              PartFilled:    部分成交,
                              Inactive:      未啟用,
                              Failed:        失敗,
                              PendingSubmit: 傳送中,
                              PreSubmitted:  預約單,
                              Submitted:     傳送成功
                           }
status_code (str):         狀態碼
web_id (str):              Web 端委託編號
order_datetime (datetime): 委託時間
msg (str):                 訊息
modified_time (datetime):  最後改單時間
modified_price (float):    改價金額
order_quantity (int):      委託數量
deal_quantity (int):       成交數量
cancel_quantity (int):     取消委託數量
deals (List[Deal]):        成交明細

```

Deal

```
seq (str):           成交序號
price (float):       成交價
quantity (int):      成交數量
ts (float):          成交時間戳
datetime (datetime): 成交時間（由 ts 計算，tz=Asia/Taipei +0800）

```

## 範例

### 取得證券委託狀態

In

```
api.update_status(api.stock_account)
api.list_trades()

```

Out

```
[
    Trade(
        contract=Contract(
            security_type='STK',
            exchange='TSE',
            code='2890'
        ),
        order=Order(
            id='a647f23d',
            action=<Action.Buy: 'Buy'>,
            price=27.1,
            quantity=2,
            seqno='214115',
            ordno='Y27FI',
            order_type=<OrderType.ROD: 'ROD'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=StockAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            order_cond=<StockOrderCond.Cash: 'Cash'>,
            order_lot=<StockOrderLot.Common: 'Common'>
        ),
        status=OrderStatus(
            id='a647f23d',
            status=<OrderStatus.Filled: 'Filled'>,
            status_code='00',
            order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            web_id='137',
            modified_time=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            order_quantity=2,
            deal_quantity=2,
            deals=[
                Deal(
                    seq='000001',
                    price=27.1,
                    quantity=2,
                    ts=1747714234.123456,
                    datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
                )
            ]
        )
    )
]

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_status \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
[{"contract":{"security_type":"STK","exchange":"TSE","code":"2890"},"order":{"id":"a647f23d","action":"Buy","price":27.1,"quantity":2,"seqno":"214115","ordno":"Y27FI","order_type":"ROD","price_type":"LMT","account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"order_cond":"Cash","order_lot":"Common"},"status":{"id":"a647f23d","status":"Filled","status_code":"00","order_datetime":"2026-05-20T11:24:30+08:00","web_id":"137","modified_time":"2026-05-20T11:24:30+08:00","order_quantity":2,"deal_quantity":2,"deals":[{"seq":"000001","price":27.1,"quantity":2,"ts":1747714234.123456}]}}]

```

### 取得期貨委託狀態

In

```
api.update_status(api.futopt_account)
api.list_trades()

```

Out

```
[
    Trade(
        contract=Contract(
            security_type='FUT',
            exchange='TAIFEX',
            code='TMFE6'
        ),
        order=Order(
            id='e0ae2459',
            action=<Action.Buy: 'Buy'>,
            price=36216,
            quantity=2,
            seqno='242472',
            ordno='vE0Dr',
            order_type=<OrderType.ROD: 'ROD'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=FutureAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            octype=<FuturesOCType.NewPosition: 'NewPosition'>
        ),
        status=OrderStatus(
            id='e0ae2459',
            status=<OrderStatus.Filled: 'Filled'>,
            status_code='0000',
            order_datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            web_id='Z',
            modified_time=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            order_quantity=2,
            deal_quantity=2,
            deals=[
                Deal(
                    seq='000001',
                    price=36216,
                    quantity=2,
                    ts=1747647787.123456,
                    datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
                )
            ]
        )
    )
]

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_status \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
[{"contract":{"security_type":"FUT","exchange":"TAIFEX","code":"TMFE6"},"order":{"id":"e0ae2459","action":"Buy","price":36216,"quantity":2,"seqno":"242472","ordno":"vE0Dr","order_type":"ROD","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"NewPosition"},"status":{"id":"e0ae2459","status":"Filled","status_code":"0000","order_datetime":"2026-05-19T18:03:07+08:00","web_id":"Z","modified_time":"2026-05-19T18:03:07+08:00","order_quantity":2,"deal_quantity":2,"deals":[{"seq":"000001","price":36216,"quantity":2,"ts":1747647787.123456}]}}]

```

### 更新特定交易狀態

In

```
# trade 可從 place_order 或 list_trades 取得
# trade = api.place_order(contract, order)
# trade = api.list_trades()[0]

api.update_status(trade=trade)

```

HTTP 介面僅能以 `account` 更新該帳號全部委託，不支援指定單一 trade。

In

```
curl -X POST http://localhost:8080/api/v1/order/update_status \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```
