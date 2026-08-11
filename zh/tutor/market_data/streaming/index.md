指數即時行情是交易所即時轉送的市場資料，僅在開盤時段才會推送。利用訂閱[商品合約](../../contract/)的方式即可開始接收即時行情。

提醒

即時行情訂閱不會佔用流量。

指數只有一種行情

指數僅提供指數報價（Quote）一種行情，沒有逐筆（Tick）與五檔（BidAsk）。訂閱時 `quote_type` 固定為 `Quote`。

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
contract:     要訂閱的指數商品合約（由 api.contracts.get 取得）
quote_type:   指數僅支援 Quote，省略即可
intraday_odd: 指數不支援，固定為 False

```

Subscribe

```
$ shioaji data stream --help

Stream real-time market data (SSE, Ctrl+C to stop)

Usage: shioaji data stream [OPTIONS] --code <CODE>

Options:
      --code <CODE>                   Security code (e.g. 2330, TXFR1)
      --quote-type <QUOTE_TYPE>       Quote type: tick, bid_ask, quote [default: tick]
      --security-type <SECURITY_TYPE> Security type: STK, FUT, OPT, IND [default: STK]
      --intraday-odd                  Include intraday odd lot trades

```

Quote Parameters:

```
--code:          要訂閱的指數代碼（例如 IX0001）
--quote-type:    指數必須帶 quote（預設 tick 會被拒絕）
--security-type: 商品類型，指數填 IND
--intraday-odd:  指數不支援

```

Subscribe

```
POST /api/v1/stream/subscribe
Content-Type: application/json

{
  "security_type": <SecurityType>,
  "exchange":      <Exchange>,
  "code":          <string>,
  "quote_type":    <QuoteType>
}

```

Quote Parameters:

```
security_type: 商品類型 {IND}
exchange:      交易所 {TSE, OTC}
code:          指數代碼（例如 IX0001）
quote_type:    指數僅支援 Quote

```

## Quote

In

```
contract = api.contracts.get("IX0001")
api.subscribe(contract, quote_type=sj.QuoteType.Quote)

# 取消訂閱
# api.unsubscribe(contract, quote_type=sj.QuoteType.Quote)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/IND/*/TSE/IX0001 | Event: Subscribe or Unsubscribe ok

QuoteIdxV1(
    code='IX0001',
    date=2026-07-16,
    time=11:52:45,
    close=45625.32,
    high=45713.2,
    low=44970.64,
)

```

顯示完整欄位

預設不會展示所有欄位，僅顯示摘要。如需取得完整內容，請參考下方 [Callback](#callback) 章節自訂 callback 函式。

In

```
shioaji data stream --code IX0001 --security-type IND --quote-type quote
# 按 Ctrl+C 即可停止訂閱，CLI 會自動取消

```

Out

```
Subscribed to IX0001 quote (Ctrl+C to stop)
{
  "exchange": "TSE",
  "code": "IX0001",
  "Date": "2026-07-16",
  "Time": "11:52:15",
  "Reference": "45631.59",
  "Open": "45511.98",
  "High": "45713.2",
  "Low": "44970.64",
  "Close": "45622.63",
  "AmountSum": "618160656740",
  "Amount": "91988580",
  "Volume": 1129,
  "VolSum": 7424400,
  "Count": 2115431,
  "CountSum": 2115431,
  "PrevDate": "2026-07-15",
  "PrevAmountSum": "984081222880",
  "NoTrade": 7,
  "RaiseStop": 16,
  "Raise": 454,
  "Flat": 107,
  "Fall": 523,
  "FallStop": 0,
  "FundAmount": "40717826190",
  "FundVolume": 1732436,
  "FundCount": 345835,
  "StockAmount": "572675483130",
  "StockVolume": 3659291,
  "StockCount": 1691180,
  "BullAmount": "2326921150",
  "BullVolume": 1905951,
  "BullCount": 68360,
  "BearAmount": "77652940",
  "BearVolume": 107649,
  "BearCount": 4298,
  "TIBAmount": "2180957550",
  "TIBVolume": 2673,
  "TIBCount": 2052,
  "FixedAmount": "0",
  "FixedVolume": 0,
  "FixedCount": 0,
  "EstimateAmountSum": "857722570750"
}

```

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe \
  -H 'Content-Type: application/json' \
  -d '{
    "security_type": "IND",
    "exchange": "TSE",
    "code": "IX0001",
    "quote_type": "Quote"
  }'

# 開 SSE 收指數行情（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/quote_idx

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe \
#   -H 'Content-Type: application/json' \
#   -d '{
#     "security_type": "IND",
#     "exchange": "TSE",
#     "code": "IX0001",
#     "quote_type": "Quote"
#   }'

```

Out

