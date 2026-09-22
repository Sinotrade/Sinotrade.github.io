Query **stock / futures-options account** order status. [Login](../../login) is required first.

## Read Order Status

`api.list_trades()` takes no parameters and returns the currently known `Trade` list across all your accounts. You can also read the `trade` object you already hold (returned by `place_order` or `list_trades`) and check its `status` field.

The list is empty right after a new login; call [reconciliation](#reconciliation) first to fetch the day's orders.

list_trades

```
api.list_trades?

Signature:
    api.list_trades() -> List[sj.Trade]

```

trades

```
POST /api/v1/order/trades
Content-Type: application/json

{
  "account_type": <string>,
  "broker_id": <string>,
  "account_id": <string>,
  "refresh": <bool>
}

```

Parameters

```
account_type: S for stock, F for futures/options; defaults to S
broker_id:    Branch code; use with account_id to target a specific account
account_id:   Account number; omit to use the default account of account_type
refresh:      Whether to refresh from the backend first; defaults to true.
              false returns only the local cache (1.7.6+)

```

### Attributes

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

### Examples

In

```
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
curl -X POST http://localhost:8080/api/v1/order/trades \
  -H 'Content-Type: application/json' \
  -d '{
    "account_type": "S",
    "refresh": false
  }'

```

Out

```
[{"contract":{"security_type":"STK","exchange":"TSE","code":"2890"},"order":{"id":"a647f23d","action":"Buy","price":27.1,"quantity":2,"seqno":"214115","ordno":"Y27FI","order_type":"ROD","price_type":"LMT","account":{"account_type":"S","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"order_cond":"Cash","order_lot":"Common"},"status":{"id":"a647f23d","status":"Filled","status_code":"00","order_datetime":"2026-05-20T11:24:30+08:00","web_id":"137","modified_time":"2026-05-20T11:24:30+08:00","order_quantity":2,"deal_quantity":2,"deals":[{"seq":"000001","price":27.1,"quantity":2,"ts":1747714234.123456}]}}]

```

## Get and Keep Trade Current

Right after a new login no reports have arrived yet, so call `update_status` once to fetch the day's orders. How the list stays current afterwards depends on your version:

Maintained for you: `Trade` objects update automatically from active reports.

- Set an [order callback](../../callback/orderdeal_event/) as a notification, then read `trade` once a report arrives.
- To confirm no reports were missed, check with [trade_cache_health](#check-for-missed-reports-176).

Maintained by you: `Trade` objects do not update on their own.

- Set an [order callback](../../callback/orderdeal_event/) and maintain the `Trade` object from the report contents yourself.
- Or call `update_status` before each read.

## Reconciliation

`update_status` queries the backend for order status and updates `Trade`. Use it to fetch the day's orders after a new login, when reports may have been missed, or when you need to confirm the final state.

update_status

```
api.update_status?

Signature:
    api.update_status(
        account: Optional[sj.Account] = None,
        *,
        trade: Optional[sj.Trade] = None,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[List[sj.Trade]], None]] = None,
    ) -> None

```

Parameters

```
account: Stock or futures account; omit to refresh all accounts under your name
trade:   Specific Trade object to refresh (keyword-only)
timeout: Timeout in milliseconds
cb:      Optional callback function; when timeout=0, receives the updated Trade list

```

trades

```
POST /api/v1/order/trades
Content-Type: application/json

{
  "account_type": <string>,
  "broker_id": <string>,
  "account_id": <string>,
  "refresh": true
}

```

Parameters

```
account_type: S for stock, F for futures/options; defaults to S
broker_id:    Branch code; use with account_id to target a specific account
account_id:   Account number; omit to use the default account of account_type
refresh:      Set to true (or omit) to refresh from the backend before returning

```

### Examples

In

```
api.update_status()                      # All accounts under your name
# api.update_status(api.stock_account)   # Stock account only
# api.update_status(api.futopt_account)  # Futures/options account only
# api.update_status(trade=trade)         # A single order only

api.list_trades()

```

In

```
curl -X POST http://localhost:8080/api/v1/order/trades \
  -H 'Content-Type: application/json' \
  -d '{
    "account_type": "S",
    "refresh": true
  }'

```

## Check for Missed Reports (1.7.6+)

When a report is missed, `Trade` stays at its old state and there is no way to tell from the outside. `api.trade_cache_health(account)` tells you whether any reports appear to have been missed.

trade_cache_health

```
api.trade_cache_health?

Signature:
    api.trade_cache_health(account: sj.Account) -> sj.TradeCacheHealth

```

Parameters

```
account: Stock or futures account

```

trade_cache_health

```
POST /api/v1/order/trade_cache_health
Content-Type: application/json

{
  "account_type": <string>,
  "broker_id": <string>,
  "account_id": <string>
}

```

Parameters

```
account_type: S for stock, F for futures/options; defaults to S
broker_id:    Branch code; use with account_id to target a specific account
account_id:   Account number; omit to use the default account of account_type

```

TradeCacheHealth

```
state (TradeCacheHealthState):          Cache state, {
                                           Healthy:  Normal,
                                           Unknown:  Not enough information yet,
                                           Degraded: Reports may have been missed
                                        }
reasons (List[TradeCacheHealthReason]): Reasons for the state, each containing
                                           event_type (OrderState):             Report type
                                           reason (TradeCacheHealthReasonCode): Reason code

```

Handle by `state` and `reason`:

| `state` | `reason` | What to do | | --- | --- | --- | | `Healthy` | None | Nothing | | `Unknown` | `NotSubscribed` | Trade reports are not subscribed for this account; call `subscribe_trade(account)` | | `Unknown` | `NoBaseline` | That report type has not occurred yet; nothing to do. It clears once a report arrives, or call `update_status` to establish a baseline immediately | | `Degraded` | `SequenceGap` | A report sequence number was skipped; it may just be late. Call `update_status` when you need to confirm | | `Degraded` | `PendingReport` | A report cannot be correlated to an order yet; usually resolves when later reports arrive. Call `update_status` when you need to confirm | | `Degraded` | `UntrackableEventId` | The event ID is missing or unsupported and cannot be tracked; call `update_status` to reconcile | | `Degraded` | `ProjectionFailed` | The report could not be applied to `Trade`; call `update_status` to reconcile |

### Examples

In

```
health = api.trade_cache_health(api.stock_account)
health.state, [(r.event_type, r.reason) for r in health.reasons]

```

Out

```
(<TradeCacheHealthState.Unknown: 'Unknown'>,
 [(<OrderState.StockDeal: 'SDEAL'>,
   <TradeCacheHealthReasonCode.NoBaseline: 'NoBaseline'>)])

```

The example above is an order placed but not yet filled: the order report (`SORDER`) has arrived, so it is not in `reasons`; the deal report (`SDEAL`) has not happened yet and is still `NoBaseline`. Once both have a baseline, `state` becomes `Healthy`.

In

```
curl -X POST http://localhost:8080/api/v1/order/trade_cache_health \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S"}'

```

Out

```
{"state":"Unknown","reasons":[{"event_type":"StockDeal","reason":"NoBaseline"}]}

```

The example above is an order placed but not yet filled: the order report (`StockOrder`) has arrived, so it is not in `reasons`; the deal report (`StockDeal`) has not happened yet and is still `NoBaseline`. Once both have a baseline, `state` becomes `Healthy`.
