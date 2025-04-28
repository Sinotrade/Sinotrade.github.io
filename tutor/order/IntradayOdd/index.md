Reminder

First, you need to [login](../../login/) and [activate CA](../../prepare/terms/).

[place intraday odd order jupyter link](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/stock_intraday_odd.ipynb)

### Place Order

In

```
contract = api.Contracts.Stocks.TSE.TSE0050
order = api.Order(
    price=90,
    quantity=10,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,     
    order_lot=sj.constant.StockOrderLot.IntradayOdd, 
    account=api.stock_account,
)

trade = api.place_order(contract, order)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='0050', 
        symbol='TSE0050', 
        name='元大台灣50', 
        category='00', 
        limit_up=115.8, 
        limit_down=94.8, 
        eference=105.3, 
        update_date='2020/09/21', 
        margin_trading_balance=15390, 
        short_selling_balance=2, 
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=90.0, 
        quantity=10, 
        id='38e68afe', 
        seqno='482283', 
        ordno='WA313', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>, 
            person_id='YOUR_PERSON_ID', 
            broker_id='9A95', 
            account_id='0506112', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        order_lot=<StockOrderLot.IntradayOdd: 'IntradayOdd'>
    ), 
    status=OrderStatus(
        id='38e68afe', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2020, 9, 21, 14, 38, 51), 
        deals=[]
    )
)

```

### Update Order

Attention

**Intraday Odd cannot update price.**

`update_order` can only reduce the quantity of the order.

Update Quantity

```
api.update_order(trade=trade, qty=2)
api.update_status(api.stock_account)
trade

```

Out

```
Trade(
    contract=Stock(
        exchange=<Exchange.TSE: 'TSE'>, 
        code='0050', 
        symbol='TSE0050', 
        name='元大台灣50', 
        category='00', 
        limit_up=115.8, 
        limit_down=94.8, 
        reference=105.3, 
        update_date='2020/09/21', 
        margin_trading_balance=15390, 
        short_selling_balance=2, 
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=90.0, 
        quantity=10, 
        id='9b44c3b2', 
        seqno='482293', 
        ordno='WA328', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>, 
            person_id='YOUR_PERSON_ID', 
            broker_id='9A95', 
            account_id='0506112', 
            signed=True
        ), 
    price_type=<StockPriceType.LMT: 'LMT'>, 
    order_type=<OrderType.ROD: 'ROD'>, 
    order_lot=<StockOrderLot.IntradayOdd: 'IntradayOdd'>), 
    status=OrderStatus(
        id='9b44c3b2', 
        status=<Status.Submitted: 'Submitted'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2020, 9, 21, 14, 54, 36), 
        cancel_quantity=2, 
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
        code='0050', 
        symbol='TSE0050', 
        name='元大台灣50', 
        category='00', 
        limit_up=115.8, 
        limit_down=94.8, 
        reference=105.3, 
        update_date='2020/09/21', 
        margin_trading_balance=15390, 
        short_selling_balance=2, 
        day_trade=<DayTrade.Yes: 'Yes'>
    ), 
    order=Order(
        action=<Action.Buy: 'Buy'>, 
        price=90.0, 
        quantity=10, 
        id='9b44c3b2', 
        seqno='482293', 
        ordno='WA328', 
        account=Account(
            account_type=<AccountType.Stock: 'S'>, 
            person_id='YOUR_PERSON_ID', 
            broker_id='9A95', 
            account_id='0506112', 
            signed=True
        ), 
        price_type=<StockPriceType.LMT: 'LMT'>, 
        order_type=<OrderType.ROD: 'ROD'>, 
        order_lot=<StockOrderLot.IntradayOdd: 'IntradayOdd'>
    ), 
    status=OrderStatus(
        id='9b44c3b2', 
        status=<Status.Cancelled: 'Cancelled'>, 
        status_code='00', 
        order_datetime=datetime.datetime(2020, 9, 21, 14, 54, 36), 
        cancel_quantity=10,
        deals=[]
    )
)

```
