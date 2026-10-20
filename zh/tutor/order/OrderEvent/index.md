可利用訂閱的方式使系統主動推播委託及成交的回報資訊。

## 訂閱回報

我們提供 2 個方式讓您可以調整訂閱委託/成交回報。首先是於 `login` 的參數 `subscribe_trade`，預設值為 `True`，會自動為您訂閱所有帳號的委託/成交回報。

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

另一個方式是，對特定帳號使用 API `subscribe_trade` 及 `unsubscribe_trade`，即可訂閱或取消訂閱委託/成交回報。

subscribe trade

```
api.subscribe_trade(account)

```

unsubscribe trade

```
api.unsubscribe_trade(account)

```

server 啟動時不自動訂閱，需逐帳號動態訂閱。

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
--account-type: 選填，S（證券，預設）或 F（期貨/選擇權）
--account:      選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用該類型的預設帳號

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

注意

`subscribe-trade` 只負責向 server 登記訂閱，執行完即結束。實際接收委託/成交回報請使用 `shioaji order events`（SSE 串流，Ctrl+C 停止），詳見[委託回報](./callback/orderdeal_event.md)。

server 啟動時不自動訂閱，需逐帳號動態訂閱。

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

## 委託回報

當證交所收到委託將會回傳回報。在回報中分為四部分，包括operation、order、status及contract。以下我們會在進行詳細的說明。

委託回報

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

委託回報資訊

**event_id**（1.7.6 起）

```
event_id (str): 回報識別碼，用於去重與跳號判讀

```

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

當期交所收到委託將會回傳回報。在回報中分為四部分，包括operation、order、status及contract。以下我們會在進行詳細的說明。

委託回報

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

委託回報資訊

**event_id**（1.7.6 起）

```
event_id (str): 回報識別碼，用於去重與跳號判讀

```

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
oc_type (str): {
            New: 新倉, 
            Cover: 平倉, 
            Auto: 自動, 
            DayTrade: 當沖
        }
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
full_code (str): 商品代碼(含交割月份)
exchange (str): 交易所
delivery_month (str): 交割月份
delivery_date (str): 交割日期
strike_price (float): 履約價
option_right (str): {Future, OptionCall, OptionPut}

```

-->

## 成交回報

當搓合成功，證交所會傳送成交回報告知。搓合成功包含部分成交以及完全成交，可以從委託回報中的`id`去對應成交回報中的`trade_id`去確認是否為同一筆委託單。

成交回報

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

成交回報

```
event_id (str): 回報識別碼，用於去重與跳號判讀（1.7.6 起）
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

當搓合成功，期交所會傳送成交回報告知。搓合成功包含部分成交以及完全成交，可以從委託回報中的`id`去對應成交回報中的`trade_id`去確認是否為同一筆委託單。

成交回報

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

成交回報

```
event_id (str): 回報識別碼，用於去重與跳號判讀（1.7.6 起）
trade_id (str): 與委託回報id相同
seqno (str): 平台單號
ordno (str): 前五碼為同委託回報委託單號，後三碼為同筆委託成交交易序號。
exchange_seq (str): 回報序號
broker_id (str): 分行代碼
account_id (str): 帳號
action (str): 買賣別
code (str): 商品代碼
full_code (str): 商品代碼(含交割月份)
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

欲處理委託、成交回報，詳細可參見[Callback](../tutor/../../callback/orderdeal_event.md)。
