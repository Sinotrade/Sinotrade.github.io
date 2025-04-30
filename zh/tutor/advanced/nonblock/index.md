阻塞(Blocking)模式為函數必須等待某事完成。每個函數都是等待的，不管是在做 I/O 還是在做 CPU 任務。舉例來說，如果函數試圖從資料庫中獲取數據，那麼它需要停下來等待回傳結果，收到回傳結果後，才會繼續處理接下來的任務。相反地，非阻塞(non-blocking)模式，不會等待操作完成。如果您嘗試在短時間內發送批量操作，則非阻塞模式非常有用。我們提供以下範例讓您更了解之間的區別。

切換阻塞/非阻塞模式為利用參數`timeout`。將API參數`timeout`設置為`0`為非阻塞模式。`timeout`預設值為 5000（毫秒），表示該函數最多等待 5 秒。

### 非阻塞模式下單

將`place_order` 函數中設置 `timeout = 0`。

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

在非阻塞模式中取得的`Trade`物件，因為委託單仍在傳輸中還未送至交易所，所以會缺少一些資訊。在`Order`物件中沒有`id`和`seqno`，`OrderStatus`物件中沒有 `id`、`status_code`、`order_datetime` 和 `deals`，`status`顯示為`Inactive`。在非阻塞模式中要取得上述提到的資訊可利用`委託回報`和`非阻塞模式下單回調`兩種方式。

#### 委託回報

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

#### 非阻塞模式下單回調

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

### 比較兩者模式

在非阻塞模式下，執行 `place_order` 大約需要 0.01 秒，這比阻塞模式下的執行時間快 12 倍。雖然非阻塞模式下單效率更高，需等待交易所收到委託後，委託單才會生效。

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

支援非等待模式的函數

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
