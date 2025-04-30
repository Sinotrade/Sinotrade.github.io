利用訂閱[商品檔](../../../contract/)的方式去取得即時行情。

Subscribe

```
>> api.quote.subscribe?

Signature:
    api.quote.subscribe(
        contract:shioaji.contracts.Contract,
        quote_type:shioaji.constant.QuoteType=<QuoteType.Tick: 'tick'>,
        intraday_odd:bool=False,
        version: shioaji.constant.QuoteVersion=<QuoteVersion.v0: 'v0'>,
    )

```

Quote Parameters:

```
quote_type: 訂閱類型 {'tick', 'bidask'}
intraday_odd: 盤中零股 {True, False}
version: 行情版本 {'v1', 'v0'}

```

## Tick

### 整股

In

```
api.quote.subscribe(
    api.Contracts.Stocks["2330"], 
    quote_type = sj.constant.QuoteType.Tick,
    version = sj.constant.QuoteVersion.v1
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/STK/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

Exchange.TSE 
Tick(
    code = '2330', 
    datetime = datetime.datetime(2021, 7, 2, 13, 16, 35, 92970), 
    open = Decimal('590'), 
    avg_price = Decimal('589.05'), 
    close = Decimal('590'), 
    high = Decimal('593'), 
    low = Decimal('587'), 
    amount = Decimal('590000'), 
    total_amount = Decimal('8540101000'), 
    volume = 1, 
    total_volume = 14498, 
    tick_type = 1, 
    chg_type = 4, 
    price_chg = Decimal('-3'), 
    pct_chg = Decimal('-0.505902'), 
    bid_side_total_vol= 6638, 
    ask_side_total_vol = 7860, 
    bid_side_total_cnt = 2694, 
    ask_side_total_cnt = 2705, 
    closing_oddlot_shares = 0, 
    fixed_trade_vol = 0, 
    suspend = 0, 
    simtrade = 0, 
    intraday_odd = 0
)

```

```
Response Code: 200 | Event Code: 16 | Info: MKT/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

MKT/idcdmzpcr01/TSE/2330 
{
    'AmountSum': [1688787000.0], 
    'Close': [593.0], 
    'Date': '2021/07/01', 
    'TickType': [2], 
    'Time': '09:10:20.628620', 
    'VolSum': [2837], 
    'Volume': [1]
}

```

### 盤中零股

In

```
api.quote.subscribe(
    api.Contracts.Stocks["2330"], 
    quote_type = sj.constant.QuoteType.Tick,
    version = sj.constant.QuoteVersion.v1,
    intraday_odd = True
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/ODD/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

Exchange.TSE 
Tick(
    code = '2330', 
    datetime = datetime.datetime(2021, 7, 2, 13, 16, 55, 544646), 
    open = Decimal('591'), 
    avg_price = Decimal('590.24415'), 
    close = Decimal('590'), 
    high = Decimal('591'), 
    low = Decimal('589'), 
    amount = Decimal('276120'), 
    total_amount = Decimal('204995925'), 
    volume = 468, 
    total_volume = 347307, 
    tick_type = 1, 
    chg_type = 4, 
    price_chg = Decimal('-3'), 
    pct_chg = Decimal('-0.505902'), 
    bid_side_total_vol= 68209, 
    ask_side_total_vol = 279566, 
    bid_side_total_cnt = 28, 
    ask_side_total_cnt = 56, 
    closing_oddlot_shares = 0, 
    fixed_trade_vol = 0, 
    suspend = 0, 
    simtrade = 1, 
    intraday_odd = 1
)

```

```
Response Code: 200 | Event Code: 16 | Info: TIC/v2/*/TSE/2330/ODDLOT | Event: Subscribe or Unsubscribe ok

TIC/v2/replay/TSE/2330/ODDLOT 
{
    'Date': '2021/07/01', 
    'Time': '09:23:36.880878', 
    'Close': '593', 
    'TickType': 1, 
    'Shares': 1860, 
    'SharesSum': 33152, 
    'Simtrade': 1
}

```

### 屬性

Tick

```
code (str): 商品代碼
datetime (datetime): 時間
open (decimal): 開盤價
avg_price (decimal): 均價
close (decimal): 成交價
high (decimal): 最高價(自開盤)
low (decimal): 最低價(自開盤)
amount (decimal): 成交額 (NTD)
total_amount (decimal): 總成交額 (NTD)
volume (int): 成交量 (整股:張, 盤中零股: 股)
total_volume (int): 總成交量 (整股:張, 盤中零股: 股)
tick_type (int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
chg_type (int): 漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
price_chg (decimal): 漲跌
pct_chg (decimal):  漲跌幅
bid_side_total_vol (int): 買盤成交總量 (整股:張, 盤中零股: 股)
ask_side_total_vol (int): 賣盤成交總量 (整股:張, 盤中零股: 股)
bid_side_total_cnt (int): 買盤成交筆數 
ask_side_total_cnt (int): 賣盤成交筆數 
closing_oddlot_shares (int): 盤後零股成交股數(股)   
fixed_trade_vol (int): 定盤成交量 (整股:張, 盤中零股: 股)
suspend (bool): 暫停交易
simtrade (bool): 試撮
intraday_odd (int): 盤中零股 {0: 整股, 1:盤中零股}

```

