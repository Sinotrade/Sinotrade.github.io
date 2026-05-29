Just like using other popular packages, import and instantiate to start using Shioaji.

Note

**Please complete the prerequisites first, including [Open Account](../tutor/prepare/open_account/), [Terms of Service](../tutor/prepare/terms/), and [Token](../tutor/prepare/token/).**

### Login and Activate CA

```
import shioaji as sj

# Create Shioaji instance.
api = sj.Shioaji()

# Login
accounts = api.login(api_key="YOUR_API_KEY", secret_key="YOUR_SECRET_KEY")

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

# Check status
shioaji server check

```

```
# .env (placed in the working directory) should contain:
#   SJ_API_KEY=YOUR_API_KEY
#   SJ_SEC_KEY=YOUR_SECRET_KEY
#   SJ_CA_PATH=your/ca/path/Sinopac.pfx
#   SJ_CA_PASSWD=YOUR_CA_PASSWORD

# Start server
shioaji server start

# Check accounts (verify login)
curl http://localhost:8080/api/v1/auth/accounts

```

Certificate Path

On Windows, file paths are copied with `\` as the separator; replace them with `/`.

### Subscribe to Market Data

Subscribing to market data requires passing a contract to `subscribe` with a quote type to receive streaming data.

Quote Types

Currently three quote types are supported: tick / bid_ask / quote.

```
api.subscribe(api.Contracts.Stocks["2330"], quote_type="tick")
api.subscribe(api.Contracts.Stocks["2330"], quote_type="bid_ask")

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
contract = api.Contracts.Stocks["2890"]
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
