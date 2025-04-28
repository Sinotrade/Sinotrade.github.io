Reminder

First, you need to [login](../../login/) and [activate CA](../../prepare/terms/).

### Futures Order

Order Attributes

```
price (float or int): the price of order
quantity (int): the quantity of order
action (str): order action to buy or sell
    {Buy, Sell}
price_type (str): pricing type of order
    {LMT, MKT, MKP}
order_type (str): the type of order
    {ROD, IOC, FOK}
octype (str): the type or order to open new position or close position future only
    {Auto, New, Cover, DayTrade} (自動、新倉、平倉、當沖)
account (:obj:Account): which account to place this order
ca (binary): the ca of this order

```

### Place Order

Product information ( `contract`) and order information ( `order`) must be provided when placing an order.

Place Order

```
api.place_order?

    Signature:
        api.place_order(
            contract: shioaji.contracts.Contract,
            order: shioaji.order.Order,
            timeout: int = 5000,
            cb: Callable[[shioaji.order.Trade], NoneType] = None,
        ) -> shioaji.order.Trade
    Docstring:
    placing order

```

Contract

```
contract = api.Contracts.Futures.TXF.TXF202301

```

Order

```
order = api.Order(
    action=sj.constant.Action.Buy,
    price=14400,
    quantity=3,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.OrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

```

```
order = api.Order(
    action=sj.constant.Action.Buy,
    price=14400,
    quantity=3,
    price_type=sj.constant.FuturesPriceType.LMT,
    order_type=sj.constant.FuturesOrderType.ROD, 
    octype=sj.constant.FuturesOCType.Auto,
    account=api.futopt_account
)

```

Place Order

```
trade = api.place_order(contract, order)
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
        limit_up=16270.0, 
        limit_down=13312.0, 
        reference=14791.0, 
        update_date='2023/01/12'
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=14400, 
        quantity=3, 
        id='5efffde1', 
        seqno='000004', 
        ordno='000003', 
        account=Account(
            account_type=<AccountType.Future: 'F'>,
            person_id='A123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(
        id='5efffde1', 
        status=<Status.PendingSubmit: 'PendingSubmit'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 14, 56, 13, 995651), 
        deals=[]
    )
)

```

After `place_order`, you will also receive the information sent back from the exchange. For details, please refer to [Order & Deal Event](../order_deal_event/stocks/).

To update the `trade` status, you need to call `update_status`.

Update Status

```
api.update_status(api.futopt_account)
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
        limit_up=16270.0, 
        limit_down=13312.0, 
        reference=14791.0, 
        update_date='2023/01/12'
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=14400, 
        quantity=3, 
        id='5efffde1', 
        seqno='000004', 
        ordno='000003', 
        account=Account(
            account_type=<AccountType.Future: 'F'>,
            person_id='A123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(
        id='5efffde1', 
        status=<Status.Submitted: 'Submitted'>,
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 14, 56, 13, 995651), 
        deals=[]
    )
)

```

Status of Trade

- `PendingSubmit`: Sending
- `PreSubmitted`: Reservation
- `Submitted`: Send Successfully
- `Failed`: Failed
- `Cancelled`: Cancelled
- `Filled`: Complete Fill
- `Filling`: Part Fill

### Update Order

Update Order

```
api.update_order?

    Signature:
        api.update_order(
            trade: shioaji.order.Trade,
            price: Union[pydantic.types.StrictInt, float] = None,
            qty: int = None,
            timeout: int = 5000,
            cb: Ca  lable[[shioaji.order.Trade], NoneType] = None,
        ) -> shioaji.order.Trade
    Docstring: update the order price or qty

```

#### Update Price

Update Price

```
api.update_order(trade=trade, price=14450)
api.update_status(api.futopt_account)
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
        limit_up=16270.0, 
        limit_down=13312.0, 
        reference=14791.0, 
        update_date='2023/01/12'
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=14400, 
        quantity=3, 
        id='5efffde1', 
        seqno='000004', 
        ordno='000003', 
        account=Account(
            account_type=<AccountType.Future: 'F'>,
            person_id='A123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(
        id='5efffde1', 
        status=<Status.Submitted: 'Submitted'>,
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 14, 56, 13, 995651), 
        modified_price=14450,
        order_quantity=3,
        deals=[]
    )
)

```

#### Update Quantity (Reduce)

`update_order` can only reduce the quantity of the order.

Update Quantity

```
api.update_order(trade=trade, qty=1)
api.update_status(api.futopt_account)
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
        limit_up=16270.0, 
        limit_down=13312.0, 
        reference=14791.0, 
        update_date='2023/01/12'
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=14400, 
        quantity=3, 
        id='5efffde1', 
        seqno='000004', 
        ordno='000003', 
        account=Account(
            account_type=<AccountType.Future: 'F'>,
            person_id='A123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(
        id='5efffde1', 
        status=<Status.Submitted: 'Submitted'>,
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 14, 56, 13, 995651), 
        order_quantity=3,
        cancel_quantity=1,
        deals=[]
    )
)

```

### Cancel Order

Cancel Order

```
api.cancel_order(trade)
api.update_status(api.futopt_account)
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
        limit_up=16270.0, 
        limit_down=13312.0, 
        reference=14791.0, 
        update_date='2023/01/12'
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=14400, 
        quantity=3, 
        id='5efffde1', 
        seqno='000004', 
        ordno='000003', 
        account=Account(
            account_type=<AccountType.Future: 'F'>,
            person_id='A123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(
        id='5efffde1', 
        status=<Status.Cancelled: 'Cancelled'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 14, 56, 13, 995651), 
        order_quantity=3,
        cancel_quantity=3,
        deals=[]
    )
)

```

### Deal

Update Status

```
api.update_status(api.futopt_account)
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
        limit_up=16270.0, 
        limit_down=13312.0, 
        reference=14791.0, 
        update_date='2023/01/12'
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=14400, 
        quantity=3, 
        id='5efffde1', 
        seqno='000004', 
        ordno='000003', 
        account=Account(
            account_type=<AccountType.Future: 'F'>,
            person_id='A123456789', 
            broker_id='F002000', 
            account_id='1234567', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>
    ), 
    status=OrderStatus(
        id='5efffde1', 
        status=<Status.Filled: 'Filled'>,
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 14, 56, 13, 995651), 
        order_quantity=3,
        deals=[
            Deal(seq='000001', price=14400, quantity=3, ts=1673501631.62918)
        ]
    )
)

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