```
AmountSum (:List:float): 總成交額
Close (:List:float): 成交價
Date (str): 日期 (yyyy/MM/dd)
TickType (:List:int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
Time (str): 時間 (HH:mm:ss.ffffff)
VolSum (:List:int): 總成交量 (張)
Volume (:List:int): 成交量 (張)

```

## BidAsk

### 整股

In

```
api.quote.subscribe(
    api.Contracts.Stocks["2330"], 
    quote_type = sj.constant.QuoteType.BidAsk,
    version = sj.constant.QuoteVersion.v1
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/STK/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

Exchange.TSE 
BidAsk(
    code = '2330', 
    datetime = datetime.datetime(2021, 7, 1, 9, 9, 54, 36828), 
    bid_price = [Decimal('593'), Decimal('592'), Decimal('591'), Decimal('590'), Decimal('589')], 
    bid_volume = [248, 180, 258, 267, 163], 
    diff_bid_vol = [3, 0, 0, 0, 0], 
    ask_price = [Decimal('594'), Decimal('595'), Decimal('596'), Decimal('597'), Decimal('598')], 
    ask_volume = [1457, 531, 506, 90, 259], 
    diff_ask_vol = [0, 0, 0, 0, 0], 
    suspend = 0, 
    simtrade = 0,
    intraday_odd = 0
)

```

```
Response Code: 200 | Event Code: 16 | Info: QUT/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

QUT/idcdmzpcr01/TSE/2330 
{
    'AskPrice': [594.0, 595.0, 596.0, 597.0, 598.0], 
    'AskVolume': [1465, 532, 507, 92, 258], 
    'BidPrice': [593.0, 592.0, 591.0, 590.0, 589.0], 
    'BidVolume': [254, 178, 255, 268, 163], 
    'Date': '2021/07/01', 
    'Time': '09:09:48.447219'
}

```

### 盤中零股

In

```
api.quote.subscribe(
    api.Contracts.Stocks["2330"], 
    quote_type = sj.constant.QuoteType.BidAsk,
    version = sj.constant.QuoteVersion.v1
    intraday_odd=True
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/ODD/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

Exchange.TSE 
BidAsk(
    code = '2330',
    datetime = datetime.datetime(2021, 7, 2, 13, 17, 45, 743299),
    bid_price = [Decimal('589'), Decimal('588'), Decimal('587'), Decimal('586'), Decimal('585')], 
    bid_volume = [59391, 224490, 74082, 68570, 125246], 
    diff_bid_vol = [49874, 101808, 23863, 38712, 77704], 
    ask_price = [Decimal('590'), Decimal('591'), Decimal('592'), Decimal('593'), Decimal('594')], 
    ask_volume = [26355, 9680, 18087, 11773, 3568], 
    diff_ask_vol = [13251, -14347, 39249, -20397, -10591], 
    suspend = 0, 
    simtrade = 1, 
    intraday_odd = 1
)

```

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/*/TSE/2330/ODDLOT | Event: Subscribe or Unsubscribe ok

QUO/v2/replay/TSE/2330/ODDLOT 
{
    'Date': '2021/07/01', 
    'Time': '09:43:47.143789', 
    'BidPrice': ['592', '591', '590', '589', '588'], 
    'AskPrice': ['593', '594', '595', '596', '597'], 
    'BidShares': [16979, 12009, 45045, 5501, 12956], 
    'AskShares': [17276, 14823, 26518, 23388, 10527], 
    'Simtrade': 1
}

```

### 屬性

BidAsk

```
code (str): 商品代碼
datetime (datetime): 時間
bid_price (:List:decimal): 委買價
bid_volume (:List:int): 委買量 (張)
diff_bid_vol (:List:int): 買價增減量 (張)
ask_price (:List:decimal): 委賣價
ask_volume (:List:int): 委賣量
diff_ask_vol (:List:int): 賣價增減量 (張)
suspend (bool): 暫停交易
simtrade (bool): 試撮

```

```
AskPrice (:List:float): 委賣價
AskVolume (:List:int): 委賣量
BidPrice (:List:float): 委買價
BidVolume (:List:int): 委買量
Date (datetime.date): 日期 (yyyy/MM/dd)
Time (time): 時間 (HH:mm:ss.ffffff)

```

## Quote

### 整股

In

```
api.quote.subscribe(
    api.Contracts.Stocks["2330"], 
    quote_type = sj.constant.QuoteType.Quote, 
    version = sj.constant.QuoteVersion.v1
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/STK/*/TSE/2330 | Event: Subscribe or Unsubscribe ok

