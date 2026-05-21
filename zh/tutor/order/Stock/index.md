提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

### 下單

下單時必須提供商品資訊`contract`及下單資訊`order`。

place_order

```
api.place_order?

Signature:
    api.place_order(
        contract: sj.Stock,
        order: sj.StockOrder,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.Trade], None]] = None,
    ) -> sj.Trade
Docstring:
    placing order

```

Parameters

```
contract: 商品檔（由 api.Contracts.Stocks.* 取得）
order:    證券委託單物件
timeout:  逾時毫秒
cb:       選填，callback 函式

```

sj.StockOrder

```
action (Action):              買賣別 {Buy: 買, Sell: 賣}
price (float or int):         價格
quantity (int):               數量
price_type (StockPriceType):  價格別 {LMT: 限價, MKT: 市價}
order_type (OrderType):       委託條件 {ROD, IOC, FOK}
order_lot (StockOrderLot):    委託別 {Common: 整股, Fixing: 定盤, Odd: 盤後零股, IntradayOdd: 盤中零股}
order_cond (StockOrderCond):  委託種類 {Cash: 現股, MarginTrading: 融資, ShortSelling: 融券}
daytrade_short (bool):        先賣後買
custom_field (str):           備註，只允許輸入大小寫英文字母及數字，且長度最長為 6
account (Account):            下單帳號

```

place_order

```
$ shioaji order place --help

Place a stock or futures order

Usage: shioaji order place [OPTIONS] --code <CODE> --action <ACTION> --quantity <QUANTITY>

Options:
      --code <CODE>                    Security code
      --action <ACTION>                Buy or sell
      --price <PRICE>                  Order price (0 for market orders) [default: 0]
      --quantity <QUANTITY>            Order quantity
      --price-type <PRICE_TYPE>        Price type: lmt, mkt [default: lmt]
      --order-type <ORDER_TYPE>        Order type [default: rod]
      --order-lot <ORDER_LOT>          Stock order lot type
      --order-cond <ORDER_COND>        Stock order condition
      --account <ACCOUNT>              Account in BROKER_ID-ACCOUNT_ID format
      --security-type <SECURITY_TYPE>  Security type hint for contract lookup: STK, FUT, OPT, IND [default: STK]
      --no-wait                        Skip waiting for order events after placing

```

Parameters

```
--code:          商品代碼
--action:        買賣別 {buy, sell}
--price:         價格（市價單填 0）
--quantity:      數量
--price-type:    價格別 {lmt, mkt}
--order-type:    委託條件 {rod, ioc, fok}
--order-lot:     委託別 {common, fixing, odd, intraday-odd}
--order-cond:    委託種類 {cash, margin-trading, short-selling}
--account:       下單帳號（BROKER_ID-ACCOUNT_ID 格式）
--security-type: 商品類型，預設 STK
--no-wait:       下單後不等委託事件

```

place_order

```
POST /api/v1/order/place_order
Content-Type: application/json

{
  "contract": { "security_type": "STK", "exchange": <Exchange>, "code": <string> },
  "stock_order": {
    "action": <Action>,
    "price": <number>,
    "quantity": <integer>,
    "price_type": <StockPriceType>,
    "order_type": <OrderType>,
    "order_lot": <StockOrderLot>,
    "order_cond": <StockOrderCond>,
    "daytrade_short": <boolean>,
    "custom_field": <string>,
    "account": { "broker_id": <string>, "account_id": <string> }
  }
}

```

Parameters

```
contract.exchange:          交易所 {TSE, OTC}
contract.code:              商品代碼
stock_order.action:         買賣別 {Buy, Sell}
stock_order.price:          價格
stock_order.quantity:       數量
stock_order.price_type:     價格別 {LMT, MKT}
stock_order.order_type:     委託條件 {ROD, IOC, FOK}
stock_order.order_lot:      委託別 {Common, Fixing, Odd, IntradayOdd}
stock_order.order_cond:     委託種類 {Cash, MarginTrading, ShortSelling}
stock_order.daytrade_short: 先賣後買
stock_order.custom_field:   備註，只允許輸入大小寫英文字母及數字，且長度最長為 6
stock_order.account:        下單帳號（省略則使用預設證券帳號）

```

#### 範例：下單

Order

```
# 商品檔
contract = api.Contracts.Stocks.TSE.TSE2890
# 委託內容
order = sj.StockOrder(
    action=sj.Action.Buy,
    price=27.1,
    quantity=2,
    price_type=sj.StockPriceType.LMT,
    order_type=sj.OrderType.ROD,
    order_lot=sj.StockOrderLot.Common,
    order_cond=sj.StockOrderCond.Cash,
    account=api.stock_account,
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
        security_type='STK',
        exchange='TSE',
        code='2890',
        target_code=''
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
            username='YOUR_USERNAME'
        ),
        order_cond=<StockOrderCond.Cash: 'Cash'>,
        order_lot=<StockOrderLot.Common: 'Common'>
    ),
    status=OrderStatus(
        id='a647f23d',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='0',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        msg='委託成功'
    )
)

```

