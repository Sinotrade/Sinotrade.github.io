You can subscribe to have the system push order and deal reports to you proactively.

## Subscribe Trade

We provide 2 ways to control order/deal report subscription. The first is the `subscribe_trade` parameter of `login`. It defaults to `True` and automatically subscribes to order/deal reports for all your accounts.

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    subscribe_trade=True
)

```

The other way is to call `subscribe_trade` and `unsubscribe_trade` on a specific account to subscribe to or unsubscribe from its order/deal reports.

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

`subscribe-trade` only registers the subscription with the server and exits once done. To actually receive order/deal reports, use `shioaji order events` (SSE stream, Ctrl+C to stop). See [Order Event](./callback/orderdeal_event.md) for details.

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

## Order Event

When the stock exchange receives an order, it returns an order event. The event is divided into four parts: operation, order, status and contract. We explain each in detail below.

Order Event

```
<OrderState.StockOrder: 'SORDER'> {
    'event_id': 'v1:SO:A1EGVO30H:BOnKZSD:4',
    'operation': {
        'op_type': 'New',
        'op_code': '00',
        'op_msg': ''
    },
    'order': {
        'id': '348d1c6a',
        'seqno': '351522',
        'ordno': 'Y1S5N',
        'account': {
            'account_type': 'S',
            'person_id': '',
            'broker_id': 'YOUR_BROKER_ID',
            'account_id': 'YOUR_ACCOUNT_ID',
            'signed': True,
            'username': ''
        },
        'action': 'Buy',
        'price': 27.0,
        'quantity': 1,
        'order_type': 'ROD',
        'price_type': 'LMT',
        'order_cond': 'Cash',
        'order_lot': 'Common',
        'custom_field': ''
    },
    'status': {
        'id': '348d1c6a',
        'exchange_ts': 1779331286.678,
        'modified_price': 0.0,
        'cancel_quantity': 0,
        'order_quantity': 1,
        'web_id': '137'
    },
    'contract': {
        'exchange': 'TSE',
        'code': '2890',
        'security_type': 'STK',
        'symbol': '',
        'name': '',
        'currency': 'TWD'
    }
}

```

Order Event Info.

**event_id** (1.7.6+)

```
event_id (str): report identity, used for deduplication and gap detection

```

**operation**

```
op_type (str): {
            "New": new order, 
            "Cancel": cancel order, 
            "UpdatePrice": update price, 
            "UpdateQty": update quantity
        }
op_code (str): {"00": success, others: fail}
op_msg (str): error message

```

**order**

```
id (str): same as the trade_id in the deal event
seqno (str): platform sequence number
ordno (str): order number
account (dict): account info
action (str): {Buy, Sell}
price (float or int): order price
quantity (int): order quantity
order_type (str): order type {ROD, IOC, FOK}
price_type (str): {LMT: limit, MKT: market, MKP: range market}
order_cond (str): {
            Cash: cash, 
            MarginTrading: margin trading, 
            ShortSelling: short selling
        }
order_lot (str): {
            Common: board lot, 
            Fixing: fixing, 
            Odd: after-hours odd lot, 
            IntradayOdd: intraday odd lot
        }
custom_field (str): custom field

```

**status**

```
id (str): same as the trade_id in the deal event
exchange_ts (int): exchange time
modified_price (float or int): modified price
cancel_quantity (int): cancel quantity
order_quantity (int): order quantity
web_id (str): order platform code

```

**contract**

```
security_type (str): security type
exchange (str): exchange
code (str): contract code
symbol (str): symbol
name (str): contract name
currency (str): currency

```

When the futures exchange receives an order, it returns an order event. The event is divided into four parts: operation, order, status and contract. We explain each in detail below.

Order Event

```
<OrderState.FuturesOrder: 'FORDER'> {
    'event_id': 'v1:FO:BO7SLUCIyeI:BOnXGyd:1',
    'operation': {
        'op_type': 'New',
        'op_code': '00',
        'op_msg': ''
    },
    'order': {
        'id': '0bbe4f6d',
        'seqno': '354926',
        'ordno': 'ta0fu',
        'account': {
            'account_type': 'F',
            'person_id': '',
            'broker_id': 'YOUR_BROKER_ID',
            'account_id': 'YOUR_ACCOUNT_ID',
            'signed': True,
            'username': ''
        },
        'action': 'Buy',
        'price': 36112.0,
        'quantity': 1,
        'order_type': 'ROD',
        'price_type': 'LMT',
        'market_type': 'Day',
        'oc_type': 'New',
        'subaccount': '',
        'combo': False
    },
    'status': {
        'id': '0bbe4f6d',
        'exchange_ts': 1779331888.0,
        'modified_price': 0.0,
        'cancel_quantity': 0,
        'order_quantity': 1,
        'web_id': 'Z'
    },
    'contract': {
        'security_type': 'FUT',
        'code': 'TMF',
        'exchange': 'TIM',
        'delivery_month': '202606',
        'full_code': 'TMFF6',
        'delivery_date': '',
        'strike_price': 0.0,
        'option_right': 'Future'
    }
}

```

Order Event Info.

**event_id** (1.7.6+)

```
event_id (str): report identity, used for deduplication and gap detection

