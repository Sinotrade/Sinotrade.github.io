市場訊號是行情引擎即時掃描全市場行情後推送的訊號資料，個股一觸發指定條件（漲跌停、價格急變、爆量等）就主動推送事件，監測全市場行情，不需要再逐檔訂閱。透過 `subscribe_scanner()` 訂閱：以 `scanner` 參數指定掃描規則，並以 `region`、`security_type`、`exchange` 指定掃描的市場範圍。

Subscribe

```
>> api.subscribe_scanner?

Signature: api.subscribe_scanner(scanner, *, region, security_type, exchange)

```

Scanner Parameters:

```
scanner:       掃描規則物件（LimitScanner / PriceMoveScanner / VolumeScanner / StreamScanner）
region:        市場，目前僅支援 Region.TW
security_type: 商品類型，目前僅支援 SecurityType.Stock
exchange:      交易所 {Exchange.TSE, Exchange.OTC}

```

Subscribe

```
POST /api/v1/stream/subscribe/scanner
Content-Type: application/json

{
  "scanner":       {"kind": "preset_rule", "id": <string>} | <StreamScanner>,
  "region":        <Region>,
  "security_type": <SecurityType>,
  "exchange":      <Exchange>
}

```

取消訂閱使用相同的 body 呼叫 `POST /api/v1/stream/unsubscribe/scanner`。

Scanner Parameters:

```
scanner:       掃描規則。預設規則用 {"kind": "preset_rule", "id": "..."}（id 見各規則表）；
               狀態過濾直接給字串 {"simtrade", "suspend"}
region:        市場 {TW}
security_type: 商品類型 {STK}
exchange:      交易所 {TSE, OTC}

```

## 類型總覽

| Scanner | 說明 | 規則 | | --- | --- | --- | | `LimitScanner` | [漲跌停](#limitscanner) | `bid_near_limit_up` `bid_touch_limit_up` `limit_up_unlocked` `ask_near_limit_down` `ask_touch_limit_down` `limit_down_unlocked` | | `PriceMoveScanner` | [價格急變](#pricemovescanner) | `trade_surge` `trade_drop` `bid_surge` `ask_drop` | | `VolumeScanner` | [爆量](#volumescanner) | `burst` | | `StreamScanner` | [狀態過濾](#streamscanner) | `Simtrade` `Suspend` |

商品限制

- 目前支援台股（`Region.TW`）股票（`SecurityType.Stock`），交易所可選 `Exchange.TSE` 或 `Exchange.OTC`。
- `region`、`security_type`、`exchange` 為 keyword-only 必填參數。

## 漲跌停

監測個股逼近漲跌停的過程：從報價**接近**漲跌停價、**觸及**漲跌停價，到漲跌停**打開**，各階段都會推送訊號。

規則

```
# Python                                 HTTP (id)
LimitScanner.bid_near_limit_up()         bid_near_limit_up        買方報價接近漲停
LimitScanner.bid_touch_limit_up()        bid_touch_limit_up       買方報價觸及漲停
LimitScanner.limit_up_unlocked()         limit_up_unlocked        漲停打開
LimitScanner.ask_near_limit_down()       ask_near_limit_down      賣方報價接近跌停
LimitScanner.ask_touch_limit_down()      ask_touch_limit_down     賣方報價觸及跌停
LimitScanner.limit_down_unlocked()       limit_down_unlocked      跌停打開

```

In

```
api.subscribe_scanner(
    scanner=sj.LimitScanner.ask_near_limit_down(),
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# 取消訂閱
# api.unsubscribe_scanner(
#     scanner=sj.LimitScanner.ask_near_limit_down(),
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerSignalEvent(
    scanner=LimitScanner.ask_near_limit_down(),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '4977',
        'datetime': (2026, 7, 29, 10, 42, 36, 701220),
        'open': Decimal('123'),
        'close': Decimal('112.5'),
        'high': Decimal('125'),
        'low': Decimal('112'),
        ...
    },
    extra={
        'previous_best_price': Decimal('112.5'),
        'trigger_price': Decimal('112.5'),
        'limit_price': Decimal('112'),
    },
)

```

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": {"kind": "preset_rule", "id": "ask_near_limit_down"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# 開 SSE 收市場訊號（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/scanner

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": {"kind": "preset_rule", "id": "ask_near_limit_down"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanner": "ask_near_limit_down",
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "6672",
    "date": "2026-07-29",
    "time": "11:00:33.983434",
    "open": "204",
    "close": "180.5",
    "high": "204",
    "low": "180",
    ...
  },
  "extra": {
    "previous_best_price": "181",
    "trigger_price": "180.5",
    "limit_price": "180"
  }
}

```

### 屬性

LimitScannerExtra

```
previous_best_price (Optional[Decimal])  前一次最佳報價（首次觸發為 None）
trigger_price (Decimal)                  觸發訊號的最佳報價
limit_price (Decimal)                    漲跌停價

