[Intraday Odd jupyter link](https://nbviewer.jupyter.org/github/Sinotrade/Sinotrade.github.io/blob/master/tutorial/stock_intraday_odd.ipynb)

Reminder

Before placing orders, you must first [login](../../login/) and [activate CA](../../prepare/terms/).

### Place Order

Intraday odd lot orders work the same as [stock orders](../Stock/); the difference is `order_lot` must be set to `IntradayOdd`.

Order

```
# contract
contract = api.Contracts.Stocks.TSE.TSE2890
# order
order = sj.StockOrder(
    action=sj.Action.Buy,
    price=27.1,
    quantity=10,
    price_type=sj.StockPriceType.LMT,
    order_lot=sj.StockOrderLot.IntradayOdd,
    order_type=sj.OrderType.ROD,
    order_cond=sj.StockOrderCond.Cash,
    account=api.stock_account,
)

```

In

```
# place order
trade = api.place_order(contract, order)
trade

```

Out

```
Trade(
    contract=Contract(
        security_type='STK',
        exchange='TSE',
        code='2890',
        target_code=''
    ),
    order=Order(
        id='a647f23d',
        action=<Action.Buy: 'Buy'>,
        price=27.1,
        quantity=10,
        seqno='214115',
        ordno='Y27FI',
        order_type=<OrderType.ROD: 'ROD'>,
        price_type=<PriceType.LMT: 'LMT'>,
        account=StockAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username='YOUR_USERNAME'
        ),
        order_cond=<StockOrderCond.Cash: 'Cash'>,
        order_lot=<StockOrderLot.IntradayOdd: 'IntradayOdd'>
    ),
    status=OrderStatus(
        id='a647f23d',
        status=<OrderStatus.PendingSubmit: 'PendingSubmit'>,
        status_code='0',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        msg='委託成功'
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {"security_type": "STK", "exchange": "TSE", "code": "2890"},
    "stock_order": {
      "action": "Buy",
      "price": 27.1,
      "quantity": 10,
      "price_type": "LMT",
      "order_type": "ROD",
      "order_lot": "IntradayOdd",
      "order_cond": "Cash",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{
  "contract": {
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890",
    "target_code": ""
  },
  "order": {
    "id": "90681873",
    "seqno": "218626",
    "ordno": "Y2CO1",
    "action": "Buy",
    "price": 27.1,
    "quantity": 10,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": "YOUR_USERNAME"
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "IntradayOdd"
  },
  "status": {
    "id": "90681873",
    "status": "PendingSubmit",
    "status_code": "0",
    "web_id": "",
    "order_ts": 1779248594.0,
    "msg": "委託成功",
    "modified_ts": 0.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 0,
    "deals": []
  }
}

```

### Update Order

Intraday odd lot orders **cannot update the price**; only quantity reduction is supported. See [stock orders](../Stock/) for details on updating an order.

In

```
api.update_order(trade=trade, qty=2)
api.update_status(api.stock_account)
trade

```

Out

```
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
        quantity=10,
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
        order_lot=<StockOrderLot.IntradayOdd: 'IntradayOdd'>
    ),
    status=OrderStatus(
        id='a647f23d',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 11, 24, 35, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        order_quantity=2,
        cancel_quantity=8
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/update_qty \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID",
    "quantity": 2
  }'

```

Out

```
{
  "contract": {
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890"
  },
  "order": {
    "id": "90681873",
    "seqno": "218626",
    "ordno": "Y2CO1",
    "action": "Buy",
    "price": 27.1,
    "quantity": 2,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "IntradayOdd"
  },
  "status": {
    "id": "90681873",
    "status": "Submitted",
    "status_code": "00",
    "web_id": "137",
    "order_ts": 1779248594.0,
    "msg": "",
    "modified_ts": 1779248627.0,
    "modified_price": 0.0,
    "order_quantity": 2,
    "deal_quantity": 0,
    "cancel_quantity": 8,
    "deals": []
  }
}

```

### Cancel Order

See [stock orders](../Stock/) for details on cancelling an order.

In

```
api.cancel_order(trade)
api.update_status(api.stock_account)
trade

```

Out

```
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
        quantity=10,
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
        order_lot=<StockOrderLot.IntradayOdd: 'IntradayOdd'>
    ),
    status=OrderStatus(
        id='a647f23d',
        status=<OrderStatus.Cancelled: 'Cancelled'>,
        status_code='00',
        order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        web_id='137',
        modified_time=datetime.datetime(2026, 5, 20, 11, 24, 41, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        cancel_quantity=10
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/cancel_order \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID"
  }'

```

Out

```
{
  "contract": {
    "security_type": "STK",
    "exchange": "TSE",
    "code": "2890"
  },
  "order": {
    "id": "90681873",
    "seqno": "218626",
    "ordno": "Y2CO1",
    "action": "Buy",
    "price": 27.1,
    "quantity": 10,
    "order_type": "ROD",
    "price_type": "LMT",
    "custom_field": "",
    "account": {
      "account_type": "S",
      "person_id": "YOUR_PERSON_ID",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "signed": true,
      "username": ""
    },
    "ca": "YOUR_CA_BASE64",
    "order_cond": "Cash",
    "order_lot": "IntradayOdd"
  },
  "status": {
    "id": "90681873",
    "status": "Cancelled",
    "status_code": "00",
    "web_id": "137",
    "order_ts": 1779248594.0,
    "msg": "",
    "modified_ts": 1779248627.0,
    "modified_price": 0.0,
    "order_quantity": 0,
    "deal_quantity": 0,
    "cancel_quantity": 10,
    "deals": []
  }
}

```
