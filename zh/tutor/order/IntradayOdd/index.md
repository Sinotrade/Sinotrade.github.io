[零股下單範例 ( jupyter)](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/stock_intraday_odd.ipynb)

提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

### 下單

下單

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

### 改單

注意

**零股不能進行改價**

`update_order` 只能用來**減少**原委託單的委託數量。

改量(減量)

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

### 刪單

刪單

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
