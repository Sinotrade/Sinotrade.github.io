提醒

下單前必須先[登入](../../login/)及啟用[憑證](../../prepare/terms/)。

組合單（Combo Order）將兩支期貨／選擇權合約綁定為單一委託送出。組合單的完整規範請見期交所[委託單種介紹](https://www.taifex.com.tw/cht/4/oamIntroduction)，保證金資訊請見[結算保證金頁面](https://www.taifex.com.tw/cht/5/margingReqIndexOpt)。

下單前請先建立組合合約，建法見[商品合約](../../contract/#combo)。

## 下單

組合單買賣的是**整個組合**。依期交所定義「價差委託之買賣別和遠月份契約相同」，買進跨月價差即買遠月、賣近月；各類型的定義如下（**買賣方向與淨價表**）：

| 類型 | `sj.ComboType` | `action=Buy` | `action=Sell` | 淨價（`price`） | | --- | --- | --- | --- | --- | | 跨月價差 | `TimeSpread`／`WeeklyTimeSpread` | 賣近、買遠 | 買近、賣遠 | 遠 − 近（可為負值） | | 買權價差 | `PriceSpread` | 賣高履約價、買低履約價 | 買高履約價、賣低履約價 | 低履約價權利金 − 高履約價權利金 | | 賣權價差 | `PriceSpread` | 賣低履約價、買高履約價 | 買低履約價、賣高履約價 | 高履約價權利金 − 低履約價權利金 | | 跨式／勒式 | `Straddle`／`Strangle` | 買 Call、買 Put | 賣 Call、賣 Put | Call 權利金 + Put 權利金 | | 轉換／逆轉 | `ConversionReversal` | 賣 Call、買 Put（轉換） | 買 Call、賣 Put（逆轉） | Put 權利金 − Call 權利金 |

`price` 為整個組合的淨價，非任何一支商品的價格，定義見買賣方向與淨價表；下單前的報價參考見[組合商品行情](../../market_data/streaming/combo/)。

價格範圍限制

組合單委託價格有範圍限制：以跨月價差為例，上限為遠月漲停價減近月跌停價、 下限為遠月跌停價減近月漲停價，超出範圍的委託交易所不接受。

委託條件限制

- 標準選擇權組合**不可用 `ROD`**，請以 `LMT` 搭配 `IOC` 或 `FOK` 送單； 若以 `ROD` 送單，會被期交所以 `9927 委託條件錯誤` 退單。
- 期貨跨月價差於盤中可依商品規則使用 `ROD`。
- 盤前不接受組合單。

place_comboorder

```
api.place_comboorder?

Signature:
    api.place_comboorder(
        combo_contract: sj.ComboContract,
        order: Union[sj.ComboOrder, sj.FuturesOrder],
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_contract: 組合合約（建法見「商品合約」頁）
order:          組合委託單（ComboOrder 或 FuturesOrder）
timeout:        逾時毫秒
cb:             選填，callback 函式，timeout=0 時使用

```

sj.ComboOrder

```
action (Action):                買賣別 {Buy: 買, Sell: 賣}，必填；依買賣方向與淨價表
                                展開兩支商品的方向
price (float or int):           淨價，定義見上表，可為負值
quantity (int):                 數量（兩支商品同量）
price_type (FuturesPriceType):  價格別 {LMT: 限價, MKT: 市價, MKP: 範圍市價}
order_type (OrderType):         委託條件 {ROD, IOC, FOK}
octype (FuturesOCType):         倉別 {Auto: 自動, New: 新倉, Cover: 平倉, DayTrade: 當沖}
combo_type (ComboType):         選填；自動帶入推導結果，明填時必須相符
account (Account):              下單帳號（省略則使用預設期貨帳號）

```

`combo_contract` 的 legs 不帶買賣別（形狀見[商品合約](../../contract/#combo)）； `order.action` 為必填欄位。

place_comboorder

```
POST /api/v1/order/place_comboorder
Content-Type: application/json

{
  "combo_contract": { "legs": [ ... ] },
  "order": {
    "action": <Action>,
    "price": <number>,
    "quantity": <integer>,
    "price_type": <FuturesPriceType>,
    "order_type": <OrderType>,
    "octype": <FuturesOCType>,
    "combo_type": <ComboType>,
    "account": { "broker_id": <string>, "account_id": <string> }
  }
}

```

Parameters

```
combo_contract:   組合合約（見「商品合約」頁）
order.action:     買賣別 {Buy, Sell}，必填；依此展開兩支商品的方向
order.price:      淨價，可為負值
order.quantity:   數量（兩支商品同量）
order.price_type: 價格別 {LMT, MKT, MKP}
order.order_type: 委託條件 {ROD, IOC, FOK}
order.octype:     倉別 {Auto, New, Cover, DayTrade}
order.combo_type: 選填，組合類型
order.account:    下單帳號（省略則使用預設期貨帳號）

```

### 範例

**期貨跨月價差**，以買進價差（賣近月、買遠月）為例。組合方式：同商品、不同到期月的兩支期貨，近月在前。

- 合約：`legs=[近月, 遠月]`，不帶買賣別
- 委託：`action=Buy`（買進價差，Shioaji 展開為賣近月、買遠月）

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

order = sj.ComboOrder(
    action=sj.Action.Buy,  # 買進價差：由 Shioaji 展開為賣近月、買遠月
    price=50,  # 淨價（遠月 − 近月）
    quantity=1,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.ROD,
    octype=sj.FuturesOCType.Auto,
    account=api.futopt_account,
)
trade = api.place_comboorder(combo_contract, order)
trade

```

Out

```
ComboTrade(
    contract=ComboContract(
        legs=[
            Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFH6'),
            Contract(security_type='FUT', region='TW', exchange='TAIFEX', code='TXFI6')
        ],
        combo_type=TimeSpread
    ),
    order=Order(
        id='46989de8',
        action=<Action.Buy: 'Buy'>,
        price=50.0,
        quantity=1,
        seqno='743595',
        ordno='000000',
        order_type=<OrderType.ROD: 'ROD'>,
        price_type=<PriceType.LMT: 'LMT'>,
        account=FutureAccount(
            person_id='YOUR_PERSON_ID',
            broker_id='YOUR_BROKER_ID',
            account_id='YOUR_ACCOUNT_ID',
            signed=true,
            username=''
        ),
        octype=<FuturesOCType.Auto: 'Auto'>
    ),
    status=ComboStatus(
        id='46989de8',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_time=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=50.0,
        order_quantity=1,
        deals={}
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "combo_contract": {
      "legs": [
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
      ]
    },
    "order": {
      "action": "Buy",
      "price": 50,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "ROD",
      "octype": "Auto",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{"contract":{"legs":[{"action":"Sell","security_type":"FUT","exchange":"TAIFEX","code":"TXFH6","symbol":"TXFH6","category":"TXF","delivery_month":"202608"},{"action":"Buy","security_type":"FUT","exchange":"TAIFEX","code":"TXFI6","symbol":"TXFI6","category":"TXF","delivery_month":"202609"}]},"order":{"id":"46989de8","action":"Buy","price":50.0,"quantity":1,"seqno":"743595","ordno":"000000","order_type":"ROD","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"Auto"},"status":{"id":"46989de8","status":"Submitted","status_code":"0000","order_datetime":"2026-08-12T11:35:00+08:00","modified_price":50.0,"order_quantity":1,"deals":{}}}

```

**選擇權跨式**，以買進跨式（買 Call、買 Put）為例。組合方式：同到期、同履約價的 Call 與 Put，Call 在前；標準選擇權組合委託條件用 `IOC`。

- 合約：`legs=[Call, Put]` ＋ `combo_type=Straddle`（必填，與轉換／逆轉同組成）
- 委託：`action=Buy`（買 Call、買 Put）

In

```
call = api.contracts.get("TXO34000I6")
put = api.contracts.get("TXO34000U6")
straddle_contract = api.contracts.combo(
    legs=[call, put],
    combo_type=sj.ComboType.Straddle,
)

order = sj.ComboOrder(
    action=sj.Action.Buy,  # 買進跨式：買 Call、買 Put
    price=1,  # 淨價（Call 權利金 + Put 權利金）
    quantity=1,
    price_type=sj.FuturesPriceType.LMT,
    order_type=sj.OrderType.IOC,  # 標準選擇權組合不可用 ROD
    octype=sj.FuturesOCType.Auto,
    account=api.futopt_account,
)
trade = api.place_comboorder(straddle_contract, order)
trade

```

Out

```
ComboTrade(
    contract=ComboContract(
        legs=[
            Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000I6'),
            Contract(security_type='OPT', region='TW', exchange='TAIFEX', code='TXO34000U6')
        ],
        combo_type=Straddle
    ),
    order=Order(
        id='a3512bd6',
        action=<Action.Buy: 'Buy'>,
        price=1.0,
        quantity=1,
        seqno='743597',
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
        octype=<FuturesOCType.Auto: 'Auto'>
    ),
    status=ComboStatus(
        id='a3512bd6',
        status=<OrderStatus.Submitted: 'Submitted'>,
        status_code='0000',
        order_datetime=datetime.datetime(2026, 8, 12, 11, 37, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_time=datetime.datetime(2026, 8, 12, 11, 37, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
        modified_price=1.0,
        order_quantity=1,
        deals={}
    )
)

```

In

```
curl -X POST http://localhost:8080/api/v1/order/place_comboorder \
  -H 'Content-Type: application/json' \
  -d '{
    "combo_contract": {
      "legs": [
        {"security_type": "OPT", "exchange": "TAIFEX", "code": "TXO34000I6"},
        {"security_type": "OPT", "exchange": "TAIFEX", "code": "TXO34000U6"}
      ],
      "combo_type": "Straddle"
    },
    "order": {
      "action": "Buy",
      "price": 1,
      "quantity": 1,
      "price_type": "LMT",
      "order_type": "IOC",
      "octype": "Auto",
      "account": {
        "broker_id": "YOUR_BROKER_ID",
        "account_id": "YOUR_ACCOUNT_ID"
      }
    }
  }'

```

Out

```
{"contract":{"legs":[{"action":"Buy","security_type":"OPT","exchange":"TAIFEX","code":"TXO34000I6","symbol":"TXO34000I6","category":"TXO","delivery_month":"202609","strike_price":34000.0,"option_right":"C"},{"action":"Buy","security_type":"OPT","exchange":"TAIFEX","code":"TXO34000U6","symbol":"TXO34000U6","category":"TXO","delivery_month":"202609","strike_price":34000.0,"option_right":"P"}]},"order":{"id":"a3512bd6","action":"Buy","price":1.0,"quantity":1,"seqno":"743597","ordno":"000000","order_type":"IOC","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"Auto"},"status":{"id":"a3512bd6","status":"Submitted","status_code":"0000","order_datetime":"2026-08-12T11:37:00+08:00","modified_price":1.0,"order_quantity":1,"deals":{}}}

```

## 刪單

`trade` 為要刪的單，可從[查詢狀態](#_5)取得。

cancel_comboorder

```
api.cancel_comboorder?

Signature:
    api.cancel_comboorder(
        combo_trade: sj.ComboTrade,
        timeout: Optional[int] = 30000,
        cb: Optional[Callable[[sj.ComboTrade], None]] = None,
    ) -> sj.ComboTrade

```

Parameters

```
combo_trade: 要刪的組合單（list_combotrades / update_combostatus 取得）
timeout:     逾時毫秒
cb:          選填，callback 函式，timeout=0 時使用

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
trade_id: 組合單編號（下單回應 status.id）

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
    "trade_id": "46989de8"
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
        timeout: Optional[int] = 30000,
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
    cb:      選填，callback 函式；timeout=0 時會收到更新後的 ComboTrade 清單

list_combotrades
    （無參數；回傳本地快取中已知的組合單）

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

IOC 未成交是正常結局

以 `IOC` 送出且未成交的組合單，最終狀態為 `status=Cancelled`、`status_code='0000'`、 `deal_quantity=0`、`cancel_quantity=1`、`deals={}`——代表委託被交易所接受、 因未成交而自動取消，不是錯誤。

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
                    security_type=<SecurityType.Future: 'FUT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXFH6',
                    symbol='TXFH6',
                    category='TXF',
                    delivery_month='202608'
                ),
                ComboBase(
                    action=<Action.Buy: 'Buy'>,
                    security_type=<SecurityType.Future: 'FUT'>,
                    exchange=<Exchange.TAIFEX: 'TAIFEX'>,
                    code='TXFI6',
                    symbol='TXFI6',
                    category='TXF',
                    delivery_month='202609'
                )
            ]
        ),
        order=Order(
            id='46989de8',
            action=<Action.Buy: 'Buy'>,
            price=50.0,
            quantity=1,
            seqno='743595',
            ordno='000000',
            order_type=<OrderType.ROD: 'ROD'>,
            price_type=<PriceType.LMT: 'LMT'>,
            account=FutureAccount(
                person_id='YOUR_PERSON_ID',
                broker_id='YOUR_BROKER_ID',
                account_id='YOUR_ACCOUNT_ID',
                signed=true,
                username=''
            ),
            octype=<FuturesOCType.Auto: 'Auto'>
        ),
        status=ComboStatus(
            id='46989de8',
            status=<OrderStatus.Submitted: 'Submitted'>,
            status_code='0000',
            order_datetime=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_time=datetime.datetime(2026, 8, 12, 11, 35, 0, tzinfo=datetime.timezone(datetime.timedelta(hours=8))),
            modified_price=50.0,
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
[{"contract":{"legs":[{"action":"Sell","security_type":"FUT","exchange":"TAIFEX","code":"TXFH6","symbol":"TXFH6","category":"TXF","delivery_month":"202608"},{"action":"Buy","security_type":"FUT","exchange":"TAIFEX","code":"TXFI6","symbol":"TXFI6","category":"TXF","delivery_month":"202609"}]},"order":{"id":"46989de8","action":"Buy","price":50.0,"quantity":1,"seqno":"743595","ordno":"000000","order_type":"ROD","price_type":"LMT","account":{"account_type":"F","person_id":"YOUR_PERSON_ID","broker_id":"YOUR_BROKER_ID","account_id":"YOUR_ACCOUNT_ID","signed":true,"username":""},"octype":"Auto"},"status":{"id":"46989de8","status":"Submitted","status_code":"0000","order_datetime":"2026-08-12T11:35:00+08:00","modified_price":50.0,"order_quantity":1,"deals":{}}}]

```
