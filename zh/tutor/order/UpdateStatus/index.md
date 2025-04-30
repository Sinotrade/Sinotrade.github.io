提醒

必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

在取得 `Trade` 狀態前，必須先利用`update_status`進行更新。如果無法成功刪單或改單，你可以對特定`trade`物件進行更新，並確認在`trade`中的`OrderStatus`，是否為可刪改狀態。`update_status` 預設查詢為名下所有帳號。若想查詢特定帳號，將帳號帶入`account`。

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

### 取得證券委託狀態

取得證券委託狀態

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

### 取得期貨委託狀態

取得期貨委託狀態

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

### 更新特定交易狀態

更新特定交易狀態

```
# you can get trade from place_order
# trade = api.place_order(contract, order)

# or get from api.list_trades
# trade = api.list_trades()[0]

api.update_status(trade=trade)

```

### 委託及成交狀態屬性

委託狀態屬性

```
id (str): 關聯Order物件編碼
status (:obj:Status): {
            Cancelled: 已刪除, 
            Filled: 完全成交, 
            PartFilled: 部分成交, 
            Failed: 失敗, 
            PendingSubmit: 傳送中, 
            PreSubmitted: 預約單, 
            Submitted: 傳送成功
        }
status_code (str): 狀態碼
order_datetime (datetime): 委託時間
order_quantity (int): 委託數量
modified_price (float): 改價金額
cancel_quantity (int): 取消委託數量
deals (:List:Deal): 成交資訊

```

成交屬性

```
seq (str): 成交序號
price (int or float): 成交價
quantity (int): 成交數量
ts (float): 成交時間戳

```