Exchange.TSE, 
Quote(
    code='2330', 
    datetime=datetime.datetime(2022, 7, 1, 10, 43, 15, 430329), 
    open=Decimal('471.5'), 
    avg_price=Decimal('467.91'), 
    close=Decimal('461'), 
    high=Decimal('474'), 
    low=Decimal('461'), 
    amount=Decimal('461000'), 
    total_amount=Decimal('11834476000'), 
    volume=1, 
    total_volume=25292, 
    tick_type=2, 
    chg_type=4, 
    price_chg=Decimal('-15'), 
    pct_chg=Decimal('-3.15'), 
    bid_side_total_vol=9350, 
    ask_side_total_vol=15942, 
    bid_side_total_cnt=2730, 
    ask_side_total_cnt=2847, 
    closing_oddlot_shares=0, 
    closing_oddlot_close=Decimal('0.0'), 
    closing_oddlot_amount=Decimal('0'), 
    closing_oddlot_bid_price=Decimal('0.0'), 
    closing_oddlot_ask_price=Decimal('0.0'), 
    fixed_trade_vol=0, 
    fixed_trade_amount=Decimal('0'), 
    bid_price=[Decimal('461'), Decimal('460.5'), Decimal('460'), Decimal('459.5'), Decimal('459')], 
    bid_volume=[220, 140, 994, 63, 132], 
    diff_bid_vol=[-1, 0, 0, 0, 0], 
    ask_price=[Decimal('461.5'), Decimal('462'), Decimal('462.5'), Decimal('463'), Decimal('463.5')], 
    ask_volume=[115, 101, 103, 147, 91], 
    diff_ask_vol=[0, 0, 0, 0, 0], 
    avail_borrowing=9579699, 
    suspend=0, 
    simtrade=0
)

```

### 屬性

Quote

```
code (str): 商品代碼
datetime (datetime): 時間
open (decimal): 開盤價
avg_price (decimal): 均價
close (decimal): 成交價
high (decimal): 最高價(自開盤)
low (decimal): 最低價(自開盤)
amount (decimal): 成交額 (NTD)
total_amount (decimal): 總成交額 (NTD)
volume (int): 成交量
total_volume (int): 總成交量
tick_type (int): 內外盤別
chg_type (int): 漲跌註記
price_chg (decimal): 漲跌價
pct_chg (decimal): 漲跌率
bid_side_total_vol (int): 買盤成交總量 (張)
ask_side_total_vol (int): 賣盤成交總量 (張)
bid_side_total_cnt (int): 買盤成交筆數
ask_side_total_cnt (int): 賣盤成交筆數
closing_oddlot_shares (int): 盤後零股成交股數 
closing_oddlot_close (decimal): 盤後零股成交價
closing_oddlot_amount (decimal): 盤後零股成交額
closing_oddlot_bid_price (decimal): 盤後零股買價 
closing_oddlot_ask_price (decimal): 盤後零股賣價 
fixed_trade_vol (int): 定盤成交量 (張)
fixed_trade_amount (decimal): 定盤成交額
bid_price (:List:decimal): 買價
bid_volume (:List:int) 買量
diff_bid_vol (:List:int) 買價增減量
ask_price (:List:decimal): 賣價
ask_volume (:List:int) 賣量
diff_ask_vol (:List:int) 賣價增減量
avail_borrowing (int): 借券可用餘額
suspend (bool): 暫停交易
simtrade (bool): 試撮

```

## Callback

預設狀況下我們將即時行情使用`print`的方式呈現。可根據個人需求修改函數。請避免在函數內進行運算。

#### Tick

decorator方式

```
from shioaji import TickSTKv1, Exchange

@api.on_tick_stk_v1()
def quote_callback(exchange: Exchange, tick:TickSTKv1):
    print(f"Exchange: {exchange}, Tick: {tick}")

```

```
@api.quote.on_quote
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

```

傳統方式

```
from shioaji import TickSTKv1, Exchange

def quote_callback(exchange: Exchange, tick:TickSTKv1):
    print(f"Exchange: {exchange}, Tick: {tick}")

api.quote.set_on_tick_stk_v1_callback(quote_callback)

```

```
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

api.quote.set_quote_callback(quote_callback)

