提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

## 下單

組合單提供類型包括:**價格價差**、**時間價差**、**跨式**、**勒式**、**轉換**以及**逆轉**。組合規則詳見期交所[文件](https://www.taifex.com.tw/cht/5/margingReqIndexOpt)。

place_comboorder

```
api.place_comboorder?

    Signature:
        api.place_comboorder(
            combo_contract: shioaji.contracts.ComboContract,
            order: shioaji.order.ComboOrder,
            timeout: int = 5000,
            cb: Callable[[shioaji.order.ComboTrade], NoneType] = None,
        )
    Docstring:
        placing combo order

```

下單時必須提供商品資訊`contract`及下單資訊`order`。商品資訊無關前後順序，只需提供認可的組合。

商品資訊

```
contract_1 = api.Contracts.Options.TX4.TX4202111017850C
contract_2 = api.Contracts.Options.TX4.TX4202111017850P
combo_contract = sj.contracts.ComboContract(
    legs=[
        sj.contracts.ComboBase(action="Sell", **contract_1.dict()),
        sj.contracts.ComboBase(action="Sell", **contract_2.dict()),
    ]
)

```

下單資訊

```
order = api.ComboOrder(
    price_type="LMT", 
    price=1, 
    quantity=1, 
    order_type="IOC",
    octype=sj.constant.FuturesOCType.New,
)

```

In

```
trade = api.place_comboorder(combo_contract, order)

```

## 刪單

`trade`為要刪的單，可從[查詢](#_3)取得。

In

```
api.cancel_comboorder(trade)

```

## 查詢狀態

如同 `list_trades` 及 `update_status` 的概念。在取得組合單狀態前，必須利用 `update_combostatus` 更新狀態。

In

```
api.update_combostatus()
api.list_combotrades()

```

Out

```
[
    ComboTrade(
        contract=ComboContract(
            legs=[
                ComboBase(
                    security_type=<SecurityType.Option: 'OPT'>, 
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>, 
                    code='TX516000L1', 
                    symbol='TX5202112016000C', 
                    name='臺指選擇權12W5月 16000C', 
                    category='TX5', 
                    delivery_month='202112', 
                    delivery_date='2021/12/29', 
                    strike_price=16000.0, 
                    option_right=<OptionRight.Call: 'C'>, 
                    underlying_kind='I', 
                    unit=1, 
                    limit_up=3630.0, 
                    limit_down=68.0, 
                    reference=1850.0, 
                    update_date='2021/12/23', 
                    action=<Action.Sell: 'Sell'>), 
                ComboBase(
                    security_type=<SecurityType.Option: 'OPT'>, 
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>, 
                    code='TX516000X1', 
                    symbol='TX5202112016000P', 
                    name='臺指選擇權12W5月 16000P', 
                    category='TX5', 
                    delivery_month='202112',
                    delivery_date='2021/12/29',
                    strike_price=16000.0, 
                    option_right=<OptionRight.Put: 'P'>, 
                    underlying_kind='I', 
                    unit=1, 
                    limit_up=1780.0, 
                    limit_down=0.1, 
                    reference=0.9, 
                    update_date='2021/12/23', 
                    action=<Action.Sell: 'Sell'>)
                ]
            ), 
        order=Order(
            action=<Action.Sell: 'Sell'>, 
            price=1.0,
            quantity=1, 
            id='46989de8', 
            seqno='743595', 
            ordno='000000', 
            account=Account(
                account_type=<AccountType.Future: 'F'>, 
                person_id='YOUR_PERSON_ID', 
                broker_id='F002000', 
                account_id='1234567', 
                signed=True
            ), 
            price_type=<StockPriceType.LMT: 'LMT'>, 
            order_type=<OrderType.IOC: 'IOC'>, 
            octype=<FuturesOCType.New: 'New'>
        ), 
        status=ComboStatus(
            id='46989de8', 
            status=<Status.Failed: 'Failed'>, 
            status_code='99Q9', 
            order_datetime=datetime.datetime(2021, 12, 23, 8, 46, 47), 
            msg='可委託金額不足', 
            modified_price=1.0, 
            deals={}
        )
    )
]

```
