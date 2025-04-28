Reminder

First, you need to [login](../../login/) and [activate CA](../../prepare/terms/).

### Place Combo Order.

Combo orders offer types include: **Price Call/Put Spreads**, **Time Call/Put Spreads**, **Straddles**, **Strangles**, **Conversions** and **Reversal**. Please refer to the futures exchange [document](https://www.taifex.com.tw/cht/5/margingReqIndexOpt) for details on the combo rules.

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

Product information ( `contract`) and order information ( `order`) must be provided when placing an order. The order of the contracts is irrelevant, only the approved combination is required.

Combo Contract

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

Order

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
trade = api.place_comboorder(combo_c, order)

```

### Cancel Combo Order

`Trade` is the order to be deleted, which can be obtained from the [`update_combostatus`](#update-combo-status).

In

```
api.cancel_comboorder(trade)

```

### Update Combo Status

Like `list_trades` and `update_status` concepts. Before getting the combo status, the status must be updated with `update_combostatus`.

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