下單完成後會收到交易所傳回的下單回報訊息，詳情內容可詳見[下單回報](../order_deal_event/stocks/)。

`place_order` 回傳的 `trade` 狀態若為 `PendingSubmit`，可執行 `update_status` 主動更新，詳見[委託狀態](../UpdateStatus/)。

In

```
api.update_status(api.stock_account)
trade

```

Out

```
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
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        order_quantity=2
    )
)

```

In

```
shioaji order place \
  --code 2890 \
  --action buy \
  --price 27.1 \
  --quantity 2 \
  --price-type lmt \
  --order-type rod \
  --order-lot common \
  --order-cond cash \
  --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
contract:
  security_type: STK
  exchange: TSE
  code: "2890"
  target_code: ""
order:
  id: c7b2fe06
  seqno: "104263"
  ordno: Y3JS0
  action: Buy
  price: 27
  quantity: 1
  order_type: ROD
  price_type: LMT
  custom_field: ""
  account:
    account_type: S
    person_id: YOUR_PERSON_ID
    broker_id: YOUR_BROKER_ID
    account_id: YOUR_ACCOUNT_ID
    signed: true
    username: YOUR_USERNAME
  ca: YOUR_CA_BASE64
  order_cond: Cash
  order_lot: Common
status:
  id: c7b2fe06
  status: PendingSubmit
  status_code: "0"
  web_id: ""
  order_ts: 1779168189
  msg: 委託成功
  modified_ts: 0
  modified_price: 0
  order_quantity: 0
  deal_quantity: 0
  cancel_quantity: 0
  deals[0]:

```

下單完成後會收到交易所傳回的下單回報訊息，詳情內容可詳見[下單回報](../order_deal_event/stocks/)。

`shioaji order place` 回傳的 `status` 若為 `PendingSubmit`，可執行 `shioaji order list` 主動更新，詳見[委託狀態](../UpdateStatus/)。

In

```
shioaji order list

```

Out

```
[1]:
  - contract:
      security_type: STK
      exchange: TSE
      code: "2890"
    order:
      id: c7b2fe06
      seqno: "104263"
      ordno: Y3JS0
      action: Buy
      price: 27
      quantity: 1
      order_type: ROD
      price_type: LMT
      custom_field: ""
      account:
        account_type: S
        person_id: YOUR_PERSON_ID
        broker_id: YOUR_BROKER_ID
        account_id: YOUR_ACCOUNT_ID
        signed: true
        username: ""
      ca: YOUR_CA_BASE64
      order_cond: Cash
      order_lot: Common
    status:
      id: c7b2fe06
      status: Submitted
      status_code: "00"
      web_id: "137"
      order_ts: 1779168189
      msg: ""
      modified_ts: 1779168189
      modified_price: 0
      order_quantity: 1
      deal_quantity: 0
      cancel_quantity: 0
      deals[0]:

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {"security_type": "STK", "exchange": "TSE", "code": "2890"},
    "stock_order": {
      "action": "Buy",
      "price": 27.1,
      "quantity": 2,
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
  "contract": {
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "target_code": ""
  },
  "order": {
    "id": "90681873",
    "seqno": "218626",
    "ordno": "Y2CO1",
    "action": "Buy",
    "price": 27.1,
    "quantity": 2,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": "YOUR_USERNAME"
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "Common"
  },
  "status": {
    "id": "90681873",
    "status": "PendingSubmit",
    "status_code": "0",
    "web_id": "",
    "order_ts": 1779248594.0,
    "msg": "委託成功",
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
      "security_type": "STK",
      "exchange": "TSE",
      "code": "2890"
    },
    "order": {
      "id": "90681873",
      "seqno": "218626",
      "ordno": "Y2CO1",
      "action": "Buy",
      "price": 27.1,
      "quantity": 2,
      "order_type": "ROD",
      "price_type": "LMT",
      "custom_field": "",
      "account": {
        "account_type": "S",
        "person_id": "YOUR_PERSON_ID",
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID",
        "signed": true,
        "username": ""
      },
      "ca": "YOUR_CA_BASE64",
      "order_cond": "Cash",
      "order_lot": "Common"
    },
    "status": {
      "id": "90681873",
      "status": "Submitted",
      "status_code": "00",
      "web_id": "137",
      "order_ts": 1779248594.0,
      "msg": "",
      "modified_ts": 1779248594.0,
      "modified_price": 0.0,
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
api.update_order(trade=trade, price=27.2)
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Contract(
        security_type='STK',
        exchange='TSE',
        code='2890'
    ),
    order=Order(
        id='6b6cf6bc',
        action=<Action.Buy: 'Buy'>,
        price=27.1,
        quantity=1,
        seqno='215654',
        ordno='Y29J1',
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
        id='6b6cf6bc',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 32, 38, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 11, 32, 45, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=27.2,
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
    "price": 27.2
  }'

```

Out

