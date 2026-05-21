提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

### 下單

下單時必須提供商品資訊`contract`及下單資訊`order`。

place_order

```
api.place_order?

Signature:
    api.place_order(
        contract: sj.Future,
        order: sj.FuturesOrder,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.Trade], None]] = None,
    ) -> sj.Trade
Docstring:
    placing order

```

Parameters

```
contract: 商品檔（由 api.Contracts.Futures.* 取得）
order:    期貨委託單物件
timeout:  逾時毫秒
cb:       選填，callback 函式

```

sj.FuturesOrder

```
action (Action):                買賣別 {Buy: 買, Sell: 賣}
price (float or int):           價格
quantity (int):                 數量
price_type (FuturesPriceType):  價格別 {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_type (OrderType):         委託條件 {ROD, IOC, FOK}
octype (FuturesOCType):         倉別 {Auto: 自動, New: 新倉, Cover: 平倉, DayTrade: 當沖}
account (Account):              下單帳號

```

place_order

```
POST /api/v1/order/place_order
Content-Type: application/json

{
  "contract": { "security_type": "FUT", "exchange": "TAIFEX", "code": <string> },
  "futures_order": {
    "action": <Action>,
    "price": <number>,
    "quantity": <integer>,
    "price_type": <FuturesPriceType>,
    "order_type": <OrderType>,
    "octype": <FuturesOCType>,
    "account": { "broker_id": <string>, "account_id": <string> }
  }
}

```

Parameters

```
contract.security_type:   商品類型 {FUT, OPT}
contract.code:            商品代碼
futures_order.action:     買賣別 {Buy, Sell}
futures_order.price:      價格
futures_order.quantity:   數量
futures_order.price_type: 價格別 {LMT, MKT, MKP}
futures_order.order_type: 委託條件 {ROD, IOC, FOK}
futures_order.octype:     倉別 {Auto, New, Cover, DayTrade}
futures_order.account:    下單帳號（省略則使用預設期貨帳號）

```

#### 範例：下單

Order

```
# 商品檔
contract = api.Contracts.Futures.TMF.TMFR1
# 委託內容
order = sj.FuturesOrder(
    action=sj.Action.Buy,
    price=36216,
    quantity=2,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.ROD,
    octype=sj.FuturesOCType.Auto,
    account=api.futopt_account,
)

```

In

```
# 下單
trade = api.place_order(contract, order)
trade

```

Out

```
Trade(
    contract=Contract(
        security_type='FUT',
        exchange='TAIFEX',
        code='TMFE6',
        target_code='TMFE6'
    ),
    order=Order(
        id='e0ae2459',
        action=<Action.Buy: 'Buy'>,
        price=36216,
        quantity=2,
        seqno='242472',
        order_type=<OrderType.ROD: 'ROD'>,
        price_type=<PriceType.LMT: 'LMT'>,
        account=FutureAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username='YOUR_USERNAME'
        ),
        octype=<FuturesOCType.Auto: 'Auto'>
    ),
    status=OrderStatus(
        id='e0ae2459',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='    ',
        order_datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
    )
)

```

下單完成後會收到交易所傳回的下單回報訊息，詳情內容可詳見[下單回報](../order_deal_event/stocks/)。

`place_order` 回傳的 `trade` 狀態若為 `PendingSubmit`，可執行 `update_status` 主動更新，詳見[委託狀態](../UpdateStatus/)。

In

```
api.update_status(api.futopt_account)
trade

```

Out

```
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
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='Z',
        modified_time=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=36216,
        order_quantity=2
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {"security_type": "FUT", "exchange": "TAIFEX", "code": "TMFR1"},
    "futures_order": {
      "action": "Buy",
      "price": 36216,
      "quantity": 2,
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
  "contract": {
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TMFE6",
    "target_code": ""
  },
  "order": {
    "id": "bf2ca5b0",
    "seqno": "243121",
    "ordno": "",
    "action": "Buy",
    "price": 36216.0,
    "quantity": 2,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "F",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": "YOUR_USERNAME"
    },
    "ca": "YOUR_CA_BASE64",
    "octype": "Auto"
  },
  "status": {
    "id": "bf2ca5b0",
    "status": "PendingSubmit",
    "status_code": "    ",
    "web_id": "",
    "order_ts": 1779187550.0,
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

下單完成後會收到交易所傳回的下單回報訊息，詳情內容可詳見[下單回報](../order_deal_event/stocks/)。

`POST /api/v1/order/place_order` 回傳的 `status` 若為 `PendingSubmit`，可呼叫 `POST /api/v1/order/trades` 主動更新，詳見[委託狀態](../UpdateStatus/)。

In

```
curl -X POST http://localhost:8080/api/v1/order/trades \
  -H 'Content-Type: application/json' \
  -d '{
    "broker_id": "YOUR_BROKER_ID",
    "account_id": "YOUR_ACCOUNT_ID"
  }'

