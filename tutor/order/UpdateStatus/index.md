Reminder

Before placing orders, you must first [log in](../../login/) and [activate your CA](../../prepare/terms/).

Before reading a `Trade`'s status, you must first refresh it by calling `update_status`. By default the call refreshes every order under all accounts. To refresh a single account, pass it as `account`; to refresh a single order, pass the `Trade` object as the keyword argument `trade=`. After the call, you can read the latest `Trade` list from `api.list_trades()` or directly inspect the `status` field on the `trade` object you passed in.

update_status

```
api.update_status?

Signature:
    api.update_status(
        account: Optional[sj.Account] = None,
        *,
        trade: Optional[sj.Trade] = None,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[], None]] = None,
    ) -> None

```

Parameters

```
account: Stock or futures account; omit to refresh all accounts under your name
trade:   Specific Trade object to refresh (keyword-only)
timeout: Timeout in milliseconds
cb:      Optional callback function

```

update_status

```
POST /api/v1/order/update_status
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

```

Parameters

```
account: Stock or futures account

```

## Attributes

OrderStatus

```
id (str):                  Linked Order object ID
status (OrderStatus):      Order status, {
                              Cancelled:     Cancelled,
                              Filled:        Fully filled,
                              PartFilled:    Partially filled,
                              Inactive:      Inactive,
                              Failed:        Failed,
                              PendingSubmit: Pending submit,
                              PreSubmitted:  Pre-submitted,
                              Submitted:     Submitted
                           }
status_code (str):         Status code
web_id (str):              Web-side order ID
order_datetime (datetime): Order timestamp
msg (str):                 Message
modified_time (datetime):  Last-modified timestamp
modified_price (float):    Modified price
order_quantity (int):      Order quantity
deal_quantity (int):       Filled quantity
cancel_quantity (int):     Cancelled quantity
deals (List[Deal]):        Deal details

```

Deal

```
seq (str):           Deal sequence number
price (float):       Deal price
quantity (int):      Deal quantity
ts (float):          Deal timestamp
datetime (datetime): Deal datetime (computed from ts, tz=Asia/Taipei +0800)

```

## Examples

### Get Stock Order Status

In

```
api.update_status(api.stock_account)
api.list_trades()

```

Out

```
[
    Trade(
        contract=Contract(
            security_type='STK',
            exchange='TSE',
            code='2890'
        ),
        order=Order(
            id='a647f23d',
            action=<Action.Buy: 'Buy'>,
            price=27.1,
            quantity=2,
            seqno='214115',
            ordno='Y27FI',
            order_type=<OrderType.ROD: 'ROD'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=StockAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            order_cond=<StockOrderCond.Cash: 'Cash'>,
            order_lot=<StockOrderLot.Common: 'Common'>
        ),
        status=OrderStatus(
            id='a647f23d',
            status=<OrderStatus.Filled: 'Filled'>,
            status_code='00',
            order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            web_id='137',
            modified_time=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            order_quantity=2,
            deal_quantity=2,
            deals=[
                Deal(
                    seq='000001',
                    price=27.1,
                    quantity=2,
                    ts=1747714234.123456,
                    datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
                )
            ]
        )
    )
]

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_status \
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
[{"contract":{"security_type":"STK","exchange":"TSE","code":"2890"},"order":{"id":"a647f23d","action":"Buy","price":27.1,"quantity":2,"seqno":"214115","ordno":"Y27FI","order_type":"ROD","price_type":"LMT","account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"order_cond":"Cash","order_lot":"Common"},"status":{"id":"a647f23d","status":"Filled","status_code":"00","order_datetime":"2026-05-20T11:24:30+08:00","web_id":"137","modified_time":"2026-05-20T11:24:30+08:00","order_quantity":2,"deal_quantity":2,"deals":[{"seq":"000001","price":27.1,"quantity":2,"ts":1747714234.123456}]}}]

```

### Get Futures Order Status

In

```
api.update_status(api.futopt_account)
api.list_trades()

```

Out

```
[
    Trade(
        contract=Contract(
            security_type='FUT',
            exchange='TAIFEX',
            code='TMFE6'
        ),
        order=Order(
            id='e0ae2459',
            action=<Action.Buy: 'Buy'>,
            price=36216,
            quantity=2,
            seqno='242472',
            ordno='vE0Dr',
            order_type=<OrderType.ROD: 'ROD'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=FutureAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            octype=<FuturesOCType.NewPosition: 'NewPosition'>
        ),
        status=OrderStatus(
            id='e0ae2459',
            status=<OrderStatus.Filled: 'Filled'>,
            status_code='0000',
            order_datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            web_id='Z',
            modified_time=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            order_quantity=2,
            deal_quantity=2,
            deals=[
                Deal(
                    seq='000001',
                    price=36216,
                    quantity=2,
                    ts=1747647787.123456,
                    datetime=datetime.datetime(2026, 5, 19, 18, 3, 7, tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
                )
            ]
        )
    )
]

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_status \
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
[{"contract":{"security_type":"FUT","exchange":"TAIFEX","code":"TMFE6"},"order":{"id":"e0ae2459","action":"Buy","price":36216,"quantity":2,"seqno":"242472","ordno":"vE0Dr","order_type":"ROD","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"NewPosition"},"status":{"id":"e0ae2459","status":"Filled","status_code":"0000","order_datetime":"2026-05-19T18:03:07+08:00","web_id":"Z","modified_time":"2026-05-19T18:03:07+08:00","order_quantity":2,"deal_quantity":2,"deals":[{"seq":"000001","price":36216,"quantity":2,"ts":1747647787.123456}]}}]

```

### Update a Specific Trade

In

```
# trade can be obtained from place_order or list_trades
# trade = api.place_order(contract, order)
# trade = api.list_trades()[0]

api.update_status(trade=trade)

```

The HTTP endpoint only refreshes all orders under the given `account`; it does not support targeting a single trade.

In

```
curl -X POST http://localhost:8080/api/v1/order/update_status \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```
