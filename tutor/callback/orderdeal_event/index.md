Each time you call `place_order`, `update_order`, or `cancel_order`, you will receive an order or deal event from the exchange. We also provide an interface to handle these events, which is extremely helpful if you are building your own trading system.

Note

Reserved orders (placed pre-market) do not trigger event callbacks at placement time. Reserved orders are dispatched at 08:30 each trading day, and event callbacks fire only after dispatch.

## Handle Order and Deal Events

You can use `set_order_callback` to handle order/deal events. The example below shows a custom callback function (`order_cb`) that prints `my_order_callback` first and then the order/deal event payload.

Set Order Callback

```
# Option 1: decorator
@api.on_order
def order_cb(stat, msg):
    print('my_order_callback')
    print(stat, msg)

# Option 2: traditional
def order_cb(stat, msg):
    print('my_order_callback')
    print(stat, msg)
api.set_order_callback(order_cb)

```

Place Order

```
# Contract
contract = api.Contracts.Stocks.TSE.TSE2890
# Order
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
# Place
trade = api.place_order(contract, order)

```

#### Order Event

Out

```
my_order_callback
<OrderState.StockOrder: 'SORDER'> {
    'operation': {
        'op_type': 'New',
        'op_code': '00',
        'op_msg': ''
    },
    'order': {
        'id': '892f730b',
        'seqno': '361840',
        'ordno': 'Y23CL',
        'account': {
            'account_type': 'S',
            'person_id': '',
            'broker_id': 'YOUR_BROKER_ID',
            'account_id': 'YOUR_ACCOUNT_ID',
            'signed': True,
            'username': ''
        },
        'action': 'Buy',
        'price': 26.85,
        'quantity': 1,
        'order_type': 'ROD',
        'price_type': 'LMT',
        'order_cond': 'Cash',
        'order_lot': 'Common',
        'custom_field': ''
    },
    'status': {
        'id': '892f730b',
        'exchange_ts': 1779333919.92,
        'modified_price': 0.0,
        'cancel_quantity': 0,
        'order_quantity': 1,
        'web_id': '137'
    },
    'contract': {
        'exchange': 'TSE',
        'code': '2890',
        'security_type': 'STK',
        'symbol': '',
        'name': '',
        'currency': 'TWD'
    }
}

```

#### Deal Event

Out

```
my_order_callback
<OrderState.StockDeal: 'SDEAL'> {
    'trade_id': '9c6ae2eb',
    'seqno': '269866',
    'ordno': 'IN497',
    'exchange_seq': '669915',
    'broker_id': 'YOUR_BROKER_ID',
    'account_id': 'YOUR_ACCOUNT_ID',
    'action': 'Buy',
    'code': '2890',
    'order_cond': 'Cash',
    'order_lot': 'Common',
    'price': 27.1,
    'quantity': 2,
    'web_id': '137',
    'custom_field': '',
    'ts': 1779333920.0
}

```

Receive Order/Deal Events

```
shioaji order events

```

This command streams order/deal events continuously. Press Ctrl+C to stop.

Place Order (run in another terminal)

```
shioaji order place \
  --code 2890 \
  --action buy \
  --price 27.1 \
  --quantity 2 \
  --price-type lmt \
  --order-type rod \
  --order-lot common \
  --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

**Order Event**

Out

```
{
  "state": "StockOrder",
  "data": {
    "StockOrder": {
      "operation": {"op_type": "New", "op_code": "00", "op_msg": ""},
      "order": {
        "id": "892f730b",
        "seqno": "361840",
        "ordno": "Y23CL",
        "account": {
          "account_type": "S",
          "person_id": "",
          "broker_id": "YOUR_BROKER_ID",
          "account_id": "YOUR_ACCOUNT_ID",
          "signed": true,
          "username": ""
        },
        "action": "Buy",
        "price": 26.85,
        "quantity": 1,
        "order_type": "ROD",
        "price_type": "LMT",
        "order_cond": "Cash",
        "order_lot": "Common",
        "custom_field": ""
      },
      "status": {
        "id": "892f730b",
        "exchange_ts": 1779333919.92,
        "modified_price": 0.0,
        "cancel_quantity": 0,
        "order_quantity": 1,
        "web_id": "137"
      },
      "contract": {
        "exchange": "TSE",
        "code": "2890",
        "security_type": "STK",
        "symbol": "",
        "name": "",
        "currency": "TWD"
      }
    }
  }
}

```

**Deal Event**

Out

```
{
  "state": "StockDeal",
  "data": {
    "StockDeal": {
      "trade_id": "9c6ae2eb",
      "seqno": "269866",
      "ordno": "IN497",
      "exchange_seq": "669915",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "action": "Buy",
      "code": "2890",
      "order_cond": "Cash",
      "order_lot": "Common",
      "price": 27.1,
      "quantity": 2,
      "web_id": "137",
      "custom_field": "",
      "ts": 1779333920.0
    }
  }
}

```

Receive Order/Deal Events

```
curl -N http://localhost:8080/api/v1/stream/data/order_event

```

This command streams order/deal events continuously. Press Ctrl+C to stop.

Place Order (run in another terminal)

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

**Order Event**

Out

```
event:order_event
data:{
  "state": "StockOrder",
  "data": {
    "StockOrder": {
      "operation": {"op_type": "New", "op_code": "00", "op_msg": ""},
      "order": {
        "id": "892f730b",
        "seqno": "361840",
        "ordno": "Y23CL",
        "account": {
          "account_type": "S",
          "person_id": "",
          "broker_id": "YOUR_BROKER_ID",
          "account_id": "YOUR_ACCOUNT_ID",
          "signed": true,
          "username": ""
        },
        "action": "Buy",
        "price": 26.85,
        "quantity": 1,
        "order_type": "ROD",
        "price_type": "LMT",
        "order_cond": "Cash",
        "order_lot": "Common",
        "custom_field": ""
      },
      "status": {
        "id": "892f730b",
        "exchange_ts": 1779333919.92,
        "modified_price": 0.0,
        "cancel_quantity": 0,
        "order_quantity": 1,
        "web_id": "137"
      },
      "contract": {
        "exchange": "TSE",
        "code": "2890",
        "security_type": "STK",
        "symbol": "",
        "name": "",
        "currency": "TWD"
      }
    }
  }
}

```

**Deal Event**

Out

```
event:order_event
data:{
  "state": "StockDeal",
  "data": {
    "StockDeal": {
      "trade_id": "9c6ae2eb",
      "seqno": "269866",
      "ordno": "IN497",
      "exchange_seq": "669915",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "action": "Buy",
      "code": "2890",
      "order_cond": "Cash",
      "order_lot": "Common",
      "price": 27.1,
      "quantity": 2,
      "web_id": "137",
      "custom_field": "",
      "ts": 1779333920.0
    }
  }
}

```
