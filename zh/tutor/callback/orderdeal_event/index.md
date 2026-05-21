每次您使用 `place_order`、`update_order` 或者 `cancel_order` 時，皆會收到來自交易所的委託或成交回報。我們亦提供了處理委託及成交回報的介面。如果您正在建立自己的交易系統，這會非常有幫助。

注意

預約單時段（盤前）下單不會收到回報。預約單會在每個交易日 08:30 放單，屆時才會觸發委託回報。

## 處理委託及成交回報

您可以使用 `set_order_callback` 來處理委託及成交回報。以下範例顯示，自製的委託回報函數(`order_cb`)將先 print `my_order_callback` 然後才 print 委託及成交回報。

設定委託回報函式

```
# 方式一：decorator
@api.on_order
def order_cb(stat, msg):
    print('my_order_callback')
    print(stat, msg)

# 方式二：傳統寫法
def order_cb(stat, msg):
    print('my_order_callback')
    print(stat, msg)
api.set_order_callback(order_cb)

```

下單

```
# 商品檔
contract = api.Contracts.Stocks.TSE.TSE2890
# 委託內容
order = sj.StockOrder(
    action=sj.Action.Buy,
    price=27.1,
    quantity=2,
    price_type=sj.StockPriceType.LMT,
    order_type=sj.OrderType.ROD,
    order_lot=sj.StockOrderLot.Common,
    order_cond=sj.StockOrderCond.Cash,
    account=api.stock_account,
)
# 下單
trade = api.place_order(contract, order)

```

#### 委託回報

Out

```
my_order_callback
<OrderState.StockOrder: 'SORDER'> {
    'operation': {
        'op_type': 'New',
        'op_code': '00',
        'op_msg': ''
    },
    'order': {
        'id': '892f730b',
        'seqno': '361840',
        'ordno': 'Y23CL',
        'account': {
            'account_type': 'S',
            'person_id': '',
            'broker_id': 'YOUR_BROKER_ID',
            'account_id': 'YOUR_ACCOUNT_ID',
            'signed': True,
            'username': ''
        },
        'action': 'Buy',
        'price': 26.85,
        'quantity': 1,
        'order_type': 'ROD',
        'price_type': 'LMT',
        'order_cond': 'Cash',
        'order_lot': 'Common',
        'custom_field': ''
    },
    'status': {
        'id': '892f730b',
        'exchange_ts': 1779333919.92,
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

#### 成交回報

Out

```
my_order_callback
<OrderState.StockDeal: 'SDEAL'> {
    'trade_id': '9c6ae2eb',
    'seqno': '269866',
    'ordno': 'IN497',
    'exchange_seq': '669915',
    'broker_id': 'YOUR_BROKER_ID',
    'account_id': 'YOUR_ACCOUNT_ID',
    'action': 'Buy',
    'code': '2890',
    'order_cond': 'Cash',
    'order_lot': 'Common',
    'price': 27.1,
    'quantity': 2,
    'web_id': '137',
    'custom_field': '',
    'ts': 1779333920.0
}

```

接收委託成交回報

```
shioaji order events

```

此指令會持續輸出委託 / 成交回報，按 Ctrl+C 停止。

下單（在另一個 terminal 執行）

```
shioaji order place \
  --code 2890 \
  --action buy \
  --price 27.1 \
  --quantity 2 \
  --price-type lmt \
  --order-type rod \
  --order-lot common \
  --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

**委託回報**

Out

```
{
  "state": "StockOrder",
  "data": {
    "StockOrder": {
      "operation": {"op_type": "New", "op_code": "00", "op_msg": ""},
      "order": {
        "id": "892f730b",
        "seqno": "361840",
        "ordno": "Y23CL",
        "account": {
          "account_type": "S",
          "person_id": "",
          "broker_id": "YOUR_BROKER_ID",
          "account_id": "YOUR_ACCOUNT_ID",
          "signed": true,
          "username": ""
        },
        "action": "Buy",
        "price": 26.85,
        "quantity": 1,
        "order_type": "ROD",
        "price_type": "LMT",
        "order_cond": "Cash",
        "order_lot": "Common",
        "custom_field": ""
      },
      "status": {
        "id": "892f730b",
        "exchange_ts": 1779333919.92,
        "modified_price": 0.0,
        "cancel_quantity": 0,
        "order_quantity": 1,
        "web_id": "137"
      },
      "contract": {
        "exchange": "TSE",
        "code": "2890",
        "security_type": "STK",
        "symbol": "",
        "name": "",
        "currency": "TWD"
      }
    }
  }
}

```

**成交回報**

Out

```
{
  "state": "StockDeal",
  "data": {
    "StockDeal": {
      "trade_id": "9c6ae2eb",
      "seqno": "269866",
      "ordno": "IN497",
      "exchange_seq": "669915",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "action": "Buy",
      "code": "2890",
      "order_cond": "Cash",
      "order_lot": "Common",
      "price": 27.1,
      "quantity": 2,
      "web_id": "137",
      "custom_field": "",
      "ts": 1779333920.0
    }
  }
}

```

接收委託成交回報

```
curl -N http://localhost:8080/api/v1/stream/data/order_event

```

此指令會持續輸出委託 / 成交回報，按 Ctrl+C 停止。

下單（在另一個 terminal 執行）

```
curl -X POST http://localhost:8080/api/v1/order/place_order \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {"security_type": "STK", "exchange": "TSE", "code": "2890"},
    "stock_order": {
      "action": "Buy",
      "price": 27.1,
      "quantity": 2,
      "price_type": "LMT",
      "order_type": "ROD",
      "order_lot": "Common",
      "order_cond": "Cash",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

**委託回報**

Out

```
event:order_event
data:{
  "state": "StockOrder",
  "data": {
    "StockOrder": {
      "operation": {"op_type": "New", "op_code": "00", "op_msg": ""},
      "order": {
        "id": "892f730b",
        "seqno": "361840",
        "ordno": "Y23CL",
        "account": {
          "account_type": "S",
          "person_id": "",
          "broker_id": "YOUR_BROKER_ID",
          "account_id": "YOUR_ACCOUNT_ID",
          "signed": true,
          "username": ""
        },
        "action": "Buy",
        "price": 26.85,
        "quantity": 1,
        "order_type": "ROD",
        "price_type": "LMT",
        "order_cond": "Cash",
        "order_lot": "Common",
        "custom_field": ""
      },
      "status": {
        "id": "892f730b",
        "exchange_ts": 1779333919.92,
        "modified_price": 0.0,
        "cancel_quantity": 0,
        "order_quantity": 1,
        "web_id": "137"
      },
      "contract": {
        "exchange": "TSE",
        "code": "2890",
        "security_type": "STK",
        "symbol": "",
        "name": "",
        "currency": "TWD"
      }
    }
  }
}

```

**成交回報**

Out

```
event:order_event
data:{
  "state": "StockDeal",
  "data": {
    "StockDeal": {
      "trade_id": "9c6ae2eb",
      "seqno": "269866",
      "ordno": "IN497",
      "exchange_seq": "669915",
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID",
      "action": "Buy",
      "code": "2890",
      "order_cond": "Cash",
      "order_lot": "Common",
      "price": 27.1,
      "quantity": 2,
      "web_id": "137",
      "custom_field": "",
      "ts": 1779333920.0
    }
  }
}

```
