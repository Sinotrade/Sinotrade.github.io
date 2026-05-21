Reminder

Before placing orders, you must first [login](../../login/) and [activate CA](../../prepare/terms/).

### Place Order

Both contract information (`contract`) and order information (`order`) must be provided when placing an order.

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
contract: contract (obtained via api.Contracts.Futures.*)
order:    futures order object
timeout:  timeout in milliseconds
cb:       optional callback function

```

sj.FuturesOrder

```
action (Action):                order action {Buy, Sell}
price (float or int):           price
quantity (int):                 quantity
price_type (FuturesPriceType):  price type {LMT, MKT, MKP}
order_type (OrderType):         order condition {ROD, IOC, FOK}
octype (FuturesOCType):         open/close type {Auto, New, Cover, DayTrade}
account (Account):              order account

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
contract.security_type:   security type {FUT, OPT}
contract.code:            security code
futures_order.action:     order action {Buy, Sell}
futures_order.price:      price
futures_order.quantity:   quantity
futures_order.price_type: price type {LMT, MKT, MKP}
futures_order.order_type: order condition {ROD, IOC, FOK}
futures_order.octype:     open/close type {Auto, New, Cover, DayTrade}
futures_order.account:    order account (omit to use the default futures account)

```

#### Example: Place Order

Order

```
# contract
contract = api.Contracts.Futures.TMF.TMFR1
# order
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
# place order
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

After placing the order, the exchange will send back the order/deal events. See [Order & Deal Event](../order_deal_event/stocks/) for details.

If `place_order` returns a `trade` with `status` equal to `PendingSubmit`, call `update_status` to refresh it. See [Order Status](../UpdateStatus/) for details.

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

#### Example: Update Quantity (Reduce)

Note

`update_order` can only be used to **reduce** the quantity of an order.

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

### Deal

After an order is filled, calling `update_status` will show `status` transitioning to `Filled` and the `deals` field populated with execution details.

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

## Examples

[Future and Option place order jupyter link](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/future_and_option.ipynb)

### Action

Buy

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

Sell

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
