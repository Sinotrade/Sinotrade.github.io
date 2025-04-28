### Order CallBack

When the exchange receives the order, it will return the callback. The callback is divided into four parts, including operation, order, status and contract. We will explain in detail below.

Order Event

```
OrderState.FuturesOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': 'fcb42a6e', 
        'seqno': '585886', 
        'ordno': '00', 
        'account': {
            'account_type': 'F', 
            'person_id': '', 
            'broker_id': 'F002000', 
            'account_id': '1234567', 
            'signed': True
        }, 
        'action': 'Buy', 
        'price': 14000.0, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'market_type': 'Night', 
        'oc_type': 'New', 
        'subaccount': '', 
        'combo': False
    }, 
    'status': {
        'id': 'fcb42a6e', 
        'exchange_ts': 1673512283.0, 
        'modified_price': 0.0, 
        'cancel_quantity': 0, 
        'order_quantity': 1, 
        'web_id': 'Z'
    }, 
    'contract': {
        'security_type': 'FUT', 
        'code': 'TXF', 
        'exchange': 'TIM', 
        'delivery_month': '202301', 
        'delivery_date': '', 
        'strike_price': 0.0, 
        'option_right': 'Future'
    }
}

```

```
OrderState.FOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': 'fcb42a6e', 
        'seqno': '585886', 
        'ordno': '00', 
        'account': {
            'account_type': 'F', 
            'person_id': '', 
            'broker_id': 'F002000', 
            'account_id': '1234567', 
            'signed': True
        }, 
        'action': 'Buy', 
        'price': 14000.0, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'market_type': 'Night', 
        'oc_type': 'New', 
        'subaccount': '', 
        'combo': False
    }, 
    'status': {
        'id': 'fcb42a6e', 
        'exchange_ts': 1673512283.0, 
        'modified_price': 0.0, 
        'cancel_quantity': 0, 
        'order_quantity': 1, 
        'web_id': 'Z'
    }, 
    'contract': {
        'security_type': 'FUT', 
        'code': 'TXF', 
        'exchange': 'TIM', 
        'delivery_month': '202301', 
        'delivery_date': '', 
        'strike_price': 0.0, 
        'option_right': 'Future'
    }
}

```

Order CallBack Info.

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
id (str): same as the trade_id in FuturesDeal
seqno (str): sequence number
ordno (str): order number
account (dict): account info
action (str): {Buy, Sell}
price (float or int): order price
quantity (int): order quantity
order_type (str): the type of order {ROD, IOC, FOK}
price_type (str): pricing type of order {LMT, MKT, MKP}
market_type (str): {Day, Night}
oc_type (str): {New: 新倉, Cover: 平倉, Auto: 自動}
subaccount (str): subaccount
combo (bool): whether order is combo order

```

**status**

```
id (str): same as the trade_id in FuturesDeal
exchange_ts (int): exchange time
modified_price (float or int): modified price
cancel_quantity (int): cancel quantity
order_quantity (int): irder quantity
web_id (str): web id

```

**contract**

```
security_type (str): security type
code (str): code id
exchange (str): exchange
delivery_month (str): delivery month
delivery_date (str): delivery date
strike_price (float): strike price
option_right (str): {Future, OptionCall, OptionPut}

```

### Deal CallBack

When the matching is successful, the exchange will send a transaction report notification. Successful matching includes partial transactions and complete transactions. You can confirm whether it is the same order from the `id` in the order callback to the `trade_id` in the deal callback.

Deal Event

```
OrderState.FuturesDeal {
    'trade_id': '4e6df0f6', 
    'seqno': '458545', 
    'ordno': 'tA0deX1O', 
    'exchange_seq': 'j5006396', 
    'broker_id': 'F002000', 
    'account_id': '1234567', 
    'action': 'Sell', 
    'code': 'TXO', 
    'price': 58.0, 
    'quantity': 1, 
    'subaccount': '', 
    'security_type': 'OPT', 
    'delivery_month': '202301', 
    'strike_price': 14300.0, 
    'option_right': 'OptionPut', 
    'market_type': 'Day', 
    'combo': False, 
    'ts': 1673270852.0
}

```

```
OrderState.FDeal {
    'trade_id': '4e6df0f6', 
    'seqno': '458545', 
    'ordno': 'tA0deX1O', 
    'exchange_seq': 'j5006396', 
    'broker_id': 'F002000', 
    'account_id': '1234567', 
    'action': 'Sell', 
    'code': 'TXO', 
    'price': 58.0, 
    'quantity': 1, 
    'subaccount': '', 
    'security_type': 'OPT', 
    'delivery_month': '202301', 
    'strike_price': 14300.0, 
    'option_right': 'OptionPut', 
    'market_type': 'Day', 
    'combo': False, 
    'ts': 1673270852.0
}

```

FuturesDeal

```
trade_id (str): same as the id in FuturesOrder
seqno (str): sequence number
ordno (str): The first 5 characters is the same as ordno in FuturesOrder. The last 3 characters represent the deal sequence number.
exchange_seq (str): exchange sequence number
broker_id (str): broker id
account_id (str): account
action (str): buy/sell
code (str): code
price (float or int): deal price
quantity (int): deal quantity
subaccount (str): subaccount
security_type (str): security type
delivery_month (str): delivery month
strike_price (float): strike price
option_right (str): {Future, OptionCall, OptionPut}
market_type (str): {Day, Night}
ts (int): deal timestamp    

```

Note

you "may" recieve the deal event sooner than the order event due to message priority in exchange.

### Handle Callback

If you would like to handle callback info, please refer to [Callback](../../../callback/orderdeal_event/).
