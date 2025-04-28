Each time you `place_order`, `update_order` or `cancel_order`, by default, you will recieve an order event (or deal event) from exchange. If you don't want recieve both events, please refer to [Subscribe Trade](../../login/#subscribe-trade). We also provide interface to handle order and deal events. It's extremely helpful if you are implementing your custom trading system.

## Handle Order Callback

You can use `set_order_callback` to handle order/deal events. The example below shows custom order callback function (`order_cb`), which will print `my_order_callback` first and then print the order/deal event.

Set Order Callback

```
def order_cb(stat, msg):
    print('my_order_callback')
    print(stat, msg)

api.set_order_callback(order_cb)

```

Place Order

```
contract = api.Contracts.Stocks.TSE.TSE2890
order = api.Order(
    price=16, 
    quantity=1, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.StockPriceType.LMT, 
    order_type=sj.constant.OrderType.ROD, 
    order_lot=sj.constant.StockOrderLot.Common, 
    custom_field="test",
    account=api.stock_account
)
trade = api.place_order(contract, order)

```

```
contract = api.Contracts.Stocks.TSE.TSE2890
order = api.Order(
    price=16, 
    quantity=1, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.TFTStockPriceType.LMT, 
    order_type=sj.constant.TFTOrderType.ROD, 
    order_lot=sj.constant.TFTStockOrderLot.Common, 
    custom_field="test",
    account=api.stock_account
)
trade = api.place_order(contract, order)

```

### Order Event

Order Event

```
my_order_callback
OrderState.StockOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': '97b63e2f', 
        'seqno': '267677', 
        'ordno': 'IM394', 
        'account': {
            'account_type': 'S', 
            'person_id': '', 
            'broker_id': '9A95', 
            'account_id': '1234567', 
            'signed': True
        }, 
        'action': 'Buy', 
        'price': 16.0, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'order_cond': 'Cash', 
        'order_lot': 'Common', 
        'custom_field': 'test'
    }, 
    'status': {
        'id': '97b63e2f', 
        'exchange_ts': 1673576134.038, 
        'modified_price': 0.0, 
        'cancel_quantity': 0, 
        'order_quantity': 1, 
        'web_id': '137'
    }, 
    'contract': {
        'security_type': 'STK', 
        'exchange': 'TSE', 
        'code': '2890', 
        'symbol': '', 
        'name': '', 
        'currency': 'TWD'
    }
}

```

```
my_order_callback
OrderState.TFTOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': '97b63e2f', 
        'seqno': '267677', 
        'ordno': 'IM394', 
        'account': {
            'account_type': 'S', 
            'person_id': '', 
            'broker_id': '9A95', 
            'account_id': '1234567', 
            'signed': True
        }, 
        'action': 'Buy', 
        'price': 16.0, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'order_cond': 'Cash', 
        'order_lot': 'Common', 
        'custom_field': 'test'
    }, 
    'status': {
        'id': '97b63e2f', 
        'exchange_ts': 1673576134.038, 
        'modified_price': 0.0, 
        'cancel_quantity': 0, 
        'order_quantity': 1, 
        'web_id': '137'
    }, 
    'contract': {
        'security_type': 'STK', 
        'exchange': 'TSE', 
        'code': '2890', 
        'symbol': '', 
        'name': '', 
        'currency': 'TWD'
    }
}

```

### Deal Event

Deal Event

```
my_order_callback
OrderState.StockDeal {
    'trade_id': '9c6ae2eb', 
    'seqno': '269866', 
    'ordno': 'IN497', 
    'exchange_seq': '669915', 
    'broker_id': '9A95', 
    'account_id': '1234567', 
    'action': 'Buy', 
    'code': '2890', 
    'order_cond': 'Cash', 
    'order_lot': 'IntradayOdd', 
    'price': 267.5, 
    'quantity': 3, 
    'web_id': '137', 
    'custom_field': 'test', 
    'ts': 1673577256.354
}

```

```
my_order_callback
OrderState.TFTDeal {
    'trade_id': '9c6ae2eb', 
    'seqno': '269866', 
    'ordno': 'IN497', 
    'exchange_seq': '669915', 
    'broker_id': '9A95', 
    'account_id': '1234567', 
    'action': 'Buy', 
    'code': '2890', 
    'order_cond': 'Cash', 
    'order_lot': 'IntradayOdd', 
    'price': 267.5, 
    'quantity': 3, 
    'web_id': '137', 
    'custom_field': 'test', 
    'ts': 1673577256.354
}

```
