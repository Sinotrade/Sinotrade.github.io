組合商品在期交所是獨立商品，有**自己的委託簿與報價**，與兩支商品各自的行情分開；價差是交易所實際撮合的結果，不是把兩支商品的價格相減。要取得組合的即時行情，必須直接訂閱組合商品本身。

閱讀組合報價時有兩件事與一般商品不同：

- 報價中的價格是整個組合的**淨價**：跨月價差為「遠月 − 近月」，**可能為負值**。
- 報價中的 `bid`／`ask` 是**對整個組合**的掛買與掛賣，一次訂閱即包含雙邊。

僅期貨組合有報價

選擇權組合僅能以 `IOC`／`FOK` 送單、不會留存於委託簿，因此**沒有組合報價**； 需要參考價格時，請訂閱個別商品並依淨價定義自行估算（見[組合單](../../../order/Combo/)）。

訂閱前請先以 `api.contracts.combo()` 建立組合合約（不可使用 `TXFR1`／`R2` 連續月合約），建法詳見[商品合約](../../../contract/#combo)。

## 訂閱

Subscribe

```
>> api.subscribe?

Signature:
    api.subscribe(
        contract: shioaji.Contract,
        quote_type: shioaji.QuoteType = <QuoteType.Tick: 'tick'>,
        intraday_odd: bool = False,
    )

```

Quote Parameters:

```
contract:     組合合約（api.contracts.combo() / combo_futures() 建立）
quote_type:   訂閱類型 {'tick', 'bid_ask'}
intraday_odd: 組合商品不支援，固定為 False

```

回報對照

回報中的 `code`（例 `'TXFH6/I6'`）即為 `combo_contract.code`。訂閱多個組合時， 可先建立對照表，於 callback 中以 `code` 對回合約：

```
combo_by_code = {c.code: c for c in api.contracts.combo_futures(root="TXF")}

```

Subscribe

```
shioaji data stream --code <CODE> --combo-with <CODE> [OPTIONS]

```

Quote Parameters:

```
--code:          組合第一支商品的代碼（近月，例 TXFH6）
--combo-with:    組合第二支商品的代碼（遠月，例 TXFI6）
--security-type: 商品類型，組合填 FUT
--quote-type:    訂閱類型 {tick, bid_ask}，預設 tick

```

組合訂閱的 body 以 `contract.legs` 帶入兩支商品（與一般商品的平面格式不同）；商品不可帶 `action`、不可使用 `TXFR1`／`R2` 連續月合約。

Subscribe

```
POST /api/v1/stream/subscribe
Content-Type: application/json

{
  "contract": {
    "legs": [
      {
        "security_type": <SecurityType>,
        "exchange": <Exchange>,
        "code": <string>
      }
    ],
    "combo_type": <ComboType, optional>
  },
  "quote_type": <QuoteType>
}

```

Quote Parameters:

```
contract.legs[].security_type: 商品類型 {FUT}
contract.legs[].exchange:      交易所 {TAIFEX}
contract.legs[].code:          商品代碼；不可帶 action，帶了會回 400
contract.combo_type:           選填，組合類型；省略時自動推導
quote_type:                    訂閱類型 {Tick, BidAsk}

```

## Tick

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

api.subscribe(combo_contract, quote_type=sj.QuoteType.Tick)

# 取消訂閱
# api.unsubscribe(combo_contract, quote_type=sj.QuoteType.Tick)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/FOP/*/TFE/TXFH6/I6 | Event: Subscribe or Unsubscribe ok

TickFOPv1(
    code='TXFH6/I6',
    date=2026-08-12,
    time=15:56:09,
    close=172,
    volume=1,
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback) 章節自訂 callback 函式。

組合需有實際成交才會產生 tick，流量遠低於單式商品；驗證訂閱是否生效請以 `BidAsk` 為準。

In

```
shioaji data stream --code TXFH6 --combo-with TXFI6 --security-type FUT --quote-type tick
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to TXFH6 tick (Ctrl+C to stop)
{"code":"TXFH6/I6","date":"2026-08-12","time":"16:01:06.089000","open":"153","underlying_price":"45518.07","bid_side_total_vol":27,"ask_side_total_vol":3,"avg_price":"162.533333","close":"169","high":"174","low":"153","amount":"169","total_amount":"4876","volume":1,"total_volume":30,"tick_type":2,"chg_type":1,"price_chg":"0","pct_chg":"0","simtrade":false}

```

In

```
# Step 1: 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {
      "legs": [
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
      ]
    },
    "quote_type": "Tick"
  }'

# Step 2: 開啟 SSE 串流接收報價（Ctrl+C 停止）
curl -N http://localhost:8080/api/v1/stream/data/tick_fop

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "contract": {
#       "legs": [
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
#       ]
#     },
#     "quote_type": "Tick"
#   }'

```

Out (Step 1: 訂閱回應)

```
{"success":true,"message":"Subscription successful","subscription":{"contract":{"legs":[{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFH6","target_code":null},{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFI6","target_code":null}],"combo_type":null},"quote_type":"Tick","intraday_odd":false}}

```

Out (Step 2: SSE tick)

```
event:tick_fop
data:{"code":"TXFH6/I6","date":"2026-08-12","time":"16:01:06.089000","open":"153","underlying_price":"45518.07","bid_side_total_vol":27,"ask_side_total_vol":3,"avg_price":"162.533333","close":"169","high":"174","low":"153","amount":"169","total_amount":"4876","volume":1,"total_volume":30,"tick_type":2,"chg_type":1,"price_chg":"0","pct_chg":"0","simtrade":false}

```

### 屬性

回報型別與期貨／選擇權相同（`TickFOPv1`），價格類欄位皆為組合淨價：

Tick

```
code (str)                               組合代碼（例 TXFH6/I6）
exchange (Exchange)                      交易所
date (tuple)                             日期
time (tuple)                             成交時間
datetime (tuple)                         日期與時間
open (Decimal)                           開盤價
underlying_price (Decimal)               標的指數現價
avg_price (Decimal)                      均價
close (Decimal)                          成交價
high (Decimal)                           最高價（自開盤）
low (Decimal)                            最低價（自開盤）
amount (Decimal)                         單筆成交額 (NTD)
total_amount (Decimal)                   總成交額 (NTD)
volume (int)                             單筆成交量 (lot)
total_volume (int)                       總成交量 (lot)
tick_type (int)                          內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
chg_type (int)                           漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
price_chg (Decimal)                      漲跌
pct_chg (Decimal)                        漲跌幅 (%)
bid_side_total_vol (int)                 買盤成交總量 (lot)
ask_side_total_vol (int)                 賣盤成交總量 (lot)
simtrade (bool)                          試撮

```

## BidAsk

In

```
near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])

api.subscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

# 取消訂閱
# api.unsubscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/FOP/*/TFE/TXFH6/I6 | Event: Subscribe or Unsubscribe ok

BidAskFOPv1(
    code='TXFH6/I6',
    date=2026-08-12,
    time=15:54:41,
    bid_price=[169, 168, 167, 166, 165],
    ask_price=[175, 176, 177, 178, 179],
    bid_volume=[4, 3, 2, 12, 16],
    ask_volume=[8, 1, 3, 3, 3],
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback) 章節自訂 callback 函式。

In

```
shioaji data stream --code TXFH6 --combo-with TXFI6 --security-type FUT --quote-type bid_ask
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to TXFH6 bid_ask (Ctrl+C to stop)
{"code":"TXFH6/I6","date":"2026-08-12","time":"15:59:43.034000","bid_total_vol":30,"ask_total_vol":50,"bid_price":["169","168","167","166","165"],"bid_volume":[5,3,7,12,3],"diff_bid_vol":[0,0,0,0,-13],"ask_price":["173","174","175","176","177"],"ask_volume":[5,11,12,10,12],"diff_ask_vol":[0,0,0,0,0],"first_derived_bid_price":"0","first_derived_ask_price":"0","first_derived_bid_vol":0,"first_derived_ask_vol":0,"underlying_price":"45518.07","simtrade":false}

```

In

```
# Step 1: 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "contract": {
      "legs": [
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
        {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
      ]
    },
    "quote_type": "BidAsk"
  }'

