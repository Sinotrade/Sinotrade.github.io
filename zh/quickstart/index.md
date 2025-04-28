Just import our API library like other popular python library and new the instance to start using our API. Login your account and activate the certification then you can start placing order.

Note

\*\* Please complete the Prepare before starting, including [Open Account](../tutor/prepare/open_account/), [Terms of Service](../tutor/prepare/terms/) and [Token](../tutor/prepare/token/). \*\*

#### Login and Activate CA

```
import shioaji as sj

api = sj.Shioaji()
accounts =  api.login("YOUR_API_KEY", "YOUR_SECRET_KEY")
api.activate_ca(
    ca_path="/c/your/ca/path/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="Person of this Ca",
)

```

```
import shioaji as sj

api = sj.Shioaji()
accounts = api.login("YOUR_PERSON_ID", "YOUR_PASSWORD")
api.activate_ca(
    ca_path="/c/your/ca/path/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="Person of this Ca",
)

```

The Certification Path

In Windows you copy the file path with `\` to separate the file, you need to replace it with `/`.

## Streaming Market Data

Subscribe the real time market data. Simplely pass contract into quote `subscribe` function and give the quote type will receive the streaming data.

```
api.quote.subscribe(api.Contracts.Stocks["2330"], quote_type="tick")
api.quote.subscribe(api.Contracts.Stocks["2330"], quote_type="bidask")
api.quote.subscribe(api.Contracts.Futures["TXFC0"], quote_type="tick")

```

Quote Type

Currently we support two quote type you can see in `shioaji.constent.QuoteType`. The best way to use that is directly pass this enum into `subscribe` function.

## Place Order

Like the above subscribing market data using the contract, then need to define the order. Pass them into `place_order` function, then it will return the trade that describe the status of your order.

```
contract = api.Contracts.Stocks["2890"]
order = api.Order(
    price=12,
    quantity=5,
    action=sj.constant.Action.Buy,
    price_type=sj.constant.StockPriceType.LMT,
    order_type=sj.constant.OrderType.ROD,
)
trade = api.place_order(contract, order)

```

## Conclusion

This quickstart demonstrates how easy to use our package for native Python users. Unlike many other trading API is hard for Python developer. We focus on making more pythonic trading API for our users.