```

Out

```
Exchange: Exchange.TSE, Tick: Tick(code='2330', datetime=datetime.datetime(2021, 7, 2, 13, 16, 35, 92970), open=Decimal('590'), avg_price=Decimal('589.05'), close=Decimal('590'), high=Decimal('593'), low=Decimal('587'), amount=Decimal('590000'), total_amount=Decimal('8540101000'), volume=1, total_volume=14498, tick_type=1, chg_type=4, price_chg=Decimal('-3'), pct_chg=Decimal('-0.505902'), trade_bid_volume=6638, ask_side_total_vol=7860, bid_side_total_cnt=2694, ask_side_total_cnt=2705, closing_oddlot_shares=0, fixed_trade_vol=0, suspend=0, simtrade=0, intraday_odd=0)

```

```
Topic: MKT/*/TSE/2330, Quote: {'AmountSum': [4739351000.0], 'Close': [596.0], 'Date': '2021/03/30', 'TickType': [2], 'Time': '10:01:33.349431', 'VolSum': [7932], 'Volume': [1]}

```

### BidAsk

decorator方式

```
from shioaji import BidAskSTKv1, Exchange

@api.on_bidask_stk_v1()
def quote_callback(exchange: Exchange, bidask:BidAskSTKv1):
    print(f"Exchange: {exchange}, BidAsk: {bidask}")

```

```
@api.quote.on_quote
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

```

傳統方式

```
from shioaji import BidAskSTKv1, Exchange

def quote_callback(exchange: Exchange, bidask:BidAskSTKv1):
    print(f"Exchange: {exchange}, BidAsk: {bidask}")

api.quote.set_on_bidask_stk_v1_callback(quote_callback)

```

```
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

api.quote.set_quote_callback(quote_callback)

```

Out

```
Exchange: Exchange.TSE, BidAsk: BidAsk(code='2330', datetime=datetime.datetime(2021, 7, 2, 13, 17, 29, 726428), bid_price=[Decimal('589'), Decimal('588'), Decimal('587'), Decimal('586'), Decimal('585')], bid_volume=[223, 761, 1003, 809, 1274], diff_bid_vol=[0, 0, 0, 0, 0], ask_price=[Decimal('590'), Decimal('591'), Decimal('592'), Decimal('593'), Decimal('594')], ask_volume=[304, 232, 183, 242, 131], diff_ask_vol=[1, 0, 0, 0, 0], suspend=0, simtrade=0, intraday_odd=0)

```

```
Topic: QUT/idcdmzpcr01/TSE/2330, Quote: {'AskPrice': [590.0, 591.0, 592.0, 593.0, 594.0], 'AskVolume': [303, 232, 183, 242, 131], 'BidPrice': [589.0, 588.0, 587.0, 586.0, 585.0], 'BidVolume': [224, 762, 1003, 809, 1274], 'Date': '2021/07/02', 'Time': '13:17:26.391840'}

```

### Quote

decorator方式

```
from shioaji import QuoteSTKv1, Exchange

@api.on_quote_stk_v1()
def quote_callback(exchange: Exchange, quote:QuoteSTKv1):
    print(f"Exchange: {exchange}, Quote: {quote}")

```

傳統方式

```
from shioaji import QuoteSTKv1, Exchange

def quote_callback(exchange: Exchange, quote:QuoteSTKv1):
    print(f"Exchange: {exchange}, Quote: {quote}")

api.quote.set_on_quote_stk_v1_callback(quote_callback)

```

Out

```
Exchange: TSE, Quote: Quote(code='2330', datetime=datetime.datetime(2022, 7, 1, 10, 43, 15, 430329), open=Decimal('471.5'), avg_price=Decimal('467.91'), close=Decimal('461'), high=Decimal('474'), low=Decimal('461'), amount=Decimal('461000'), total_amount=Decimal('11834476000'), volume=1, total_volume=25292, tick_type=2, chg_type=4, price_chg=Decimal('-15'), pct_chg=Decimal('-3.15'), bid_side_total_vol=9350, ask_side_total_vol=15942, bid_side_total_cnt=2730, ask_side_total_cnt=2847, closing_oddlot_shares=0, closing_oddlot_close=Decimal('0.0'), closing_oddlot_amount=Decimal('0'), closing_oddlot_bid_price=Decimal('0.0'), closing_oddlot_ask_price=Decimal('0.0'), fixed_trade_vol=0, fixed_trade_amount=Decimal('0'), bid_price=[Decimal('461'), Decimal('460.5'), Decimal('460'), Decimal('459.5'), Decimal('459')], bid_volume=[220, 140, 994, 63, 132], diff_bid_vol=[-1, 0, 0, 0, 0], ask_price=[Decimal('461.5'), Decimal('462'), Decimal('462.5'), Decimal('463'), Decimal('463.5')], ask_volume=[115, 101, 103, 147, 91], diff_ask_vol=[0, 0, 0, 0, 0], avail_borrowing=9579699, suspend=0, simtrade=0)

```

- 盤中零股與一般證券共用 callback函式。
- 更進階的callback使用可以參見[綁訂報價模式](../../../advanced/quote_binding/)。
