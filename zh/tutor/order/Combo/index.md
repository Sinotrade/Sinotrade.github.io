提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

組合單（Combo Order）將多支期貨／選擇權合約綁定為單一委託送出，提供類型包括**價格價差**、**時間價差**、**跨式**、**勒式**、**轉換**以及**逆轉**，組合規則詳見期交所[文件](https://www.taifex.com.tw/cht/5/margingReqIndexOpt)。

## 下單

place_comboorder

```
api.place_comboorder?

Signature:
    api.place_comboorder(
        combo_contract: sj.ComboContract,
        order: Union[sj.ComboOrder, sj.FuturesOrder],
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_contract: 組合商品檔，含多個 ComboBase legs
order:          組合委託單（ComboOrder 或 FuturesOrder）
timeout:        逾時毫秒
cb:             選填，callback 函式

```

sj.ComboOrder

```
action (Action):                買賣別 {Buy: 買, Sell: 賣}
price (float or int):           價格
quantity (int):                 數量
price_type (FuturesPriceType):  價格別 {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_type (OrderType):         委託條件 {ROD, IOC, FOK}
octype (FuturesOCType):         倉別 {Auto: 自動, New: 新倉, Cover: 平倉, DayTrade: 當沖}
combo_type (ComboType):         選填，組合類型；省略時由 legs 自動推導
account (Account):              下單帳號

```

sj.ComboBase

```
action (Action):              買賣別 {Buy: 買, Sell: 賣}
security_type (SecurityType): 商品類型 {FUT, OPT}
exchange (Exchange):          交易所
code (str):                   商品代碼

```

place_comboorder

```
POST /api/v1/order/place_comboorder
Content-Type: application/json

{
  "combo_contract": {
    "legs": [
      {
        "action": <Action>,
        "security_type": <SecurityType>,
        "exchange": <Exchange>,
        "code": <string>,
        "category": <string>,
        "delivery_month": <string>,
        "strike_price": <number>,
        "option_right": <string>
      }
    ]
  },
  "order": {
    "action": <Action>,
    "price": <number>,
    "quantity": <integer>,
    "price_type": <FuturesPriceType>,
    "order_type": <OrderType>,
    "octype": <FuturesOCType>,
    "account": { "broker_id": <string>, "account_id": <string> }
  }
}

```

Parameters

```
combo_contract.legs[].action:         買賣別 {Buy, Sell}
combo_contract.legs[].security_type:  商品類型 {FUT, OPT}
combo_contract.legs[].exchange:       交易所
combo_contract.legs[].code:           商品代碼
combo_contract.legs[].category:       商品類別
combo_contract.legs[].delivery_month: 到期月份 YYYYMM
combo_contract.legs[].strike_price:   履約價（期貨可填 null）
combo_contract.legs[].option_right:   買賣權別 {C, P}（期貨可填 null）
order.action:                         買賣別 {Buy, Sell}
order.price:                          價格
order.quantity:                       數量
order.price_type:                     價格別 {LMT, MKT, MKP}
order.order_type:                     委託條件 {ROD, IOC, FOK}
order.octype:                         倉別 {Auto, New, Cover, DayTrade}
order.account:                        下單帳號（省略則使用預設期貨帳號）

```

### 範例

Order

```
# 商品檔（賣出跨式：同到期、同履約價，賣 Call + 賣 Put）
call = api.Contracts.Options.TXO.get("TXO20260527000C")
put = api.Contracts.Options.TXO.get("TXO20260527000P")
combo_contract = sj.ComboContract(
    legs=[
        sj.ComboBase.from_contract(call, action=sj.Action.Sell),
        sj.ComboBase.from_contract(put, action=sj.Action.Sell),
    ]
)
# 委託內容
order = sj.ComboOrder(
    action=sj.Action.Sell,
    price=1,
    quantity=1,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.IOC,
    octype=sj.FuturesOCType.New,
    account=api.futopt_account,
)

```

In

```
# 下單
trade = api.place_comboorder(combo_contract, order)
trade

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "combo_contract": {
      "legs": [
        {
          "action": "Sell",
          "security_type": "OPT",
          "exchange": "TAIFEX",
          "code": "TXO20260527000C",
          "symbol": "TXO20260527000C",
          "category": "TXO",
          "delivery_month": "202605",
          "strike_price": 27000,
          "option_right": "C"
        },
        {
          "action": "Sell",
          "security_type": "OPT",
          "exchange": "TAIFEX",
          "code": "TXO20260527000P",
          "symbol": "TXO20260527000P",
          "category": "TXO",
          "delivery_month": "202605",
          "strike_price": 27000,
          "option_right": "P"
        }
      ]
    },
    "order": {
      "action": "Sell",
      "price": 1,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "IOC",
      "octype": "New",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

## 刪單

`trade` 為要刪的單，可從[查詢狀態](#_4)取得。

cancel_comboorder

```
api.cancel_comboorder?

Signature:
    api.cancel_comboorder(
        combo_trade: sj.ComboTrade,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_trade: 欲刪除的組合單物件（從 list_combotrades / update_combostatus 取得）
timeout:     逾時毫秒
cb:          選填，callback 函式

```

cancel_comboorder

```
POST /api/v1/order/cancel_comboorder
Content-Type: application/json

{
  "trade_id": <string>
}

```

Parameters

```
trade_id: 組合單 ID（取自 place 回傳的 status.id）

```

### 範例

In

```
api.cancel_comboorder(trade)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/cancel_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "trade_id": "YOUR_TRADE_ID"
  }'

```

## 查詢狀態

如同 `list_trades` 及 `update_status` 的概念，取得組合單狀態前，必須先呼叫 `update_combostatus` 更新；HTTP `/order/combotrades` 端點則一次完成「更新 + 取得」。

update_combostatus / list_combotrades

```
api.update_combostatus?

Signature:
    api.update_combostatus(
        account: Optional[sj.Account] = None,
        timeout: Optional[int] = 5000,
        cb: Optional[Callable[[List[sj.ComboTrade]], None]] = None,
    ) -> List[sj.ComboTrade]

api.list_combotrades?

Signature:
    api.list_combotrades() -> List[sj.ComboTrade]

```

Parameters

```
update_combostatus
    account: 期貨帳號；省略則更新名下所有期貨帳號
    timeout: 逾時毫秒
    cb:      選填，callback 函式

list_combotrades
    （無參數，從本地快取回傳已知組合單）

```

combotrades

```
POST /api/v1/order/combotrades
Content-Type: application/json

{
  "account": { "broker_id": <string>, "account_id": <string> }
}

```

Parameters

```
account: 期貨帳號

```

### 範例

In

```
api.update_combostatus(api.futopt_account)
api.list_combotrades()

```

Out

```
[
    ComboTrade(
        contract=ComboContract(
            legs=[
                ComboBase(
                    action=<Action.Sell: 'Sell'>,
                    security_type=<SecurityType.Option: 'OPT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXO20260527000C',
                    symbol='TXO20260527000C',
                    category='TXO',
                    delivery_month='202605',
                    strike_price=27000.0,
                    option_right=<OptionRight.Call: 'C'>
                ),
                ComboBase(
                    action=<Action.Sell: 'Sell'>,
                    security_type=<SecurityType.Option: 'OPT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXO20260527000P',
                    symbol='TXO20260527000P',
                    category='TXO',
                    delivery_month='202605',
                    strike_price=27000.0,
                    option_right=<OptionRight.Put: 'P'>
                )
            ]
        ),
        order=Order(
            id='46989de8',
            action=<Action.Sell: 'Sell'>,
            price=1.0,
            quantity=1,
            seqno='743595',
            ordno='000000',
            order_type=<OrderType.IOC: 'IOC'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=FutureAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            octype=<FuturesOCType.New: 'New'>
        ),
        status=ComboStatus(
            id='46989de8',
            status=<OrderStatus.Submitted: 'Submitted'>,
            status_code='0000',
            order_datetime=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_time=datetime.datetime(2026, 5, 20, 11, 24, 30, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_price=1.0,
            order_quantity=1,
            deals={}
        )
    )
]

```

In

```
curl -X POST http://localhost:8080/api/v1/order/combotrades \
  -H 'Content-Type: application/json' \
  -d '{
    "account": {
      "broker_id": "YOUR_BROKER_ID",
      "account_id": "YOUR_ACCOUNT_ID"
    }
  }'

```

Out

```
[{"contract":{"legs":[{"action":"Sell","security_type":"OPT","exchange":"TAIFEX","code":"TXO20260527000C","symbol":"TXO20260527000C","category":"TXO","delivery_month":"202605","strike_price":27000.0,"option_right":"C"},{"action":"Sell","security_type":"OPT","exchange":"TAIFEX","code":"TXO20260527000P","symbol":"TXO20260527000P","category":"TXO","delivery_month":"202605","strike_price":27000.0,"option_right":"P"}]},"order":{"id":"46989de8","action":"Sell","price":1.0,"quantity":1,"seqno":"743595","ordno":"000000","order_type":"IOC","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"New"},"status":{"id":"46989de8","status":"Submitted","status_code":"0000","order_datetime":"2026-05-20T11:24:30+08:00","modified_time":"2026-05-20T11:24:30+08:00","modified_price":1.0,"order_quantity":1,"deals":{}}}]

```