```

## 價格急變

個股價格在 1 秒內漲跌超過 1% 且變動達 3 個 tick 時推送訊號，同一檔觸發後冷卻 1 秒。

規則

```
# Python                                 HTTP (id)
PriceMoveScanner.trade_surge()           trade_price_surge        成交價急漲
PriceMoveScanner.trade_drop()            trade_price_drop         成交價急跌
PriceMoveScanner.bid_surge()             bid_price_surge          買方報價急漲
PriceMoveScanner.ask_drop()              ask_price_drop           賣方報價急跌

```

In

```
api.subscribe_scanner(
    scanner=sj.PriceMoveScanner.trade_drop(),
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# 取消訂閱
# api.unsubscribe_scanner(
#     scanner=sj.PriceMoveScanner.trade_drop(),
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerSignalEvent(
    scanner=PriceMoveScanner.trade_price_drop(),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '4956',
        'datetime': (2026, 7, 29, 10, 38, 54, 975780),
        'open': Decimal('26.8'),
        'close': Decimal('24.6'),
        'high': Decimal('27.2'),
        'low': Decimal('24.6'),
        ...
    },
    extra={
        'reference_time': '10:38:54.975780',
        'reference_price': Decimal('24.85'),
        'change_price': Decimal('-0.25'),
        'change_percent': Decimal('-1.006'),
        'tick_change': 5,
        'elapsed_ms': 0,
    },
)

```

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": {"kind": "preset_rule", "id": "trade_price_drop"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# 開 SSE 收市場訊號（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/scanner

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": {"kind": "preset_rule", "id": "trade_price_drop"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanner": "trade_price_drop",
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "8045",
    "date": "2026-07-29",
    "time": "10:58:56.269181",
    "open": "55.8",
    "close": "50.6",
    "high": "56.2",
    "low": "50.6",
    ...
  },
  "extra": {
    "reference_time": "10:58:56.269181",
    "reference_price": "51.2",
    "change_price": "-0.6",
    "change_percent": "-1.1719",
    "tick_change": 6,
    "elapsed_ms": 0
  }
}

```

### 屬性

PriceMoveExtra

```
reference_time (str)                     比較基準時間
reference_price (Decimal)                比較基準價格
change_price (Decimal)                   期間價格變動
change_percent (Decimal)                 期間漲跌幅 (%)
tick_change (int)                        期間 tick 變動數
elapsed_ms (int)                         距基準時間經過毫秒數

```

## 爆量

個股出現單筆成交金額超過當日門檻的成交時推送訊號，同一檔觸發後冷卻 5 秒。門檻由伺服器每日依前一交易日的成交金額分布重新計算，每筆事件會在 `threshold` 欄位帶出當日門檻。

規則

```
# Python                                 HTTP (id)
VolumeScanner.burst()                    volume_burst             爆量

```

In

```
api.subscribe_scanner(
    scanner=sj.VolumeScanner.burst(),
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# 取消訂閱
# api.unsubscribe_scanner(
#     scanner=sj.VolumeScanner.burst(),
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerSignalEvent(
    scanner=VolumeScanner.volume_burst(),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '2454',
        'datetime': (2026, 7, 29, 10, 39, 22, 260204),
        'open': Decimal('3315'),
        'close': Decimal('3050'),
        'high': Decimal('3335'),
        'low': Decimal('3035'),
        ...
    },
    extra={
        'amount': 27450000,
        'volume': 9,
        'price': Decimal('3050'),
        'threshold': 25000000,
    },
)

```

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": {"kind": "preset_rule", "id": "volume_burst"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# 開 SSE 收市場訊號（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/scanner

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": {"kind": "preset_rule", "id": "volume_burst"}, "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanner": "volume_burst",
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "6669",
    "date": "2026-07-29",
    "time": "10:57:35.360442",
    "open": "5430",
    "close": "5100",
    "high": "5475",
    "low": "5095",
    ...
  },
  "extra": {
    "amount": 25500000,
    "volume": 5,
    "price": "5100",
    "threshold": 25000000
  }
}

```

### 屬性

VolumeBurstExtra

```
amount (int)                             單筆成交金額 (TWD)
volume (int)                             單筆成交量 (張)
price (Decimal)                          成交價
threshold (int)                          當日門檻 (TWD)

```

## 狀態過濾

訂閱後推送符合特定狀態的個股報價：`Simtrade` 為試撮行情、`Suspend` 為暫停交易。試撮不限開收盤時段，盤中進入分盤集合競價的個股（處置股、觸發瞬間價格穩定措施）也會推送。

規則

```
# Python                                 HTTP (scanner)
StreamScanner.Simtrade                   simtrade                 試撮行情
StreamScanner.Suspend                    suspend                  暫停交易

