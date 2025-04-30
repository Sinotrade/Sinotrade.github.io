每次您使用 `place_order`、`update_order` 或者 `cancel_order` 時，預設皆會收到來自交易所的委託或成交回報。如果您不想收到任何回報通知，您可以參考[訂閱委託回報](../../login/#subscribe-trade)將其關閉。我們亦提供了處理委託及成交回報的介面。如果您正在建立自己的交易系統，這會非常有幫助。

## 處理委託及成交回報

您可以使用 `set_order_callback` 來處理委託及成交回報。以下範例顯示，自製的委託回報函數(`order_cb`)將先 print `my_order_callback` 然後才 print 委託及成交回報。

設定委託回報函式

```
def order_cb(stat, msg):
    print('my_order_callback')
    print(stat, msg)

api.set_order_callback(order_cb)

```

下單

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

### 委託回報

委託回報

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

### 成交回報

成交回報

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
