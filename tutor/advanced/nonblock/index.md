Blocking is a pattern where a function must wait for something to complete. Every function is waiting, whether it is doing I/O or doing CPU tasks. For example, if the function tries to get data from the database, it needs to stop and wait for the return result, and then continue processing the next task after receiving the return result. In contrast, non-blocking mode does not wait for operations to complete. Non-blocking mode is useful if you are trying to send batch operation in a short period of time. We provide the following examples to give you a better understanding of the difference.

To switch blocking/non-blocking mode use parameter `timeout`. Set the API parameter `timeout` to `0` for non-blocking mode. The default value of `timeout` is 5000 (milliseconds), which means the function waits for up to 5 seconds.

### Non-Blocking Place Order

Set `timeout = 0` in `place_order` function.

In

```
contract = api.Contracts.Futures.TXF['TXF202301']
order = api.Order(
    action=sj.constant.Action.Sell,
    price=14000,
    quantity=1,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)
trade = api.place_order(contract, order, timeout=0)
trade

```

Out

```
Trade(
    contract=Future(
        code='TXFA3', 
        symbol='TXF202301', 
        name='臺股期貨01', 
        category='TXF', 
        delivery_month='202301', 
        delivery_date='2023/01/30', 
        underlying_kind='I', 
        unit=1, 
        limit_up=16241.0, 
        limit_down=13289.0, 
        reference=14765.0, 
        update_date='2023/01/10'
    ), 
    order=Order(
        action=<Action.Sell: 'Sell'>, 
        price=14000, 
        quantity=1, 
        account=FutureAccount(
            person_id='F123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True, 
            username='PAPIUSER'
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(status=<Status.Inactive: 'Inactive'>)
)

```

The `Trade` object obtained in non-blocking mode will lack some information because the order is still in transit and has not been sent to the exchange. There are no `id` and `seqno` in the `Order` object, `id`, `status_code`, `order_datetime` and `deals` are missing in the `OrderStatus` object, and `status` is displayed as `Inactive`. In the non-blocking mode, there are two ways to obtain the above-mentioned information: \`\`order event callback`and`non-blocking place order callback\`.

#### Order event callback

Out

```
OrderState.FuturesOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': 'de616839', 
        'seqno': '500009', 
        'ordno': '000009', 
        'action': 'Sell', 
        'price': 14000, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'oc_type': 'Auto', 
        'custom_field': ''
    }, 
    'status': {
        'id': 'de616839', 
        'exchange_ts': 1673334371.492948, 
        'order_quantity': 1, 
        'modified_price': 0, 
        'cancel_quantity': 0, 
        'web_id': 'Z'
    }, 
    'contract': {
        'security_type': 'FUT', 
        'exchange': 'TAIFEX', 
        'code': 'TXFA3'
    }
}

```

#### Non-blocking place order callback

In

```
from shioaji.order import Trade

def non_blocking_cb(trade:Trade):
    print('__my_callback__')
    print(trade)

trade = api.place_order(
    contract, 
    order, 
    timeout=0, 
    cb=non_blocking_cb # only work in non-blocking mode
)

```

Out: place order callback

```
__my_callback__
contract=Future(
    code='TXFA3', 
    symbol='TXF202301', 
    name='臺股期貨01', 
    category='TXF', 
    delivery_month='202301', 
    delivery_date='2023/01/30', 
    underlying_kind='I', 
    unit=1, 
    limit_up=16241.0, 
    limit_down=13289.0, 
    reference=14765.0, 
    update_date='2023/01/10'
), 
order=Order(
    action=<Action.Sell: 'Sell'>, 
    price=14000, 
    quantity=1, 
    id='40fd85d6', 
    seqno='958433', 
    ordno='kY01g', 
    account=FutureAccount(
        person_id='F123456789', 
        broker_id='F002000', 
        account_id='1234567', 
        signed=True, 
        username='PAPIUSER'
    ), 
    price_type=<StockPriceType.LMT: 'LMT'>, 
    order_type=<OrderType.ROD: 'ROD'>
), 
status=OrderStatus(
    id='40fd85d6', 
    status=<Status.Submitted: 'Submitted'>, 
    status_code='    ', 
    order_datetime=datetime.datetime(2023, 01, 10, 15, 14, 32), 
    deals=[]
)

```

### Compare both modes

In non-wait mode, executing `place_order` takes about 0.01 seconds, which is 12 times faster than the execution time in blocking mode. Although it is more efficient to place order in the non-blocking mode, the order will not take effect until the exchange receives the order.

contract and order

```
contract = api.Contracts.Futures.TXF['TXF202301']
order = api.Order(
    action='Sell',
    price=14000,
    quantity=1,
    price_type='LMT',
    order_type='ROD', 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

```

Blocking

```
start_time = time.time()
api.place_order(contract, order) # block and wait for the order response
print(time.time() - start_time)
# 0.136578369140625 <- may be different

```

Non-Blocking

```
start_time = time.time()
api.place_order(contract, order, timeout=0) # non-block, the order is in transmition (inactive).
print(time.time() - start_time)
# 0.011670351028442383 <- may be different

```

Non-Blocking mode Supported Function

```
- place_order
- update_order
- cancel_order
- update_status
- list_positions
- list_position_detail
- list_profit_loss
- list_profit_loss_detail
- list_profit_loss_summary
- settlements
- margin
- ticks
- kbars

```