```

In

```
api.subscribe_scanner(
    scanner=sj.StreamScanner.Simtrade,
    region=sj.Region.TW,
    security_type=sj.SecurityType.Stock,
    exchange=sj.Exchange.TSE,
)

# 取消訂閱
# api.unsubscribe_scanner(
#     scanner=sj.StreamScanner.Simtrade,
#     region=sj.Region.TW,
#     security_type=sj.SecurityType.Stock,
#     exchange=sj.Exchange.TSE,
# )

```

Out

```
ScannerQuoteEvent(
    scanners=(<StreamScanner.simtrade: 'simtrade'>,),
    region=<Region.TW: 'TW'>,
    security_type=<SecurityType.Stock: 'STK'>,
    exchange=<Exchange.TSE: 'TSE'>,
    quote={
        'code': '3090',
        'datetime': (2026, 7, 29, 10, 43, 21, 25653),
        'open': Decimal('138'),
        'close': Decimal('126.5'),
        'high': Decimal('138'),
        'low': Decimal('126.5'),
        'simtrade': True,
        ...
    },
)

```

In

```
# 訂閱
curl -X POST http://localhost:8080/api/v1/stream/subscribe/scanner \
  -H 'Content-Type: application/json' \
  -d '{"scanner": "simtrade", "region": "TW", "security_type": "STK", "exchange": "TSE"}'

# 開 SSE 收市場訊號（Ctrl+C 結束）
curl -N http://localhost:8080/api/v1/stream/data/scanner

# 取消訂閱
# curl -X POST http://localhost:8080/api/v1/stream/unsubscribe/scanner \
#   -H 'Content-Type: application/json' \
#   -d '{"scanner": "simtrade", "region": "TW", "security_type": "STK", "exchange": "TSE"}'

```

Out

```
event:scanner
data:{
  "scanners": ["simtrade"],
  "region": "TW",
  "security_type": "STK",
  "exchange": "TSE",
  "quote": {
    "code": "2492",
    "date": "2026-07-29",
    "time": "11:02:09.266137",
    "open": "234.5",
    "close": "220.5",
    "high": "234.5",
    "low": "220.5",
    "simtrade": true,
    ...
  }
}

```

### 屬性

ScannerQuoteEvent

```
scanners (Tuple[StreamScanner, ...])     符合的串流過濾（可能同時符合多個）
region (Region)                          市場
security_type (SecurityType)             商品類型
exchange (Exchange)                      交易所
quote (QuoteSTKv1Core)                   個股報價

```

- `quote` 欄位內容與[證券即時行情](../stocks/)的 Quote 相同。

## Callback（僅 Python）

所有市場訊號共用同一個 callback。未設定時，事件以預設格式直接印出；設定後改由 callback 處理。依訂閱類型不同，callback 會收到不同的事件型別：規則類訂閱（漲跌停、價格急變、爆量）推送 `ScannerSignalEvent`，狀態過濾推送 `ScannerQuoteEvent`；斷線重連時會收到 `ScannerGapEvent`，告知漏收的事件數量。請避免在函式內進行運算。

decorator 方式

```
from shioaji import (
    ScannerSignalEvent, ScannerQuoteEvent, ScannerGapEvent,
    LimitScanner, PriceMoveScanner, VolumeScanner,
)

@api.on_scanner()
def scanner_callback(event):
    if isinstance(event, ScannerSignalEvent):
        if isinstance(event.scanner, LimitScanner):
            print("漲跌停:", event.quote.code, event.extra)
        elif isinstance(event.scanner, PriceMoveScanner):
            print("價格急變:", event.quote.code, event.extra)
        elif isinstance(event.scanner, VolumeScanner):
            print("爆量:", event.quote.code, event.extra)
    elif isinstance(event, ScannerQuoteEvent):
        print("狀態過濾:", event.scanners, event.quote.code)
    elif isinstance(event, ScannerGapEvent):
        print(f"dropped_count={event.dropped_count}")

```

傳統方式

```
from shioaji import (
    ScannerSignalEvent, ScannerQuoteEvent, ScannerGapEvent,
    LimitScanner, PriceMoveScanner, VolumeScanner,
)

def scanner_callback(event):
    if isinstance(event, ScannerSignalEvent):
        if isinstance(event.scanner, LimitScanner):
            print("漲跌停:", event.quote.code, event.extra)
        elif isinstance(event.scanner, PriceMoveScanner):
            print("價格急變:", event.quote.code, event.extra)
        elif isinstance(event.scanner, VolumeScanner):
            print("爆量:", event.quote.code, event.extra)
    elif isinstance(event, ScannerQuoteEvent):
        print("狀態過濾:", event.scanners, event.quote.code)
    elif isinstance(event, ScannerGapEvent):
        print(f"dropped_count={event.dropped_count}")

api.set_on_scanner_callback(scanner_callback)

```

比對單一規則

要精準到特定規則時，可直接以相等判斷，例如 `event.scanner == LimitScanner.ask_near_limit_down()`。
