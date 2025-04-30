### 委託回報

當證交所收到委託將會回傳回報。在回報中分為四部分，包括operation、order、status及contract。以下我們會在進行詳細的說明。

委託回報

```
OrderState.StockOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': '97b63e2f', 
        'seqno': '267677', 
        'ordno': 'IM394', 
        'account': {
            'account_type': 'S', 
            'person_id': '', 
            'broker_id': '9A95', 
            'account_id': '1234567', 
            'signed': True
        }, 
        'action': 'Buy', 
        'price': 16.0, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'order_cond': 'Cash', 
        'order_lot': 'Common', 
        'custom_field': 'test'
    }, 
    'status': {
        'id': '97b63e2f', 
        'exchange_ts': 1673576134.038, 
        'modified_price': 0.0, 
        'cancel_quantity': 0, 
        'order_quantity': 1, 
        'web_id': '137'
    }, 
    'contract': {
        'security_type': 'STK', 
        'exchange': 'TSE', 
        'code': '2890', 
        'symbol': '', 
        'name': '', 
        'currency': 'TWD'
    }
}

```

```
OrderState.TFTOrder {
    'operation': {
        'op_type': 'New', 
        'op_code': '00', 
        'op_msg': ''
    }, 
    'order': {
        'id': '97b63e2f', 
        'seqno': '267677', 
        'ordno': 'IM394', 
        'account': {
            'account_type': 'S', 
            'person_id': '', 
            'broker_id': '9A95', 
            'account_id': '1234567', 
            'signed': True
        }, 
        'action': 'Buy', 
        'price': 16.0, 
        'quantity': 1, 
        'order_type': 'ROD', 
        'price_type': 'LMT', 
        'order_cond': 'Cash', 
        'order_lot': 'Common', 
        'custom_field': 'test'
    }, 
    'status': {
        'id': '97b63e2f', 
        'exchange_ts': 1673576134.038, 
        'modified_price': 0.0, 
        'cancel_quantity': 0, 
        'order_quantity': 1, 
        'web_id': '137'
    }, 
    'contract': {
        'security_type': 'STK', 
        'exchange': 'TSE', 
        'code': '2890', 
        'symbol': '', 
        'name': '', 
        'currency': 'TWD'
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
action (str): 買賣別 {Buy, Sell}
price (float or int): 委託價格
quantity (int): 委託數量
order_type (str): 委託類別 {ROD, IOC, FOK}
price_type (str): {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_cond (str): {
            Cash: 現股, 
            MarginTrading: 融資, 
            ShortSelling: 融券
        }
order_lot (str): {
            Common: 整股, 
            Fixing: 定盤, 
            Odd: 盤後零股, 
            IntradayOdd: 盤中零股
        }
custom_field (str): 自訂欄位

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
exchange (str): 交易所
code (str): 商品代碼
symbol (str): 符號
name (str): 商品名稱
currency (str): 幣別

```

### 成交回報

當搓合成功，證交所會傳送成交回報告知。搓合成功包含部分成交以及完全成交，可以從委託回報中的`id`去對應成交回報中的`trade_id`去確認是否為同一筆委託單。

成交回報

```
OrderState.StockDeal {
    'trade_id': '9c6ae2eb', 
    'seqno': '269866', 
    'ordno': 'IN497', 
    'exchange_seq': '669915', 
    'broker_id': '9A95', 
    'account_id': '1234567', 
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

```
OrderState.TFTDeal {
    'trade_id': '9c6ae2eb', 
    'seqno': '269866', 
    'ordno': 'IN497', 
    'exchange_seq': '669915', 
    'broker_id': '9A95', 
    'account_id': '1234567', 
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

成交回報

```
trade_id (str): 與委託回報id相同
seqno (str): 平台單號
ordno (str): 前五碼為同委託回報委託單號，後三碼為同筆委託成交交易序號。
exchange_seq (str): 回報序號
broker_id (str): 分行代碼
account_id (str): 帳號
action (str): 買賣別 {Buy, Sell}
code (str): 商品代碼
order_cond (str): {
            Cash: 現股, 
            MarginTrading: 融資, 
            ShortSelling: 融券
        }
order_lot (str): {
            Common: 整股, 
            Fixing: 定盤, 
            Odd: 盤後零股, 
            IntradayOdd: 盤中零股
        }
price (float or int): 成交價
quantity (int): 成交量
web_id (str): 平台代碼
custom_field (str): 自訂欄位
ts (int): 成交時間戳

```

注意

交易所回傳訊息優先順序成交回報大於委託回報，所以當委託立即成交可能會先收到成交回報。

### 回報處理

欲處理委託、成交回報，詳細可參見[Callback](../../../callback/orderdeal_event/)。