```
event:quote_idx
data:{
  "exchange": "TSE",
  "code": "IX0001",
  "Date": "2026-07-16",
  "Time": "11:52:45",
  "Reference": "45631.59",
  "Open": "45511.98",
  "High": "45713.2",
  "Low": "44970.64",
  "Close": "45625.32",
  "AmountSum": "618594787860",
  "Amount": "95080930",
  "Volume": 918,
  "VolSum": 7430030,
  "Count": 2117449,
  "CountSum": 2117449,
  "PrevDate": "2026-07-15",
  "PrevAmountSum": "984081222880",
  "NoTrade": 7,
  "RaiseStop": 16,
  "Raise": 453,
  "Flat": 111,
  "Fall": 520,
  "FallStop": 0,
  "FundAmount": "40749825690",
  "FundVolume": 1733956,
  "FundCount": 346107,
  "StockAmount": "573076651430",
  "StockVolume": 3662426,
  "StockCount": 1692858,
  "BullAmount": "2327811230",
  "BullVolume": 1906903,
  "BullCount": 68423,
  "BearAmount": "77668600",
  "BearVolume": 107670,
  "BearCount": 4301,
  "TIBAmount": "2180957550",
  "TIBVolume": 2673,
  "TIBCount": 2052,
  "FixedAmount": "0",
  "FixedVolume": 0,
  "FixedCount": 0,
  "EstimateAmountSum": "857373233347"
}

```

### 屬性

QuoteIdxV1

```
code (str)                               指數代碼
exchange (Exchange)                      交易所
date (date)                              日期
time (time)                              時間
datetime (datetime)                      日期與時間
reference (Decimal)                      昨收
open (Decimal)                           今開
high (Decimal)                           今高
low (Decimal)                            今低
close (Decimal)                          最新指數
amount_sum (Decimal)                     累計成交金額 (NTD)
amount (Decimal)                         成交金額 (NTD)
volume (int)                             成交股數 (張)
vol_sum (int)                            累計成交股數 (張)
count (int)                              累計成交筆數
count_sum (int)                          累計成交筆數
prev_date (date)                         前一個交易日
prev_amount_sum (Decimal)                前交易日總額 (NTD)
no_trade (int)                           未成交（商品數）
limit_up_count (int)                     漲停（商品數）
raise_count (int)                        漲（商品數）
flat_count (int)                         平（商品數）
fall_count (int)                         跌（商品數）
limit_down_count (int)                   跌停（商品數）
fund_amount (Decimal)                    基金成交總額 (NTD)｜僅大盤
fund_volume (int)                        基金成交總張數｜僅大盤
fund_count (int)                         基金成交總筆數｜僅大盤
stock_amount (Decimal)                   股票成交總額 (NTD)｜僅大盤
stock_volume (int)                       股票成交總張數｜僅大盤
stock_count (int)                        股票成交總筆數｜僅大盤
bull_amount (Decimal)                    認購權證成交總額 (NTD)｜僅大盤
bull_volume (int)                        認購權證成交總張數｜僅大盤
bull_count (int)                         認購權證成交總筆數｜僅大盤
bear_amount (Decimal)                    認售權證成交總額 (NTD)｜僅大盤
bear_volume (int)                        認售權證成交總張數｜僅大盤
bear_count (int)                         認售權證成交總筆數｜僅大盤
tib_amount (Decimal)                     創新板成交總額 (NTD)｜僅大盤
tib_volume (int)                         創新板成交總張數｜僅大盤
tib_count (int)                          創新板成交總筆數｜僅大盤
fixed_amount (Decimal)                   盤後定價成交總額 (NTD)｜僅大盤
fixed_volume (int)                       盤後定價成交總張數｜僅大盤
fixed_count (int)                        盤後定價成交筆數｜僅大盤
estimate_amount_sum (Decimal)            預估收盤總額 (NTD)｜僅大盤

```

- 標記「僅大盤」的欄位僅發行量加權股價指數等大盤指數才有；一般指數（如 `EMP88`）僅有前段標準欄位，其餘為 `None`。

## Callback（僅 Python）

預設狀況下我們將即時行情使用 `print` 的方式呈現，僅顯示部分摘要欄位。可根據個人需求修改 callback 函式以取得完整欄位內容，並串接其他應用（行情管理、觸價單等）。請避免在函式內進行運算。

### Quote

decorator 方式

```
from shioaji import QuoteIdxV1

@api.on_quote_idx_v1()
def quote_callback(quote: QuoteIdxV1):
    print(f"code={quote.code}")
    print(f"exchange={quote.exchange}")
    print(f"date={quote.date}")
    print(f"time={quote.time}")
    print(f"datetime={quote.datetime}")
    print(f"reference={quote.reference}")
    print(f"open={quote.open}")
    print(f"high={quote.high}")
    print(f"low={quote.low}")
    print(f"close={quote.close}")
    print(f"amount_sum={quote.amount_sum}")
    print(f"volume={quote.volume}")
    print(f"vol_sum={quote.vol_sum}")

contract = api.contracts.get("IX0001")
api.subscribe(contract, quote_type=sj.QuoteType.Quote)

```

傳統方式

```
from shioaji import QuoteIdxV1

def quote_callback(quote: QuoteIdxV1):
    print(quote)

api.set_on_quote_idx_v1_callback(quote_callback)

contract = api.contracts.get("IX0001")
api.subscribe(contract, quote_type=sj.QuoteType.Quote)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/IND/*/TSE/IX0001 | Event: Subscribe or Unsubscribe ok
code=IX0001
exchange=Exchange.TSE
date=2026-07-16
time=11:52:45
datetime=2026-07-16 11:52:45
reference=45631.59
open=45511.98
high=45713.2
low=44970.64
close=45625.32
amount_sum=618594787860
volume=918
vol_sum=7430030

```
