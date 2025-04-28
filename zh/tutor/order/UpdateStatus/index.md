Reminder

First, you need to [login](../../login/) and [activate CA](../../prepare/terms/).

Before obtaining the `Trade` status, it must be updated with `update_status`. If you cannot successfully `update_order` or `cancel_order`, you can use `update_status` to update the specific `trade` status, and check the `OrderStatus` in `trade`, whether it is available to modify the order.

The update_status defaults to querying all accounts under the user's name. If you wish to inquire about a specific account, provide the account as a parameter to account.

Update Status

```
api.update_status?

```

Out

```
Signature:
    api.update_status(
        account: shioaji.account.Account = None,
        trade: shioaji.order.Trade = None,
        timeout: int = 5000,
        cb: Callable[[List[shioaji.order.Trade]], NoneType] = None,
    )
Docstring: update status of all trades you have

```

### Get Stock Trades

Get Stock Trades

```
api.update_status(api.stock_account)
api.list_trades()

```

Out

```
[
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
            daytrade_short=True
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
]

```

### Get Futures Trades

Get Futures Trades

```
api.update_status(api.futopt_account)
api.list_trades()

```

Out

```
[
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
]

```

### Update Specific Trade

Update Trade

```
# you can get trade from place_order
# trade = api.place_order(contract, order)

# or get from api.list_trades
# trade = api.list_trades()[0]

api.update_status(trade=trade)

```

### Trade Status

OrderStatus

```
id (str): the id uses to correlate the order object
status (:obj:Status): the status of order {Cancelled, Filled, PartFilled, Failed, PendingSubmit, PreSubmitted, Submitted}
status_code (str): the code of status
order_datetime (datetime): order time
order_quantity (int): order quantity
modified_price (float): the price of modification
cancel_quantity (int): the quantity of cancel
deals (:List:Deal): information of filled order

```

Deal

```
seq (str): deal sequence number
price (int or float): deal price
quantity (int): deal quantity
ts (float): deal timestamp

```