```

**operation**

```
op_type (str): {
        "New": new order, 
        "Cancel": cancel order, 
        "UpdatePrice": update price, 
        "UpdateQty": update quantity
    }
op_code (str): {"00": success, others: fail}
op_msg (str): error message

```

**order**

```
id (str): same as the trade_id in the deal event
seqno (str): platform sequence number
ordno (str): order number
account (dict): account info
action (str): {Buy, Sell}
price (float or int): order price
quantity (int): order quantity
order_cond (str): {
            Cash: cash, 
            MarginTrading: margin trading, 
            ShortSelling: short selling
        }
order_type (str): order type {ROD, IOC, FOK}
price_type (str): {LMT: limit, MKT: market, MKP: range market}
market_type (str): market session {Day: day session, Night: night session}
oc_type (str): {
            New: open position, 
            Cover: close position, 
            Auto: auto, 
            DayTrade: day trade
        }
subaccount(str): sub-account
combo (bool): whether it is a combo order

```

**status**

```
id (str): same as the trade_id in the deal event
exchange_ts (int): exchange time
modified_price (float or int): modified price
cancel_quantity (int): cancel quantity
order_quantity (int): order quantity
web_id (str): order platform code

```

**contract**

```
security_type (str): security type
code (str): contract code
full_code (str): contract code (including delivery month)
exchange (str): exchange
delivery_month (str): delivery month
delivery_date (str): delivery date
strike_price (float): strike price
option_right (str): {Future, OptionCall, OptionPut}

```

## Deal Event

When an order is matched, the stock exchange sends a deal event. A match can be a partial fill or a complete fill. Match the `id` in the order event with the `trade_id` in the deal event to confirm they belong to the same order.

Deal Event

```
<OrderState.StockDeal: 'SDEAL'> {
    'event_id': 'v1:SD:A1EGVO30H:BOnKZSD:7',
    'trade_id': '9c6ae2eb',
    'seqno': '269866',
    'ordno': 'IN497',
    'exchange_seq': '669915',
    'broker_id': 'YOUR_BROKER_ID',
    'account_id': 'YOUR_ACCOUNT_ID',
    'action': 'Buy',
    'code': '2890',
    'order_cond': 'Cash',
    'order_lot': 'IntradayOdd',
    'price': 267.5,
    'quantity': 3,
    'web_id': '137',
    'custom_field': 'test',
    'ts': 1673577256.354
}

```

Deal Event

```
event_id (str): report identity, used for deduplication and gap detection (1.7.6+)
trade_id (str): same as the id in the order event
seqno (str): platform sequence number
ordno (str): the first 5 characters are the order number from the order event; the last 3 characters are the deal sequence number of that order.
exchange_seq (str): exchange sequence number
broker_id (str): branch code
account_id (str): account
action (str): {Buy, Sell}
code (str): contract code
order_cond (str): {
            Cash: cash, 
            MarginTrading: margin trading, 
            ShortSelling: short selling
        }
order_lot (str): {
            Common: board lot, 
            Fixing: fixing, 
            Odd: after-hours odd lot, 
            IntradayOdd: intraday odd lot
        }
price (float or int): deal price
quantity (int): deal quantity
web_id (str): platform code
custom_field (str): custom field
ts (int): deal timestamp

```

When an order is matched, the futures exchange sends a deal event. A match can be a partial fill or a complete fill. Match the `id` in the order event with the `trade_id` in the deal event to confirm they belong to the same order.

Deal Event

```
<OrderState.FuturesDeal: 'FDEAL'> {
    'event_id': 'v1:FD:BO7SLUCIyeI:BOnXGyd:5',
    'trade_id': '4e6df0f6',
    'seqno': '458545',
    'ordno': 'tA0deX1O',
    'exchange_seq': 'j5006396',
    'action': 'Sell',
    'code': 'TX1',
    'price': 25.0,
    'quantity': 1,
    'subaccount': '',
    'security_type': 'OPT',
    'delivery_month': '202512',
    'ts': 1764685425.0,
    'broker_id': 'YOUR_BROKER_ID',
    'account_id': 'YOUR_ACCOUNT_ID',
    'full_code': 'TX127900L5',
    'strike_price': 27900.0,
    'option_right': 'OptionCall',
    'market_type': 'Day',
    'combo': False
}

```

Deal Event

```
event_id (str): report identity, used for deduplication and gap detection (1.7.6+)
trade_id (str): same as the id in the order event
seqno (str): platform sequence number
ordno (str): the first 5 characters are the order number from the order event; the last 3 characters are the deal sequence number of that order.
exchange_seq (str): exchange sequence number
broker_id (str): branch code
account_id (str): account
action (str): {Buy, Sell}
code (str): contract code
full_code (str): contract code (including delivery month)
price (float or int): deal price
quantity (int): deal quantity
subaccount (str): sub-account
security_type (str): security type
delivery_month (str): delivery month
strike_price (float): strike price
option_right (str): {Future, OptionCall, OptionPut}
market_type (str): {Day, Night}
ts (int): deal timestamp

```

Note

The exchange sends deal events with higher priority than order events, so if an order is filled immediately, you may receive the deal event before the order event.

## Handle Events

To handle order and deal events, see [Callback](../tutor/../../callback/orderdeal_event.md) for details.
