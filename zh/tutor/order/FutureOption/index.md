提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

### 期貨委託單

期貨委託單

```
price (float or int): 價格
quantity (int): 委託數量
action (str): {Buy: 買, Sell: 賣}
price_type (str): {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_type (str): 委託類別 {ROD, IOC, FOK}
octype (str): {Auto: 自動, New: 新倉, Cover: 平倉, DayTrade: 當沖} 
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
contract = api.Contracts.Futures.TXF.TXF202301

```

委託單

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

下單

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

下單完同時也會收到從交易所傳回來的資料，詳情內容可詳見[下單回報](../order_deal_event/stocks/)。

您需要執行`update_status`已更新`trade`物件的狀態。

更新委託狀態

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

#### 改量(減量)

`update_order` 只能用來**減少**原委託單的委託數量。

改量(減量)

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

### 刪單

刪單

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

### 成交

更新委託狀態(成交後)

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

## 範例

[期權下單範例 ( jupyter)](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/future_and_option.ipynb)

### 買賣別

買

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

賣

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