```

Out

```
[
  {
    "contract": {
      "security_type": "FUT",
      "exchange": "TAIFEX",
      "code": "TMFE6"
    },
    "order": {
      "id": "bf2ca5b0",
      "seqno": "243121",
      "ordno": "vE0FK",
      "action": "Buy",
      "price": 36216.0,
      "quantity": 2,
      "order_type": "ROD",
      "price_type": "LMT",
      "custom_field": "",
      "account": {
        "account_type": "F",
        "person_id": "YOUR_PERSON_ID",
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID",
        "signed": true,
        "username": ""
      },
      "ca": "YOUR_CA_BASE64",
      "octype": "New"
    },
    "status": {
      "id": "bf2ca5b0",
      "status": "Submitted",
      "status_code": "0000",
      "web_id": "Z",
      "order_ts": 1779187550.0,
      "msg": "",
      "modified_ts": 1779187550.0,
      "modified_price": 36216.0,
      "order_quantity": 2,
      "deal_quantity": 0,
      "cancel_quantity": 0,
      "deals": []
    }
  }
]

```

委託單狀態

- `PendingSubmit`: 傳送中
- `PreSubmitted`: 預約單
- `Submitted`: 傳送成功
- `Failed`: 失敗
- `Cancelled`: 已刪除
- `Filled`: 完全成交
- `PartFilled`: 部分成交

### 改單

改單時必須提供原 `trade` 物件。提供改價與改量，兩種改單方式。其中，改量只能減量。

update_order

```
api.update_order?

Signature:
    api.update_order(
        trade: sj.Trade,
        price: Optional[float] = None,
        qty: Optional[int] = None,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.Trade], None]] = None,
    ) -> sj.Trade
Docstring:
    update the order price or qty

```

Parameters

```
trade:    委託單物件
price:    新價格（改價時帶）
qty:      新數量（改量時帶，只能減少）
timeout:  逾時毫秒
cb:       選填，callback 函式

```

update_price / update_qty

```
POST /api/v1/order/update_price
Content-Type: application/json

{
  "trade_id": <string>,
  "price": <number>
}

POST /api/v1/order/update_qty
Content-Type: application/json

{
  "trade_id": <string>,
  "quantity": <integer>
}

```

Parameters

```
trade_id: 委託單 ID（取自 place 回傳的 status.id）
price:    新價格
quantity: 新數量（只能減少）

```

注意

執行改單前，需先呼叫 `update_status` 取得委託單編號 (`ordno`)。

#### 範例：改價

In

```
api.update_order(trade=trade, price=36220)
api.update_status(api.futopt_account)
trade

```

Out

```
Trade(
    contract=Contract(
        security_type='FUT',
        exchange='TAIFEX',
        code='TMFE6'
    ),
    order=Order(
        id='259e3b09',
        action=<Action.Buy: 'Buy'>,
        price=36216,
        quantity=1,
        seqno='242656',
        ordno='vE0E5',
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
        id='259e3b09',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 5, 19, 18, 13, 36, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='Z',
        modified_time=datetime.datetime(2026, 5, 19, 18, 13, 42, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=36220,
        order_quantity=1
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_price \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID",
    "price": 36220
  }'

```

Out

```
{
  "contract": {
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TMFE6"
  },
  "order": {
    "id": "5dbaf55e",
    "seqno": "243390",
    "ordno": "vE0Fz",
    "action": "Buy",
    "price": 36220.0,
    "quantity": 1,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "F",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "octype": "New"
  },
  "status": {
    "id": "5dbaf55e",
    "status": "Submitted",
    "status_code": "0000",
    "web_id": "Z",
    "order_ts": 1779188357.0,
    "msg": "",
    "modified_ts": 1779188357.0,
    "modified_price": 36216.0,
    "order_quantity": 1,
    "deal_quantity": 0,
    "cancel_quantity": 0,
    "deals": []
  }
}

```

#### 範例：改量(減量)

注意

`update_order` 只能用來**減少**原委託單的委託數量。

In

```
api.update_order(trade=trade, qty=1)
api.update_status(api.futopt_account)
trade

```

Out

```
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
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='Z',
        modified_time=datetime.datetime(2026, 5, 19, 18, 3, 12, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=36216,
        order_quantity=1,
        cancel_quantity=1
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_qty \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID",
    "quantity": 1
  }'

```

Out

```
{
  "contract": {
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TMFE6"
  },
  "order": {
    "id": "bf2ca5b0",
    "seqno": "243121",
    "ordno": "vE0FK",
    "action": "Buy",
    "price": 36216.0,
    "quantity": 1,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "F",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "octype": "New"
  },
  "status": {
    "id": "bf2ca5b0",
    "status": "Submitted",
    "status_code": "0000",
    "web_id": "Z",
    "order_ts": 1779187550.0,
    "msg": "",
    "modified_ts": 1779187550.0,
    "modified_price": 36216.0,
    "order_quantity": 1,
    "cancel_quantity": 1,
    "deal_quantity": 0,
    "deals": []
  }
}

```

### 刪單

刪單時必須提供原 `trade` 物件。

cancel_order

```
api.cancel_order?

Signature:
    api.cancel_order(
        trade: sj.Trade,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.Trade], None]] = None,
    ) -> sj.Trade
