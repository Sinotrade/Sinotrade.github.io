用於查詢**證券／期貨選擇權帳戶**委託狀態，需要先[登入](../../login)。

## 讀取委託狀態

`api.list_trades()` 不帶參數，回傳目前已知的 `Trade` 清單，包含名下所有帳號。也可以直接讀取手上的 `trade` 物件（由 `place_order` 或 `list_trades` 取得），從 `status` 欄位確認狀態。

新登入時清單為空，請先[補查](#%E8%A3%9C%E6%9F%A5%E8%88%87%E5%B0%8D%E5%B8%B3)取得當日委託。

list_trades

```
api.list_trades?

Signature:
    api.list_trades() -> List[sj.Trade]

```

trades

```
POST /api/v1/order/trades
Content-Type: application/json

{
  "account_type": <string>,
  "broker_id": <string>,
  "account_id": <string>,
  "refresh": <bool>
}

```

Parameters

```
account_type: S 證券、F 期貨選擇權；省略視為 S
broker_id:    分公司代碼；與 account_id 一併指定特定帳戶
account_id:   帳號；省略則使用該 account_type 的預設帳戶
refresh:      是否先向後端更新，省略為 true；
              false 只回傳本機快取（1.7.6 起）

```

### 屬性

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

### 範例

In

```
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
curl -X POST http://localhost:8080/api/v1/order/trades \
  -H 'Content-Type: application/json' \
  -d '{
    "account_type": "S",
    "refresh": false
  }'

```

Out

```
[{"contract":{"security_type":"STK","exchange":"TSE","code":"2890"},"order":{"id":"a647f23d","action":"Buy","price":27.1,"quantity":2,"seqno":"214115","ordno":"Y27FI","order_type":"ROD","price_type":"LMT","account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"order_cond":"Cash","order_lot":"Common"},"status":{"id":"a647f23d","status":"Filled","status_code":"00","order_datetime":"2026-05-20T11:24:30+08:00","web_id":"137","modified_time":"2026-05-20T11:24:30+08:00","order_quantity":2,"deal_quantity":2,"deals":[{"seq":"000001","price":27.1,"quantity":2,"ts":1747714234.123456}]}}]

```

## 取得與維持最新 Trade

新登入時尚未收到任何回報，請先呼叫一次 `update_status` 取得當日委託。之後如何維持最新，依版本而不同：

由系統維護，`Trade` 物件會隨主動回報自動更新。

- 可設定 [order callback](../../callback/orderdeal_event/) 當作通知，收到回報後再去讀取 `trade`。
- 需要確認回報沒有漏接時，用 [trade_cache_health](#%E6%AA%A2%E6%9F%A5%E5%9B%9E%E5%A0%B1%E6%98%AF%E5%90%A6%E6%BC%8F%E6%8E%A5) 檢查。

由使用者自行維護，`Trade` 物件不會自動更新。

- 可設定 [order callback](../../callback/orderdeal_event/)，自行由回報內容維護 `Trade` 物件。
- 或在每次讀取前呼叫 `update_status` 更新。

## 補查與對帳

`update_status` 會向後端查詢委託狀態並更新 `Trade`。新登入後取得當日委託、疑似漏接回報，或需要確認最終狀態時使用。

update_status

```
api.update_status?

Signature:
    api.update_status(
        account: Optional[sj.Account] = None,
        *,
        trade: Optional[sj.Trade] = None,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[List[sj.Trade]], None]] = None,
    ) -> None

```

Parameters

```
account: 證券或期貨帳號；省略則更新名下所有帳號
trade:   指定要更新的 Trade 物件（關鍵字參數）
timeout: 逾時毫秒
cb:      選填，callback 函式；timeout=0 時會收到更新後的 Trade 清單

```

trades

```
POST /api/v1/order/trades
Content-Type: application/json

{
  "account_type": <string>,
  "broker_id": <string>,
  "account_id": <string>,
  "refresh": true
}

```

Parameters

```
account_type: S 證券、F 期貨選擇權；省略視為 S
broker_id:    分公司代碼；與 account_id 一併指定特定帳戶
account_id:   帳號；省略則使用該 account_type 的預設帳戶
refresh:      設為 true（或省略）會先向後端更新再回傳

```

### 範例

In

```
api.update_status()                      # 名下所有帳號
# api.update_status(api.stock_account)   # 僅證券帳戶
# api.update_status(api.futopt_account)  # 僅期貨選擇權帳戶
# api.update_status(trade=trade)         # 僅單一委託

api.list_trades()

```

In

```
curl -X POST http://localhost:8080/api/v1/order/trades \
  -H 'Content-Type: application/json' \
  -d '{
    "account_type": "S",
    "refresh": true
  }'

```

## 檢查回報是否漏接（1.7.6 起）

漏接回報時 `Trade` 會停在舊狀態，從外觀看不出來。`api.trade_cache_health(account)` 用來確認目前是否有漏接的跡象。

trade_cache_health

```
api.trade_cache_health?

Signature:
    api.trade_cache_health(account: sj.Account) -> sj.TradeCacheHealth

```

Parameters

```
account: 證券或期貨帳號

```

trade_cache_health

```
POST /api/v1/order/trade_cache_health
Content-Type: application/json

{
  "account_type": <string>,
  "broker_id": <string>,
  "account_id": <string>
}

```

Parameters

```
account_type: S 證券、F 期貨選擇權；省略視為 S
broker_id:    分公司代碼；與 account_id 一併指定特定帳戶
account_id:   帳號；省略則使用該 account_type 的預設帳戶

```

TradeCacheHealth

```
state (TradeCacheHealthState):          快取狀態，{
                                           Healthy:  正常,
                                           Unknown:  尚無判斷依據,
                                           Degraded: 可能漏接回報
                                        }
reasons (List[TradeCacheHealthReason]): 判定原因，每筆包含
                                           event_type (OrderState):             回報種類
                                           reason (TradeCacheHealthReasonCode): 原因碼

```

依 `state` 與 `reason` 處理：

| `state` | `reason` | 處理方式 | | --- | --- | --- | | `Healthy` | 無 | 不需處理 | | `Unknown` | `NotSubscribed` | 尚未訂閱該帳戶回報，呼叫 `subscribe_trade(account)` | | `Unknown` | `NoBaseline` | 該類回報尚未發生過，不需處理；回報到達後即消失，或呼叫 `update_status` 立即建立基準 | | `Degraded` | `SequenceGap` | 回報序號跳號，可能只是晚到；需要確認時呼叫 `update_status` | | `Degraded` | `PendingReport` | 回報尚無法關聯到委託，通常後續回報到達即恢復；需要確認時呼叫 `update_status` | | `Degraded` | `UntrackableEventId` | event ID 缺失或格式不支援，無法追蹤，呼叫 `update_status` 對帳 | | `Degraded` | `ProjectionFailed` | 回報無法套用到 `Trade`，呼叫 `update_status` 對帳 |

### 範例

In

```
health = api.trade_cache_health(api.stock_account)
health.state, [(r.event_type, r.reason) for r in health.reasons]

```

Out

```
(<TradeCacheHealthState.Unknown: 'Unknown'>,
 [(<OrderState.StockDeal: 'SDEAL'>,
   <TradeCacheHealthReasonCode.NoBaseline: 'NoBaseline'>)])

```

上例為已下單但尚未成交的狀態：委託回報（`SORDER`）已收到，因此不在 `reasons` 中；成交回報（`SDEAL`）還沒發生，仍是 `NoBaseline`。兩個串流都有 baseline 後，`state` 才會變成 `Healthy`。

In

```
curl -X POST http://localhost:8080/api/v1/order/trade_cache_health \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S"}'

```

Out

```
{"state":"Unknown","reasons":[{"event_type":"StockDeal","reason":"NoBaseline"}]}

```

上例為已下單但尚未成交的狀態：委託回報（`StockOrder`）已收到，因此不在 `reasons` 中；成交回報（`StockDeal`）還沒發生，仍是 `NoBaseline`。兩個串流都有 baseline 後，`state` 才會變成 `Healthy`。