```
{
  "contract": {
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890"
  },
  "order": {
    "id": "a06a418e",
    "seqno": "221976",
    "ordno": "Y2HD6",
    "action": "Buy",
    "price": 27.2,
    "quantity": 1,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "Common"
  },
  "status": {
    "id": "a06a418e",
    "status": "Submitted",
    "status_code": "00",
    "web_id": "137",
    "order_ts": 1779249680.0,
    "msg": "",
    "modified_ts": 1779249680.0,
    "modified_price": 0.0,
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
api.update_status(api.stock_account)
trade

```

Out

```
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
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 11, 24, 35, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
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
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890"
  },
  "order": {
    "id": "90681873",
    "seqno": "218626",
    "ordno": "Y2CO1",
    "action": "Buy",
    "price": 27.1,
    "quantity": 1,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "Common"
  },
  "status": {
    "id": "90681873",
    "status": "Submitted",
    "status_code": "00",
    "web_id": "137",
    "order_ts": 1779248594.0,
    "msg": "",
    "modified_ts": 1779248627.0,
    "modified_price": 0.0,
    "order_quantity": 1,
    "deal_quantity": 0,
    "cancel_quantity": 1,
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
api.update_status(api.stock_account)
trade

```

Out

```
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
        status=<OrderStatus.Cancelled: 'Cancelled'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 11, 24, 41, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
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
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890"
  },
  "order": {
    "id": "90681873",
    "seqno": "218626",
    "ordno": "Y2CO1",
    "action": "Buy",
    "price": 27.1,
    "quantity": 2,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "Common"
  },
  "status": {
    "id": "90681873",
    "status": "Cancelled",
    "status_code": "00",
    "web_id": "137",
    "order_ts": 1779248594.0,
    "msg": "",
    "modified_ts": 1779248627.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 2,
    "deals": []
  }
}

```

### 成交

委託單成交後，可呼叫 `update_status` 看到 `status` 轉為 `Filled`，`deals` 欄位填入成交明細。

In

```
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Contract(
        security_type='STK',
        exchange='TSE',
        code='2890'
    ),
    order=Order(
        id='a06a418e',
        action=<Action.Buy: 'Buy'>,
        price=27.2,
        quantity=1,
        seqno='221976',
        ordno='Y2HD6',
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
        id='a06a418e',
        status=<OrderStatus.Filled: 'Filled'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 12, 1, 20, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 12, 1, 20, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        order_quantity=1,
        deal_quantity=1,
        deals=[
            Deal(seq='000001', price=27.2, quantity=1, ts=1779249680.0)
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
      "security_type": "STK",
      "exchange": "TSE",
      "code": "2890"
    },
    "order": {
      "id": "a06a418e",
      "seqno": "221976",
      "ordno": "Y2HD6",
      "action": "Buy",
      "price": 27.2,
      "quantity": 1,
      "order_type": "ROD",
      "price_type": "LMT",
      "custom_field": "",
      "account": {
        "account_type": "S",
        "person_id": "YOUR_PERSON_ID",
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID",
        "signed": true,
        "username": ""
      },
      "ca": "YOUR_CA_BASE64",
      "order_cond": "Cash",
      "order_lot": "Common"
    },
    "status": {
      "id": "a06a418e",
      "status": "Filled",
      "status_code": "00",
      "web_id": "137",
      "order_ts": 1779249680.0,
      "msg": "",
      "modified_ts": 1779249680.0,
      "modified_price": 0.0,
      "order_quantity": 1,
      "deal_quantity": 1,
      "cancel_quantity": 0,
      "deals": [
        {
          "seq": "000001",
          "price": 27.2,
          "quantity": 1,
          "ts": 1779249680.0
        }
      ]
    }
  }
]

```

## 範例

[證券下單範例 ( jupyter)](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/stock.ipynb)

### 買賣別

買

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.StockPriceType.LMT, 
    order_type=sj.constant.OrderType.ROD, 
    order_lot=sj.constant.StockOrderLot.Common, 
    custom_field="test",
    account=api.stock_account
)

```

賣

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Sell, 
    price_type=sj.constant.StockPriceType.LMT, 
    order_type=sj.constant.OrderType.ROD, 
    order_lot=sj.constant.StockOrderLot.Common, 
    custom_field="test",
    account=api.stock_account
)

```

Daytrade Short

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Sell,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_lot=sj.constant.StockOrderLot.Common,
    daytrade_short=True,
    custom_field="test",
    account=api.stock_account
)

```

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Sell,
    price_type=sj.constant.TFTStockPriceType.LMT, 
    order_type=sj.constant.TFTOrderType.ROD, 
    order_lot=sj.constant.TFTStockOrderLot.Common, 
    first_sell=sj.constant.StockFirstSell.Yes,
    custom_field="test",
    account=api.stock_account
)

```

### ROD + LMT

ROD + LMT

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Sell,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    order_lot=sj.constant.StockOrderLot.Common,
    custom_field="test",
    account=api.stock_account
)

```

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Sell,
    price_type=sj.constant.TFTStockPriceType.LMT, 
    order_type=sj.constant.TFTOrderType.ROD, 
    order_lot=sj.constant.TFTStockOrderLot.Common, 
    custom_field="test",
    account=api.stock_account
)

```
