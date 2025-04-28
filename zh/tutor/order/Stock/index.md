Reminder

First, you need to [login](../../login/) and [activate CA](../../prepare/terms/).

### Stock Order

Order Attributes

```
price (float or int): the price of order
quantity (int): the quantity of order
action (str): order action to buy or sell
    {Buy, Sell}
price_type (str): pricing type of order
    {LMT, MKT, MKP} (限價、市價、範圍市價)
order_type (str): the type of order
    {ROD, IOC, FOK}
order_cond (str): order condition stock only
    {Cash, MarginTrading, ShortSelling} (現股、融資、融券)
order_lot (str): the type of order
    {Common, Fixing, Odd, IntradayOdd} (整股、定盤、盤後零股、盤中零股)
daytrade_short {bool}: the type of first sell
    {True, False}
custom_field {str}: memo field, only letters and numbers are allowed, and the maximum length is 6.
account (:obj:Account): which account to place this order
ca (binary): the ca of this order

```

```
price (float or int): the price of order
quantity (int): the quantity of order
action (str): order action to buy or sell
    {Buy, Sell}
price_type (str): pricing type of order
    {LMT, MKT, MKP} (限價、市價、範圍市價)
order_type (str): the type of order
    {ROD, IOC, FOK}
order_cond (str): order condition stock only
    {Cash, MarginTrading, ShortSelling} (現股、融資、融券)
order_lot (str): the type of order
    {Common, Fixing, Odd, IntradayOdd} (整股、定盤、盤後零股、盤中零股)
first_sell {str}: the type of first sell
    {true, false}
custom_field {str}: memo field, only letters and numbers are allowed, and the maximum length is 6.
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
contract = api.Contracts.Stocks.TSE.TSE2890

```

Order

```
order = api.Order(
    price=17, 
    quantity=3, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.StockPriceType.LMT, 
    order_type=sj.constant.OrderType.ROD, 
    order_lot=sj.constant.StockOrderLot.Common, 
    # daytrade_short=False,
    custom_field="test",
    account=api.stock_account
)

```

```
order = api.Order(
    price=17, 
    quantity=3, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.TFTStockPriceType.LMT, 
    order_type=sj.constant.TFTOrderType.ROD, 
    order_lot=sj.constant.TFTStockOrderLot.Common, 
    # first_sell=sj.constant.StockFirstSell.No,
    custom_field="test",
    account=api.stock_account
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
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='2890', 
        symbol='TSE2890', 
        name='永豐金', 
        category='17', 
        unit=1000, 
        limit_up=19.05, 
        limit_down=15.65, 
        reference=17.35, 
        update_date='2023/01/12',
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=17, 
        quantity=3, 
        id='531e27af', 
        seqno='000002', 
        ordno='000001', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>,
            person_id='A123456789', 
            broker_id='9A95', 
            account_id='1234567', 
            signed=True
        ), 
        custom_field='test', 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        daytrade_short=False
    ), 
    status=OrderStatus(
        id='531e27af', 
        status=<Status.PendingSubmit: 'PendingSubmit'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        deals=[]
    )
)

```

After `place_order`, you will also receive the information sent back from the exchange. For details, please refer to [Order & Deal Event](../order_deal_event/stocks/).

To update the `trade` status, you need to call `update_status`.

Update Status

```
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='2890', 
        symbol='TSE2890', 
        name='永豐金', 
        category='17', 
        unit=1000, 
        limit_up=19.05, 
        limit_down=15.65, 
        reference=17.35, 
        update_date='2023/01/12',
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=17, 
        quantity=3, 
        id='531e27af', 
        seqno='000002', 
        ordno='000001', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>,
            person_id='A123456789', 
            broker_id='9A95', 
            account_id='1234567', 
            signed=True
        ), 
        custom_field='test', 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        daytrade_short=False
    ), 
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        order_quantity=3,
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
api.update_order(trade=trade, price=17.5)
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='2890', 
        symbol='TSE2890', 
        name='永豐金', 
        category='17', 
        unit=1000, 
        limit_up=19.05, 
        limit_down=15.65, 
        reference=17.35, 
        update_date='2023/01/12',
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=17, 
        quantity=3, 
        id='531e27af', 
        seqno='000002', 
        ordno='000001', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>,
            person_id='A123456789', 
            broker_id='9A95', 
            account_id='1234567', 
            signed=True
        ), 
        custom_field='test', 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        daytrade_short=False
    ), 
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        modified_price=17.5,
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
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='2890', 
        symbol='TSE2890', 
        name='永豐金', 
        category='17', 
        unit=1000, 
        limit_up=19.05, 
        limit_down=15.65, 
        reference=17.35, 
        update_date='2023/01/12',
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=17, 
        quantity=3, 
        id='531e27af', 
        seqno='000002', 
        ordno='000001', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>,
            person_id='A123456789', 
            broker_id='9A95', 
            account_id='1234567', 
            signed=True
        ), 
        custom_field='test', 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        daytrade_short=False
    ), 
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
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
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='2890', 
        symbol='TSE2890', 
        name='永豐金', 
        category='17', 
        unit=1000, 
        limit_up=19.05, 
        limit_down=15.65, 
        reference=17.35, 
        update_date='2023/01/12',
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=17, 
        quantity=3, 
        id='531e27af', 
        seqno='000002', 
        ordno='000001', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>,
            person_id='A123456789', 
            broker_id='9A95', 
            account_id='1234567', 
            signed=True
        ), 
        custom_field='test', 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        daytrade_short=False
    ), 
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Cancelled: 'Cancelled'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        order_quantity=3,
        cancel_quantity=3,
        deals=[]
    )
)

```

### Deal

Update Status

```
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='2890', 
        symbol='TSE2890', 
        name='永豐金', 
        category='17', 
        unit=1000, 
        limit_up=19.05, 
        limit_down=15.65, 
        reference=17.35, 
        update_date='2023/01/12',
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=17, 
        quantity=3, 
        id='531e27af', 
        seqno='000002', 
        ordno='000001', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>,
            person_id='A123456789', 
            broker_id='9A95', 
            account_id='1234567', 
            signed=True
        ), 
        custom_field='test', 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        daytrade_short=False
    ), 
    status=OrderStatus(
        id='531e27af', 
        status=<Status.Filled: 'Filled'>,
        status_code='00', 
        order_datetime=datetime.datetime(2023, 1, 12, 11, 18, 3, 867490), 
        order_quantity=3,
        deals=[
            Deal(seq='000001', price=17, quantity=3, ts=1673501631.62918)
        ]
    )
)

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
