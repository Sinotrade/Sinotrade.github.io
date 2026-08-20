Reminder

Before placing orders, you must first [log in](../../login/) and [activate your CA](../../prepare/terms/).

A combo order bundles two futures/options contracts into a single submission. See the TAIFEX [order types introduction](https://www.taifex.com.tw/cht/4/oamIntroduction) for the full rules and the [margin page](https://www.taifex.com.tw/cht/5/margingReqIndexOpt) for margin information.

Build a combo contract before placing; see [Contract](../../contract/#combo) for how.

## Place

A combo order buys or sells the **whole combo**. Per the TAIFEX definition "the side of a spread order follows the far-month contract", buying a time spread means buying the far month and selling the near month. Each type is defined as follows (the **Direction & Net Price Table**):

| Type | `sj.ComboType` | `action=Buy` | `action=Sell` | Net price (`price`) | | --- | --- | --- | --- | --- | | Time spread | `TimeSpread` / `WeeklyTimeSpread` | sell near, buy far | buy near, sell far | far − near (can be negative) | | Call spread | `PriceSpread` | sell higher strike, buy lower | buy higher strike, sell lower | lower-strike premium − higher-strike premium | | Put spread | `PriceSpread` | sell lower strike, buy higher | buy lower strike, sell higher | higher-strike premium − lower-strike premium | | Straddle / Strangle | `Straddle` / `Strangle` | buy Call, buy Put | sell Call, sell Put | Call premium + Put premium | | Conversion / Reversal | `ConversionReversal` | sell Call, buy Put (Conversion) | buy Call, sell Put (Reversal) | Put premium − Call premium |

`price` is the net price of the whole combo, not any single product's price — see the Direction & Net Price Table; for quotes before placing, see [Combo Products](../../market_data/streaming/combo/).

Price range limits

Combo order prices are range-limited: for a time spread, the ceiling is the far month's limit-up minus the near month's limit-down, and the floor is the far month's limit-down minus the near month's limit-up. Orders outside the range are rejected by the exchange.

Order condition limits

- Standard option combos **cannot use `ROD`** — send `LMT` with `IOC` or `FOK`; an `ROD` order is rejected by TAIFEX with `9927 order-condition error`.
- Futures time spreads may use `ROD` during continuous trading, subject to product rules.
- Combo orders are not accepted during pre-open.

place_comboorder

```
api.place_comboorder?

Signature:
    api.place_comboorder(
        combo_contract: sj.ComboContract,
        order: Union[sj.ComboOrder, sj.FuturesOrder],
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_contract: Combo contract (see the Contract page for how to build one)
order:          Combo order (ComboOrder or FuturesOrder)
timeout:        Timeout in milliseconds
cb:             Optional callback function, used when timeout=0

```

sj.ComboOrder

```
action (Action):                Buy/Sell {Buy, Sell}, required; both products' directions
                                are expanded from it per the Direction & Net Price Table
price (float or int):           Net price, defined in the table above; can be negative
quantity (int):                 Quantity (both products share it)
price_type (FuturesPriceType):  Price type {LMT, MKT, MKP}
order_type (OrderType):         Order condition {ROD, IOC, FOK}
octype (FuturesOCType):         Open/cover type {Auto, New, Cover, DayTrade}
combo_type (ComboType):         Optional; auto-filled from the derived type, must match
                                when supplied
account (Account):              Trading account (defaults to the primary futures account)

```

`combo_contract` legs carry no actions (see [Contract](../../contract/#combo) for the shape); `order.action` is a required field.

place_comboorder

```
POST /api/v1/order/place_comboorder
Content-Type: application/json

{
  "combo_contract": { "legs": [ ... ] },
  "order": {
    "action": <Action>,
    "price": <number>,
    "quantity": <integer>,
    "price_type": <FuturesPriceType>,
    "order_type": <OrderType>,
    "octype": <FuturesOCType>,
    "combo_type": <ComboType>,
    "account": { "broker_id": <string>, "account_id": <string> }
  }
}

```

Parameters

```
combo_contract:   Combo contract (see the Contract page)
order.action:     Buy/Sell {Buy, Sell}, required; both products' directions are
                  expanded from it
order.price:      Net price, can be negative
order.quantity:   Quantity (both products share it)
order.price_type: Price type {LMT, MKT, MKP}
order.order_type: Order condition {ROD, IOC, FOK}
order.octype:     Open/cover type {Auto, New, Cover, DayTrade}
order.combo_type: Optional combo type
order.account:    Trading account (defaults to the primary futures account)

```

### Example

**Futures time spread**, buying the spread (sell near, buy far). Composition: two futures of the same product with different delivery months, near month first.

- Contract: `legs=[near, far]`, no actions on the products
- Order: `action=Buy` (buying the spread; Shioaji expands it to sell near, buy far)

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

order = sj.ComboOrder(
    action=sj.Action.Buy,  # buy the spread: Shioaji expands to sell near, buy far
    price=50,  # net price (far - near)
    quantity=1,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.ROD,
    octype=sj.FuturesOCType.Auto,
    account=api.futopt_account,
)
trade = api.place_comboorder(combo_contract, order)
trade

```

Out

```
ComboTrade(
    contract=ComboContract(
        legs=[
            Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFH6'),
            Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFI6')
        ],
        combo_type=TimeSpread
    ),
    order=Order(
        id='46989de8',
        action=<Action.Buy: 'Buy'>,
        price=50.0,
        quantity=1,
        seqno='743595',
        ordno='000000',
        order_type=<OrderType.ROD: 'ROD'>,
        price_type=<PriceType.LMT: 'LMT'>,
        account=FutureAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        ),
        octype=<FuturesOCType.Auto: 'Auto'>
    ),
    status=ComboStatus(
        id='46989de8',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_time=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=50.0,
        order_quantity=1,
        deals={}
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "combo_contract": {
      "legs": [
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
      ]
    },
    "order": {
      "action": "Buy",
      "price": 50,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "ROD",
      "octype": "Auto",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{"contract":{"legs":[{"action":"Sell","security_type":"FUT","exchange":"TAIFEX","code":"TXFH6","symbol":"TXFH6","category":"TXF","delivery_month":"202608"},{"action":"Buy","security_type":"FUT","exchange":"TAIFEX","code":"TXFI6","symbol":"TXFI6","category":"TXF","delivery_month":"202609"}]},"order":{"id":"46989de8","action":"Buy","price":50.0,"quantity":1,"seqno":"743595","ordno":"000000","order_type":"ROD","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"Auto"},"status":{"id":"46989de8","status":"Submitted","status_code":"0000","order_datetime":"2026-08-12T11:35:00+08:00","modified_price":50.0,"order_quantity":1,"deals":{}}}

```

**Option straddle**, buying the straddle (buy Call, buy Put). Composition: a Call and a Put with the same expiry and strike, Call first; standard option combos use `IOC`.

- Contract: `legs=[Call, Put]` plus `combo_type=Straddle` (required — same components as Conversion/Reversal)
- Order: `action=Buy` (buy Call, buy Put)

In

```
call = api.contracts.get("TXO34000I6")
put = api.contracts.get("TXO34000U6")
straddle_contract = api.contracts.combo(
    legs=[call, put],
    combo_type=sj.ComboType.Straddle,
)

order = sj.ComboOrder(
    action=sj.Action.Buy,  # buy the straddle: buy Call, buy Put
    price=1,  # net price (Call premium + Put premium)
    quantity=1,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.IOC,  # standard option combos cannot use ROD
    octype=sj.FuturesOCType.Auto,
    account=api.futopt_account,
)
trade = api.place_comboorder(straddle_contract, order)
trade

```

Out

```
ComboTrade(
    contract=ComboContract(
        legs=[
            Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000I6'),
            Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000U6')
        ],
        combo_type=Straddle
    ),
    order=Order(
        id='a3512bd6',
        action=<Action.Buy: 'Buy'>,
        price=1.0,
        quantity=1,
        seqno='743597',
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
        octype=<FuturesOCType.Auto: 'Auto'>
    ),
    status=ComboStatus(
        id='a3512bd6',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 8, 12, 11, 37, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_time=datetime.datetime(2026, 8, 12, 11, 37, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=1.0,
        order_quantity=1,
        deals={}
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "combo_contract": {
      "legs": [
        {"security_type": "OPT", "exchange": "TAIFEX", "code": "TXO34000I6"},
        {"security_type": "OPT", "exchange": "TAIFEX", "code": "TXO34000U6"}
      ],
      "combo_type": "Straddle"
    },
    "order": {
      "action": "Buy",
      "price": 1,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "IOC",
      "octype": "Auto",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{"contract":{"legs":[{"action":"Buy","security_type":"OPT","exchange":"TAIFEX","code":"TXO34000I6","symbol":"TXO34000I6","category":"TXO","delivery_month":"202609","strike_price":34000.0,"option_right":"C"},{"action":"Buy","security_type":"OPT","exchange":"TAIFEX","code":"TXO34000U6","symbol":"TXO34000U6","category":"TXO","delivery_month":"202609","strike_price":34000.0,"option_right":"P"}]},"order":{"id":"a3512bd6","action":"Buy","price":1.0,"quantity":1,"seqno":"743597","ordno":"000000","order_type":"IOC","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"Auto"},"status":{"id":"a3512bd6","status":"Submitted","status_code":"0000","order_datetime":"2026-08-12T11:37:00+08:00","modified_price":1.0,"order_quantity":1,"deals":{}}}

```

## Cancel

`trade` is the combo trade to cancel; obtain it via [Query Status](#query-status).

cancel_comboorder

```
api.cancel_comboorder?

Signature:
    api.cancel_comboorder(
        combo_trade: sj.ComboTrade,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_trade: Combo trade to cancel (from list_combotrades / update_combostatus)
timeout:     Timeout in milliseconds
cb:          Optional callback function, used when timeout=0

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
trade_id: Combo trade ID (from the place response status.id)

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
    "trade_id": "46989de8"
  }'

```

## Query Status

Like the relationship between `list_trades` and `update_status`: call `update_combostatus` to refresh combo trades before reading them. The HTTP endpoint `/order/combotrades` performs the refresh and the read in a single call.

update_combostatus / list_combotrades

```
api.update_combostatus?

Signature:
    api.update_combostatus(
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 30000,
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
    cb:      Optional callback function; receives the refreshed ComboTrade list when timeout=0

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

An unfilled IOC is a normal ending

A combo order sent with `IOC` that does not fill ends with `status=Cancelled`, `status_code='0000'`, `deal_quantity=0`, `cancel_quantity=1`, `deals={}` — the order was accepted by the exchange and auto-cancelled for lack of a fill. It is not an error.

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
                    security_type=<SecurityType.Future: 'FUT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXFH6',
                    symbol='TXFH6',
                    category='TXF',
                    delivery_month='202608'
                ),
                ComboBase(
                    action=<Action.Buy: 'Buy'>,
                    security_type=<SecurityType.Future: 'FUT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXFI6',
                    symbol='TXFI6',
                    category='TXF',
                    delivery_month='202609'
                )
            ]
        ),
        order=Order(
            id='46989de8',
            action=<Action.Buy: 'Buy'>,
            price=50.0,
            quantity=1,
            seqno='743595',
            ordno='000000',
            order_type=<OrderType.ROD: 'ROD'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=FutureAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            octype=<FuturesOCType.Auto: 'Auto'>
        ),
        status=ComboStatus(
            id='46989de8',
            status=<OrderStatus.Submitted: 'Submitted'>,
            status_code='0000',
            order_datetime=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_time=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_price=50.0,
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
[{"contract":{"legs":[{"action":"Sell","security_type":"FUT","exchange":"TAIFEX","code":"TXFH6","symbol":"TXFH6","category":"TXF","delivery_month":"202608"},{"action":"Buy","security_type":"FUT","exchange":"TAIFEX","code":"TXFI6","symbol":"TXFI6","category":"TXF","delivery_month":"202609"}]},"order":{"id":"46989de8","action":"Buy","price":50.0,"quantity":1,"seqno":"743595","ordno":"000000","order_type":"ROD","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"Auto"},"status":{"id":"46989de8","status":"Submitted","status_code":"0000","order_datetime":"2026-08-12T11:35:00+08:00","modified_price":50.0,"order_quantity":1,"deals":{}}}]

```
