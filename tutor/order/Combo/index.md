Reminder

Before placing orders, you must first [log in](../../login/) and [activate your CA](../../prepare/terms/).

A combo order bundles multiple futures or options contracts into a single submission. Supported types include **price spread**, **time spread**, **straddle**, **strangle**, **conversion**, and **reversal**; see the TAIFEX [reference](https://www.taifex.com.tw/cht/5/margingReqIndexOpt) for the combination rules.

## Place

place_comboorder

```
api.place_comboorder?

Signature:
    api.place_comboorder(
        combo_contract: sj.ComboContract,
        order: Union[sj.ComboOrder, sj.FuturesOrder],
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_contract: Combo contract with multiple ComboBase legs
order:          Combo order (ComboOrder or FuturesOrder)
timeout:        Timeout in milliseconds
cb:             Optional callback function

```

sj.ComboOrder

```
action (Action):                Buy/Sell {Buy, Sell}
price (float or int):           Price
quantity (int):                 Quantity
price_type (FuturesPriceType):  Price type {LMT, MKT, MKP}
order_type (OrderType):         Order type {ROD, IOC, FOK}
octype (FuturesOCType):         Open/cover type {Auto, New, Cover, DayTrade}
combo_type (ComboType):         Optional; derived from legs when omitted
account (Account):              Trading account

```

sj.ComboBase

```
action (Action):              Buy/Sell {Buy, Sell}
security_type (SecurityType): Security type {FUT, OPT}
exchange (Exchange):          Exchange
code (str):                   Security code

```

place_comboorder

```
POST /api/v1/order/place_comboorder
Content-Type: application/json

{
  "combo_contract": {
    "legs": [
      {
        "action": <Action>,
        "security_type": <SecurityType>,
        "exchange": <Exchange>,
        "code": <string>,
        "category": <string>,
        "delivery_month": <string>,
        "strike_price": <number>,
        "option_right": <string>
      }
    ]
  },
  "order": {
    "action": <Action>,
    "price": <number>,
    "quantity": <integer>,
    "price_type": <FuturesPriceType>,
    "order_type": <OrderType>,
    "octype": <FuturesOCType>,
    "account": { "broker_id": <string>, "account_id": <string> }
  }
}

```

Parameters

```
combo_contract.legs[].action:         Buy/Sell {Buy, Sell}
combo_contract.legs[].security_type:  Security type {FUT, OPT}
combo_contract.legs[].exchange:       Exchange
combo_contract.legs[].code:           Security code
combo_contract.legs[].category:       Product category
combo_contract.legs[].delivery_month: Delivery month YYYYMM
combo_contract.legs[].strike_price:   Strike price (null for futures)
combo_contract.legs[].option_right:   {C, P} (null for futures)
order.action:                         Buy/Sell {Buy, Sell}
order.price:                          Price
order.quantity:                       Quantity
order.price_type:                     Price type {LMT, MKT, MKP}
order.order_type:                     Order type {ROD, IOC, FOK}
order.octype:                         Open/cover type {Auto, New, Cover, DayTrade}
order.account:                        Trading account (defaults to the primary futures account)

```

### Example

Order

```
# Contract (short straddle: same expiry, same strike, sell call + sell put)
call = api.Contracts.Options.TXO.get("TXO20260527000C")
put = api.Contracts.Options.TXO.get("TXO20260527000P")
combo_contract = sj.ComboContract(
    legs=[
        sj.ComboBase.from_contract(call, action=sj.Action.Sell),
        sj.ComboBase.from_contract(put, action=sj.Action.Sell),
    ]
)
# Order
order = sj.ComboOrder(
    action=sj.Action.Sell,
    price=1,
    quantity=1,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.IOC,
    octype=sj.FuturesOCType.New,
    account=api.futopt_account,
)

```

In

```
# Place combo order
trade = api.place_comboorder(combo_contract, order)
trade

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "combo_contract": {
      "legs": [
        {
          "action": "Sell",
          "security_type": "OPT",
          "exchange": "TAIFEX",
          "code": "TXO20260527000C",
          "symbol": "TXO20260527000C",
          "category": "TXO",
          "delivery_month": "202605",
          "strike_price": 27000,
          "option_right": "C"
        },
        {
          "action": "Sell",
          "security_type": "OPT",
          "exchange": "TAIFEX",
          "code": "TXO20260527000P",
          "symbol": "TXO20260527000P",
          "category": "TXO",
          "delivery_month": "202605",
          "strike_price": 27000,
          "option_right": "P"
        }
      ]
    },
    "order": {
      "action": "Sell",
      "price": 1,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "IOC",
      "octype": "New",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

## Cancel

`trade` is the combo trade to cancel; obtain it via [Query Status](#query-status).

cancel_comboorder

```
api.cancel_comboorder?

Signature:
    api.cancel_comboorder(
        combo_trade: sj.ComboTrade,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_trade: Combo trade to cancel (obtained from list_combotrades / update_combostatus)
timeout:     Timeout in milliseconds
cb:          Optional callback function

```

cancel_comboorder

```
POST /api/v1/order/cancel_comboorder
Content-Type: application/json

{
  "trade_id": <string>
}

```

Parameters

```
trade_id: Combo trade ID (from place response status.id)

```

### Example

In

```
api.cancel_comboorder(trade)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/cancel_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID"
  }'

```

## Query Status

Like the relationship between `list_trades` and `update_status`: you must call `update_combostatus` to refresh combo trades before reading them. The HTTP endpoint `/order/combotrades` performs the refresh and the read in a single call.

update_combostatus / list_combotrades

```
api.update_combostatus?

Signature:
    api.update_combostatus(
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[List[sj.ComboTrade]], None]] = None,
    ) -> List[sj.ComboTrade]