Docstring:
    cancel order

```

Parameters

```
trade:   委託單物件
timeout: 逾時毫秒
cb:      選填，callback 函式

```

cancel_order

```
POST /api/v1/order/cancel_order
Content-Type: application/json

{
  "trade_id": <string>
}

```

Parameters

```
trade_id: 委託單 ID（取自 place 回傳的 status.id）

```

注意

執行刪單前，需先呼叫 `update_status` 取得委託單編號 (`ordno`)。

#### 範例：刪單

In

```
api.cancel_order(trade)
api.update_status(api.futopt_account)
trade

```

Out

```
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
        status=<OrderStatus.Cancelled: 'Cancelled'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='Z',
        modified_time=datetime.datetime(2026, 5, 19, 18, 3, 16, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=36216,
        cancel_quantity=2
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/cancel_order \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID"
  }'

```

Out

```
{
  "contract": {
    "security_type": "FUT",
    "exchange": "TAIFEX",
    "code": "TMFE6"
  },
  "order": {
    "id": "bf2ca5b0",
    "seqno": "243121",
    "ordno": "vE0FK",
    "action": "Buy",
    "price": 36216.0,
    "quantity": 2,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "F",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "octype": "New"
  },
  "status": {
    "id": "bf2ca5b0",
    "status": "Cancelled",
    "status_code": "0000",
    "web_id": "Z",
    "order_ts": 1779187550.0,
    "msg": "",
    "modified_ts": 1779187550.0,
    "modified_price": 36216.0,
    "order_quantity": 0,
    "cancel_quantity": 2,
    "deal_quantity": 0,
    "deals": []
  }
}

```

### 成交

委託單成交後，可呼叫 `update_status` 看到 `status` 轉為 `Filled`，`deals` 欄位填入成交明細。

In

```
api.update_status(api.futopt_account)
trade

```

Out

```
Trade(
    contract=Contract(
        security_type='FUT',
        exchange='TAIFEX',
        code='TMFE6'
    ),
    order=Order(
        id='bf2ca5b0',
        action=<Action.Buy: 'Buy'>,
        price=36216,
        quantity=1,
        seqno='243121',
        ordno='vE0FK',
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
        id='bf2ca5b0',
        status=<OrderStatus.Filled: 'Filled'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 5, 19, 18, 5, 50, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='Z',
        modified_time=datetime.datetime(2026, 5, 19, 18, 5, 50, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=36216,
        order_quantity=1,
        deal_quantity=1,
        deals=[
            Deal(seq='000001', price=36216, quantity=1, ts=1779187550.0)
        ]
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/trades \
  -H 'Content-Type: application/json' \
  -d '{
    "broker_id": "YOUR_BROKER_ID",
    "account_id": "YOUR_ACCOUNT_ID"
  }'

```

Out

```
[
  {
    "contract": {
      "security_type": "FUT",
      "exchange": "TAIFEX",
      "code": "TMFE6"
    },
    "order": {
      "id": "bf2ca5b0",
      "seqno": "243121",
      "ordno": "vE0FK",
      "action": "Buy",
      "price": 36216.0,
      "quantity": 1,
      "order_type": "ROD",
      "price_type": "LMT",
      "custom_field": "",
      "account": {
        "account_type": "F",
        "person_id": "YOUR_PERSON_ID",
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID",
        "signed": true,
        "username": ""
      },
      "ca": "YOUR_CA_BASE64",
      "octype": "New"
    },
    "status": {
      "id": "bf2ca5b0",
      "status": "Filled",
      "status_code": "0000",
      "web_id": "Z",
      "order_ts": 1779187550.0,
      "msg": "",
      "modified_ts": 1779187550.0,
      "modified_price": 36216.0,
      "order_quantity": 1,
      "deal_quantity": 1,
      "cancel_quantity": 0,
      "deals": [
        {
          "seq": "000001",
          "price": 36216.0,
          "quantity": 1,
          "ts": 1779187550.0
        }
      ]
    }
  }
]

```

## 範例

[期權下單範例 ( jupyter)](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/future_and_option.ipynb)

### 買賣別

買

```
order = api.Order(
    action=sj.constant.Action.Buy,
    price=14400,
    quantity=2,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.OrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

```

賣

```
order = api.Order(
    action=sj.constant.Action.Sell,
    price=14400,
    quantity=2,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.OrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

```

### ROD + LMT

ROD + LMT

```
order = api.Order(
    action=sj.constant.Action.Sell,
    price=14400,
    quantity=2,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.OrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

```
