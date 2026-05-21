Reminder

Before placing orders, you must first [login](../../login/) and [activate CA](../../prepare/terms/).

### Place Order

Both contract information (`contract`) and order information (`order`) must be provided when placing an order.

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
contract: contract (obtained via api.Contracts.Stocks.*)
order:    stock order object
timeout:  timeout in milliseconds
cb:       optional callback function

```

sj.StockOrder

```
action (Action):              order action {Buy, Sell}
price (float or int):         price
quantity (int):               quantity
price_type (StockPriceType):  price type {LMT: limit, MKT: market}
order_type (OrderType):       order condition {ROD, IOC, FOK}
order_lot (StockOrderLot):    order lot {Common: common, Fixing: fixing, Odd: odd, IntradayOdd: intraday odd}
order_cond (StockOrderCond):  order category {Cash, MarginTrading, ShortSelling}
daytrade_short (bool):        sell first then buy back
custom_field (str):           memo, only letters and digits, max length 6
account (Account):            order account

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
--code:          security code
--action:        order action {buy, sell}
--price:         price (set 0 for market orders)
--quantity:      quantity
--price-type:    price type {lmt, mkt}
--order-type:    order condition {rod, ioc, fok}
--order-lot:     order lot {common, fixing, odd, intraday-odd}
--order-cond:    order category {cash, margin-trading, short-selling}
--account:       order account (BROKER_ID-ACCOUNT_ID format)
--security-type: security type, default STK
--no-wait:       skip waiting for order events after placing

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
contract.exchange:          exchange {TSE, OTC}
contract.code:              security code
stock_order.action:         order action {Buy, Sell}
stock_order.price:          price
stock_order.quantity:       quantity
stock_order.price_type:     price type {LMT, MKT}
stock_order.order_type:     order condition {ROD, IOC, FOK}
stock_order.order_lot:      order lot {Common, Fixing, Odd, IntradayOdd}
stock_order.order_cond:     order category {Cash, MarginTrading, ShortSelling}
stock_order.daytrade_short: sell first then buy back
stock_order.custom_field:   memo, only letters and digits, max length 6
stock_order.account:        order account (omit to use the default stock account)

```

#### Example: Place Order

Order

```
# contract
contract = api.Contracts.Stocks.TSE.TSE2890
# order
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
# place order
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

After placing the order, the exchange will send back the order/deal events. See [Order & Deal Event](../order_deal_event/stocks/) for details.

If `place_order` returns a `trade` with `status` equal to `PendingSubmit`, call `update_status` to refresh it. See [Order Status](../UpdateStatus/) for details.

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

After placing the order, the exchange will send back the order/deal events. See [Order & Deal Event](../order_deal_event/stocks/) for details.

If `shioaji order place` returns `status` equal to `PendingSubmit`, run `shioaji order list` to refresh it. See [Order Status](../UpdateStatus/) for details.

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

After placing the order, the exchange will send back the order/deal events. See [Order & Deal Event](../order_deal_event/stocks/) for details.

If `POST /api/v1/order/place_order` returns `status` equal to `PendingSubmit`, call `POST /api/v1/order/trades` to refresh it. See [Order Status](../UpdateStatus/) for details.

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

Order Status

- `PendingSubmit`: sending
- `PreSubmitted`: reservation
- `Submitted`: send successfully
- `Failed`: failed
- `Cancelled`: cancelled
- `Filled`: complete fill
- `PartFilled`: part fill

### Update Order

To update an order, the original `trade` object must be provided. There are two ways to update — by price or by quantity; quantity updates can only decrease.

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
trade:    order object
price:    new price (provide when updating price)
qty:      new quantity (provide when updating quantity, decrease only)
timeout:  timeout in milliseconds
cb:       optional callback function

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
trade_id: trade ID (from the status.id in the place response)
price:    new price
quantity: new quantity (decrease only)

```

Note

Before updating an order, call `update_status` first to obtain the order number (`ordno`).

#### Example: Update Price

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

#### Example: Update Quantity (Reduce)

Note

`update_order` can only be used to **reduce** the quantity of an order.

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

### Cancel Order

To cancel an order, the original `trade` object must be provided.

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
trade:   order object
timeout: timeout in milliseconds
cb:      optional callback function

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
trade_id: trade ID (from the status.id in the place response)

```

Note

Before cancelling an order, call `update_status` first to obtain the order number (`ordno`).

#### Example: Cancel Order

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

### Deal

After an order is filled, calling `update_status` will show `status` transitioning to `Filled` and the `deals` field populated with execution details.

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

## Examples

[Stock place order jupyter link](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/stock.ipynb)

### Action

Buy

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

Sell

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
