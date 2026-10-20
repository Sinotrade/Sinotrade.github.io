### Login

Just like using other popular packages, import and instantiate to start using Shioaji.

```
import shioaji as sj

# Create Shioaji instance.
api = sj.Shioaji()

# Login
accounts = api.login(
    api_key="YOUR_API_KEY", 
    secret_key="YOUR_SECRET_KEY", 
    subscribe_trade=True
)

# Activate CA (required before placing orders in production)
api.activate_ca(
    ca_path="your/ca/path/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="Person of this Ca",
)

```

```
# .env (placed in the working directory) should contain:
#   SJ_API_KEY=YOUR_API_KEY
#   SJ_SEC_KEY=YOUR_SECRET_KEY
#   SJ_CA_PATH=your/ca/path/Sinopac.pfx
#   SJ_CA_PASSWD=YOUR_CA_PASSWORD

# Start server (automatically reads .env, performs login and CA activation)
shioaji server start

```

Note

**Before you start, please complete the prerequisites, including [Open Account](../tutor/prepare/open_account/), [Terms of Service](../tutor/prepare/terms/), and [Token](../tutor/prepare/token/).**

On Windows, file paths are copied with `\` as the separator; replace them with `/`.

### Check Status

```
# Check status
shioaji server check

```

```
# Check accounts (verify login)
curl http://localhost:8080/api/v1/auth/accounts

```

### Subscribe Order/Deal Events

We provide 2 ways to control order/deal event subscription. The first is the `subscribe_trade` parameter of `login`. It defaults to `True` and automatically subscribes to order/deal events for all your accounts. The other way is to call `subscribe_trade` and `unsubscribe_trade` on a specific account to subscribe to or unsubscribe from its order/deal events.

subscribe trade

```
api.subscribe_trade(account)

```

unsubscribe trade

```
api.unsubscribe_trade(account)

```

The server does not subscribe automatically at startup; subscribe dynamically per account.

subscribe trade

```
shioaji auth subscribe-trade --account-type F

```

unsubscribe trade

```
shioaji auth unsubscribe-trade --account-type F

```

Parameters

```
--account-type: optional, S (stock, default) or F (futures/options)
--account:      optional, in BROKER_ID-ACCOUNT_ID format; defaults to the default account of that type

```

Out

```
account:
  account_type: F
  person_id: YOUR_PERSON_ID
  broker_id: F002000
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""
subscribe_trade: true
ts: 20260612021106

```

Note

`subscribe-trade` only registers the subscription with the server and exits once done. To actually receive order/deal events, use `shioaji order events` (SSE stream, Ctrl+C to stop). See [Order Event](./callback/orderdeal_event.md) for details.

The server does not subscribe automatically at startup; subscribe dynamically per account.

subscribe trade

```
curl -X POST http://localhost:8080/api/v1/auth/subscribe_trade \
  -H "Content-Type: application/json" \
  -d '{"broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

unsubscribe trade

```
curl -X POST http://localhost:8080/api/v1/auth/unsubscribe_trade \
  -H "Content-Type: application/json" \
  -d '{"broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

### Subscribe to Market Data

Subscribing to market data requires passing a contract to `subscribe` with a quote type to receive streaming data. Currently three quote types are supported: tick / bid_ask / quote.

```
contract = api.contracts.get("2330")
api.subscribe(contract, quote_type="tick")
api.subscribe(contract, quote_type="bid_ask")

```

```
shioaji data stream --code 2330 --quote-type tick
shioaji data stream --code 2330 --quote-type bid_ask

```

```
# Subscribe
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H "Content-Type: application/json" \
  -d '{"security_type":"STK","exchange":"TSE","code":"2330","quote_type":"Tick"}'

curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H "Content-Type: application/json" \
  -d '{"security_type":"STK","exchange":"TSE","code":"2330","quote_type":"BidAsk"}'

# Connect to SSE to receive streaming data (Ctrl+C to stop)
curl -N http://localhost:8080/api/v1/stream/data

```

Note for Non-Python Users

Python / CLI users can subscribe with a contract object or symbol directly. Other languages must fill in security_type / exchange / code manually; call `GET /api/v1/data/contracts/{code}?security_type=...` to look them up.

### Place Order

Placing an order requires specifying a contract and the order details (action, price, quantity, etc.); the response contains the trade status.

```
contract = api.contracts.get("2890")
order = sj.StockOrder(
    action=sj.Action.Buy,
    price=28,
    quantity=1,
    price_type=sj.StockPriceType.LMT,
    order_type=sj.OrderType.ROD,
    order_lot=sj.StockOrderLot.Common,
    order_cond=sj.StockOrderCond.Cash,
)
trade = api.place_order(contract, order)

```

```
shioaji order place --code 2890 --action buy --price 28 --quantity 1 \
    --price-type lmt --order-type rod --order-lot common --order-cond cash

```

```
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H "Content-Type: application/json" \
  -d '{
    "contract": {"security_type": "STK", "exchange": "TSE", "code": "2890"},
    "stock_order": {
      "price": 28,
      "quantity": 1,
      "action": "Buy",
      "price_type": "LMT",
      "order_type": "ROD",
      "order_lot": "Common",
      "order_cond": "Cash"
    }
  }'

```

## Conclusion

This quickstart demonstrates Shioaji's core operations. Whether using Python, CLI, or HTTP API (including JS, Go, C++, C#, etc.), you can complete login, subscribe, and place orders with the same logic.
