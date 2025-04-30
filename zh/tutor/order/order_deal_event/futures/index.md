### 委託回報

當期交所收到委託將會回傳回報。在回報中分為四部分，包括operation、order、status及contract。以下我們會在進行詳細的說明。

委託回報

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

委託回報資訊

**operation**

```
op_type (str): {
        "New": 新單, 
        "Cancel": 刪單, 
        "UpdatePrice": 改價, 
        "UpdateQty": 改量
    }
op_code (str): {"00": 成功, others: 失敗}
op_msg (str): 錯誤訊息

```

**order**

```
id (str): 與成交回報的trade_id相同
seqno (str): 平台單號
ordno (str): 委託單號
account (dict): 帳號資訊
action (str): 買賣別
price (float or int): 委託價
quantity (int): 委託量
order_cond (str): {
            Cash: 現股, 
            MarginTrading: 融資, 
            ShortSelling: 融券
        }
order_type (str): 委託類別 {ROD, IOC, FOK}
price_type (str): {LMT: 限價, MKT: 市價, MKP: 範圍市價}
market_type (str): 市場別 {Day:日盤, Night:夜盤}
oc_type(str): {New: 新倉, Cover: 平倉, Auto: 自動}
subaccount(str): 子帳號
combo (bool): 是否為組合單

```

**status**

```
id (str): 與成交回報的trade_id相同
exchange_ts (int): 交易所時間
modified_price (float or int): 改價
cancel_quantity (int): 取消數量
order_quantity (int): 委託數量
web_id (str): 下單平台代碼

```

**contract**

```
security_type (str): 商品類別
code (str): 商品代碼
exchange (str): 交易所
delivery_month (str): 交割月份
delivery_date (str): 交割日期
strike_price (float): 履約價
option_right (str): {Future, OptionCall, OptionPut}

```

### 成交回報

當搓合成功，期交所會傳送成交回報告知。搓合成功包含部分成交以及完全成交，可以從委託回報中的`id`去對應成交回報中的`trade_id`去確認是否為同一筆委託單。

成交回報

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

成交回報

```
trade_id (str): 與委託回報id相同
seqno (str): 平台單號
ordno (str): 前五碼為同委託回報委託單號，後三碼為同筆委託成交交易序號。
exchange_seq (str): 回報序號
broker_id (str): 分行代碼
account_id (str): 帳號
action (str): 買賣別
code (str): 商品代碼
price (float or int): 成交價
quantity (int): 成交量
subaccount (str): 子帳號
security_type (str): 商品類別
delivery_month (str): 交割月份
strike_price (float): 履約價
option_right (str): {Future, OptionCall, OptionPut}
market_type (str): {Day, Night}
ts (int): 成交時間戳    

```

注意

交易所回傳訊息優先順序成交回報大於委託回報，所以當委託立即成交可能會先收到成交回報。

### 回報處理

欲處理委託、成交回報，詳細可參見[Callback](../../../callback/orderdeal_event/)。