api.list_combotrades?

Signature:
    api.list_combotrades() -> List[sj.ComboTrade]

```

Parameters

```
update_combostatus
    account: Futures account; omit to refresh all futures accounts under your name
    timeout: Timeout in milliseconds
    cb:      Optional callback function

list_combotrades
    (No parameters; returns known combo trades from the local cache)

```

combotrades

```
POST /api/v1/order/combotrades
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

```

Parameters

```
account: Futures account

```

### Example

In

```
api.update_combostatus(api.futopt_account)
api.list_combotrades()

```

Out

```
[
    ComboTrade(
        contract=ComboContract(
            legs=[
                ComboBase(
                    action=<Action.Sell: 'Sell'>,
                    security_type=<SecurityType.Option: 'OPT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXO20260527000C',
                    symbol='TXO20260527000C',
                    category='TXO',
                    delivery_month='202605',
                    strike_price=27000.0,
                    option_right=<OptionRight.Call: 'C'>
                ),
                ComboBase(
                    action=<Action.Sell: 'Sell'>,
                    security_type=<SecurityType.Option: 'OPT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXO20260527000P',
                    symbol='TXO20260527000P',
                    category='TXO',
                    delivery_month='202605',
                    strike_price=27000.0,
                    option_right=<OptionRight.Put: 'P'>
                )
            ]
        ),
        order=Order(
            id='46989de8',
            action=<Action.Sell: 'Sell'>,
            price=1.0,
            quantity=1,
            seqno='743595',
            ordno='000000',
            order_type=<OrderType.IOC: 'IOC'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=FutureAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            octype=<FuturesOCType.New: 'New'>
        ),
        status=ComboStatus(
            id='46989de8',
            status=<OrderStatus.Submitted: 'Submitted'>,
            status_code='0000',
            order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_time=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_price=1.0,
            order_quantity=1,
            deals={}
        )
    )
]

```

In

```
curl -X POST http://localhost:8080/api/v1/order/combotrades \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
[{"contract":{"legs":[{"action":"Sell","security_type":"OPT","exchange":"TAIFEX","code":"TXO20260527000C","symbol":"TXO20260527000C","category":"TXO","delivery_month":"202605","strike_price":27000.0,"option_right":"C"},{"action":"Sell","security_type":"OPT","exchange":"TAIFEX","code":"TXO20260527000P","symbol":"TXO20260527000P","category":"TXO","delivery_month":"202605","strike_price":27000.0,"option_right":"P"}]},"order":{"id":"46989de8","action":"Sell","price":1.0,"quantity":1,"seqno":"743595","ordno":"000000","order_type":"IOC","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"New"},"status":{"id":"46989de8","status":"Submitted","status_code":"0000","order_datetime":"2026-05-20T11:24:30+08:00","modified_time":"2026-05-20T11:24:30+08:00","modified_price":1.0,"order_quantity":1,"deals":{}}}]

```