# Step 2: 開啟 SSE 串流接收報價（Ctrl+C 停止）
curl -N http://localhost:8080/api/v1/stream/data/bidask_fop

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "contract": {
#       "legs": [
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFH6"},
#         {"security_type": "FUT", "exchange": "TAIFEX", "code": "TXFI6"}
#       ]
#     },
#     "quote_type": "BidAsk"
#   }'

```

Out (Step 1: 訂閱回應)

```
{"success":true,"message":"Subscription successful","subscription":{"contract":{"legs":[{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFH6","target_code":null},{"security_type":"FUT","region":"TW","exchange":"TAIFEX","code":"TXFI6","target_code":null}],"combo_type":null},"quote_type":"BidAsk","intraday_odd":false}}

```

Out (Step 2: SSE 報價)

```
event:bidask_fop
data:{"code":"TXFH6/I6","date":"2026-08-12","time":"16:02:27.159000","bid_total_vol":26,"ask_total_vol":51,"bid_price":["169","168","167","166","165"],"bid_volume":[1,3,7,12,3],"diff_bid_vol":[0,0,0,0,0],"ask_price":["174","175","176","177","178"],"ask_volume":[7,14,11,11,8],"diff_ask_vol":[0,0,0,0,0],"first_derived_bid_price":"0","first_derived_ask_price":"0","first_derived_bid_vol":0,"first_derived_ask_vol":0,"underlying_price":"45518.07","simtrade":false}

```

### 屬性

回報型別與期貨／選擇權相同（`BidAskFOPv1`），價格類欄位皆為組合淨價：

BidAsk

```
code (str)                               組合代碼（例 TXFH6/I6）
exchange (Exchange)                      交易所
date (tuple)                             日期
time (tuple)                             時間
datetime (tuple)                         日期與時間
bid_total_vol (int)                      委買量總計 (lot)
ask_total_vol (int)                      委賣量總計 (lot)
bid_price (list[Decimal])                五檔委買價
bid_volume (list[int])                   五檔委買量 (lot)
diff_bid_vol (list[int])                 五檔委買價增減量 (lot)
ask_price (list[Decimal])                五檔委賣價
ask_volume (list[int])                   五檔委賣量 (lot)
diff_ask_vol (list[int])                 五檔委賣價增減量 (lot)
first_derived_bid_price (Decimal)        衍生一檔委買價
first_derived_ask_price (Decimal)        衍生一檔委賣價
first_derived_bid_vol (int)              衍生一檔委買量 (lot)
first_derived_ask_vol (int)              衍生一檔委賣量 (lot)
underlying_price (Decimal)               標的指數現價
simtrade (bool)                          試撮

```

## Callback（僅 Python）

預設狀況下我們將即時行情使用 `print` 的方式呈現，僅顯示部分摘要欄位。可根據個人需求修改 callback 函式以取得完整欄位內容，並串接其他應用。請避免在函式內進行運算。組合報價與期貨／選擇權共用同一組 FOP callback，回報中的 `code` 即為 `combo_contract.code`。

### Tick

decorator 方式

```
from shioaji import TickFOPv1, Exchange

@api.on_tick_fop_v1()
def quote_callback(exchange: Exchange, tick: TickFOPv1):
    print(f"exchange={exchange}")
    print(f"code={tick.code}")
    print(f"date={tick.date}")
    print(f"time={tick.time}")
    print(f"datetime={tick.datetime}")
    print(f"open={tick.open}")
    print(f"underlying_price={tick.underlying_price}")
    print(f"bid_side_total_vol={tick.bid_side_total_vol}")
    print(f"ask_side_total_vol={tick.ask_side_total_vol}")
    print(f"avg_price={tick.avg_price}")
    print(f"close={tick.close}")
    print(f"high={tick.high}")
    print(f"low={tick.low}")
    print(f"amount={tick.amount}")
    print(f"total_amount={tick.total_amount}")
    print(f"volume={tick.volume}")
    print(f"total_volume={tick.total_volume}")
    print(f"tick_type={tick.tick_type}")
    print(f"chg_type={tick.chg_type}")
    print(f"price_chg={tick.price_chg}")
    print(f"pct_chg={tick.pct_chg}")
    print(f"simtrade={tick.simtrade}")

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.Tick)

```

傳統方式

```
from shioaji import TickFOPv1, Exchange

def quote_callback(exchange: Exchange, tick: TickFOPv1):
    print(f"{exchange} {tick}")

api.set_on_tick_fop_v1_callback(quote_callback)

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.Tick)

```

### BidAsk

decorator 方式

```
from shioaji import BidAskFOPv1, Exchange

@api.on_bidask_fop_v1()
def quote_callback(exchange: Exchange, bidask: BidAskFOPv1):
    print(f"exchange={exchange}")
    print(f"code={bidask.code}")
    print(f"date={bidask.date}")
    print(f"time={bidask.time}")
    print(f"datetime={bidask.datetime}")
    print(f"bid_total_vol={bidask.bid_total_vol}")
    print(f"ask_total_vol={bidask.ask_total_vol}")
    print(f"bid_price={bidask.bid_price}")
    print(f"bid_volume={bidask.bid_volume}")
    print(f"diff_bid_vol={bidask.diff_bid_vol}")
    print(f"ask_price={bidask.ask_price}")
    print(f"ask_volume={bidask.ask_volume}")
    print(f"diff_ask_vol={bidask.diff_ask_vol}")
    print(f"first_derived_bid_price={bidask.first_derived_bid_price}")
    print(f"first_derived_ask_price={bidask.first_derived_ask_price}")
    print(f"first_derived_bid_vol={bidask.first_derived_bid_vol}")
    print(f"first_derived_ask_vol={bidask.first_derived_ask_vol}")
    print(f"underlying_price={bidask.underlying_price}")
    print(f"simtrade={bidask.simtrade}")

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

```

傳統方式

```
from shioaji import BidAskFOPv1, Exchange

def quote_callback(exchange: Exchange, bidask: BidAskFOPv1):
    print(f"{exchange} {bidask}")

api.set_on_bidask_fop_v1_callback(quote_callback)

near = api.contracts.get("TXFH6")
far = api.contracts.get("TXFI6")
combo_contract = api.contracts.combo(legs=[near, far])
api.subscribe(combo_contract, quote_type=sj.QuoteType.BidAsk)

```
