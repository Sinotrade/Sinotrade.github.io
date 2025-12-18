提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

### 證券委託單

證券委託單

```
price (float or int): 價格
quantity (int): 委託數量
action (str): {Buy: 買, Sell: 賣}
price_type (str): {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_type (str): 委託類別 {ROD, IOC, FOK}
order_cond (str): {Cash:現股, MarginTrading:融資, ShortSelling:融券}
order_lot (str): {
        Common:整股, 
        Fixing:定盤, 
        Odd:盤後零股, 
        IntradayOdd:盤中零股
    }
daytrade_short (bool): 先賣後買
custom_field (str): 備註，只允許輸入大小寫英文字母及數字，且長度最長為 6
account (:obj:Account): 下單帳號
ca (binary): 憑證

```

```
price (float or int): 價格
quantity (int): 委託數量
action (str): {Buy: 買, Sell: 賣}
price_type (str): {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_type (str): 委託類別 {ROD, IOC, FOK}
order_cond (str): {Cash:現股, MarginTrading:融資, ShortSelling:融券}
order_lot (str): {
        Common:整股, 
        Fixing:定盤, 
        Odd:盤後零股, 
        IntradayOdd:盤中零股
    }
first_sell (str): 先賣後買 {true, false}
custom_field (str): 備註，只允許輸入大小寫英文字母及數字，且長度最長為 6
account (:obj:Account): 下單帳號
ca (binary): 憑證

```

### 下單

下單時必須提供商品資訊`contract`及下單資訊`order`。

下單

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

商品檔

```
contract = api.Contracts.Stocks.TSE.TSE2890

```

委託單

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

下單

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

下單完同時也會收到從交易所傳回來的資料，詳情內容可詳見[下單回報](../order_deal_event/stocks/)。

您需要執行`update_status`已更新`trade`物件的狀態。

更新委託狀態(成交後)

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

委託單狀態

- `PendingSubmit`: 傳送中
- `PreSubmitted`: 預約單
- `Submitted`: 傳送成功
- `Failed`: 失敗
- `Cancelled`: 已刪除
- `Filled`: 完全成交
- `PartFilled`: 部分成交

### 改單

改單

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

#### 改價

改價

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

#### 改量(減量)

`update_order` 只能用來**減少**原委託單的委託數量。

改量(減量)

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

### 成交

更新委託狀態

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

## 範例

[證券下單範例 ( jupyter)](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/stock.ipynb)

### 買賣別

買

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

賣

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
