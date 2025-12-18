To subscribe quotes is very easy, just call `subscribe` function with [contract](../../../contract/) which we've discussed in previous topic.

Subscribe

```
api.quote.subscribe?

    Signature:
        api.quote.subscribe(
            contract:shioaji.contracts.Contract,
            quote_type:shioaji.constant.QuoteType=<QuoteType.Tick: 'tick'>,
            intraday_odd:bool=False,
            version: shioaji.constant.QuoteVersion=<QuoteVersion.v0: 'v0'>,
        )
    Docstring: <no docstring>
    Type:      method

```

Quote Parameters:

```
quote_type: tick price or bid/ask price to subscribe
    {'tick', 'bidask', 'quote'}
intraday_odd: 盤中零股
    {True, False}
version: version of quote format
    {'v1', 'v0'}

```

## Tick

### Example

In

```
api.quote.subscribe(
    api.Contracts.Futures.TXF['TXF202107'],
    quote_type = sj.constant.QuoteType.Tick,
    version = sj.constant.QuoteVersion.v1,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: TIC/v1/FOP/*/TFE/TXFG1 | Event: Subscribe or Unsubscribe ok

Exchange.TAIFEX 
Tick(
    code = 'TXFG1', 
    datetime = datetime.datetime(2021, 7, 1, 10, 42, 29, 757000), 
    open = Decimal('17678'), 
    underlying_price = Decimal('17849.57'), 
    bid_side_total_vol= 32210, 
    ask_side_total_vol= 33218, 
    avg_price = Decimal('17704.663999'), 
    close = Decimal('17753'), 
    high = Decimal('17774'), 
    low = Decimal('17655'), 
    amount = Decimal('17753'), 
    total_amount = Decimal('913790823'), 
    volume = 1, 
    total_volume = 51613, 
    tick_type = 0, 
    chg_type = 2, 
    price_chg = Decimal('41'), 
    pct_chg = Decimal('0.231481'), 
    simtrade = 0
)

```

```
Response Code: 200 | Event Code: 16 | Info: L/*/TXFG1 | Event: Subscribe or Unsubscribe ok

L/TFE/TXFG1 
{
    'Amount': [17754.0], 
    'AmountSum': [913027415.0], 
    'AvgPrice': [17704.623134], 
    'Close': [17754.0], 
    'Code': 'TXFG1', 
    'Date': '2021/07/01', 
    'DiffPrice': [42.0], 
    'DiffRate': [0.237127], 
    'DiffType': [2], 
    'High': [17774.0], 
    'Low': [17655.0], 
    'Open': 17678.0, 
    'TargetKindPrice': 17849.57, 
    'TickType': [2], 
    'Time': '10:42:25.552000', 
    'TradeAskVolSum': 33198, 
    'TradeBidVolSum': 32180, 
    'VolSum': [51570], 
    'Volume': [1]
}

```

### Attributes

Tick

```
code (str): 商品代碼
datetime (datetime.datetime): 日期
open (Decimal): 開盤價
underlying_price (Decimal): 標的物價格
bid_side_total_vol(int): 買盤成交總量 (lot)
ask_side_total_vol(int): 賣盤成交總量 (lot)
avg_price (Decimal): 均價
close (Decimal): 成交價
high (Decimal): 最高價(自開盤)
low (Decimal): 最低價(自開盤)
amount (Decimal): 成交額 (NTD)
total_amount (Decimal): 總成交額 (NTD)
volume (int): 成交量 (lot)
total_volume (int): 總成交量 (lot)
tick_type (int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
chg_type (int): 漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
price_chg (Decimal): 漲跌
pct_chg (Decimal): 漲跌幅 (%)
simtrade (int): 試撮

```

```
Amount (list of float): 成交額 (成交價)
AmountSum (list of float): 總成交額 (總成交價)
AvgPrice (list of float): 均價
Close (list of float): 成交價
Code (str): 商品代碼
Date (str): 日期 (yyyy/MM/dd)
DiffPrice (list of float): 漲跌
DiffRate (list of float): 漲跌幅 (%)
DiffType (list of int): 漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
High (list of float): 最高價(自開盤)
Low (list of float): 最低價(自開盤)
Open (float): 開盤價
TargetKindPrice float: 標的物價格
TickType (:list:int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
Time (str): 時間 (HH:mm:ss.ffffff)
TradeAskVolSum (int): 賣盤成交總量 (lot)
TradeBidVolSum (int): 買盤成交總量 (lot)
VolSum (list of int): 總成交量 (lot)
Volume (list of int): 成交量 (lot)

```

## BidAsk

### Example

In

```
api.quote.subscribe(
    api.Contracts.Futures.TXF['TXF202107'],
    quote_type = sj.constant.QuoteType.BidAsk,
    version = sj.constant.QuoteVersion.v1
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v1/FOP/*/TFE/TXFG1 | Event: Subscribe or Unsubscribe ok

Exchange.TAIFEX 
BidAsk(
    code = 'TXFG1', 
    datetime = datetime.datetime(2021, 7, 1, 10, 51, 31, 999000), 
    bid_total_vol = 66, 
    ask_total_vol = 101, 
    bid_price = [Decimal('17746'), Decimal('17745'), Decimal('17744'), Decimal('17743'), Decimal('17742')], 
    bid_volume = [1, 14, 19, 17, 15], 
    diff_bid_vol = [0, 1, 0, 0, 0], 
    ask_price = [Decimal('17747'), Decimal('17748'), Decimal('17749'), Decimal('17750'), Decimal('17751')], 
    ask_volume = [6, 22, 25, 32, 16], 
    diff_ask_vol = [0, 0, 0, 0, 0], 
    first_derived_bid_price = Decimal('17743'), 
    first_derived_ask_price = Decimal('17751'), 
    first_derived_bid_vol = 1, 
    first_derived_ask_vol = 1, 
    underlying_price = Decimal('17827.94'), 
    simtrade = 0
)

```

```
Response Code: 200 | Event Code: 16 | Info: Q/*/TXFG1 | Event: Subscribe or Unsubscribe ok

Q/TFE/TXFG1 
{
    'AskPrice': [17747.0, 17748.0, 17749.0, 17750.0, 17751.0], 
    'AskVolSum': 99, 
    'AskVolume': [6, 22, 25, 31, 15], 
    'BidPrice': [17746.0, 17745.0, 17744.0, 17743.0, 17742.0], 
    'BidVolSum': 81, 
    'BidVolume': [1, 12, 23, 25, 20], 
    'Code': 'TXFG1', 
    'Date': '2021/07/01', 
    'DiffAskVol': [0, 0, 0, 0, 0], 
    'DiffAskVolSum': 0, 
    'DiffBidVol': [0, 0, 2, 0, 0], 
    'DiffBidVolSum': 0, 
    'FirstDerivedAskPrice': 17751.0, 
    'FirstDerivedAskVolume': 1, 
    'FirstDerivedBidPrice': 17743.0, 
    'FirstDerivedBidVolume': 1, 
    'TargetKindPrice': 17828.46, 
    'Time': '10:51:29.999000'
}

```

### Attributes

BidAsk

```
code (str): 商品代碼
datetime (datetime.datetime): 時間
bid_total_vol (int): 委買量總計 (lot)
ask_total_vol (int): 委賣量總計 (lot)
bid_price (:List:decimal): 委買價
bid_volume (:List:int): 委買量 (lot)
diff_bid_vol (:List:int): 委買價增減量 (lot)
ask_price (:List:decimal): 委賣價
ask_volume (:List:int): 委賣量 (lot)
diff_ask_vol (:List:int): 委賣價增減量 (lot)
first_derived_bid_price (decimal): 衍生一檔委買價
first_derived_ask_price (decimal): 衍生一檔委賣價
first_derived_bid_vol (int): 衍生一檔委買量
first_derived_ask_vol (int): 衍生一檔委賣量
underlying_price (decimal): 標的物價格
simtrade (int): 試撮

```

```
AskPrice (:List:float): 委賣價
AskVolSum (int): 委賣量總計(lot)
AskVolume (:List:int): 委賣量
BidPrice (:List:float): 委買價
BidVolSum (int): 委買量總計(lot)
BidVolume (:List:int): 委買量
Code (str): 商品代碼
Date (str): 日期 (yyyy/MM/dd)
DiffAskVol (:List:int): 賣價增減量(lot)
DiffAskVolSum (int): 
DiffBidVol (:List:int): 買價增減量(lot)
DiffBidVolSum (int): 
FirstDerivedAskPrice (float): 衍生一檔委賣價
FirstDerivedAskVolume (int): 衍生一檔委賣量
FirstDerivedBidPrice (float): 衍生一檔委買價
FirstDerivedBidVolume (int): 衍生一檔委買量
TargetKindPrice (float): 標的物價格
Time (str): 時間 (HH:mm:ss.ffffff)

```

## Quote

### Example

In

```
api.quote.subscribe(
    api.Contracts.Futures.TXF['TXF202512'],
    quote_type = sj.constant.QuoteType.Quote,
    version = sj.constant.QuoteVersion.v1,
)

```

Out

```
Response Code: 200 | Event Code: 16 | Info: QUO/v2/FOP/*/TFE/TXFL5 | Event: Subscribe or Unsubscribe ok

Exchange.TAIFEX
Quote(
    code = 'TXFL5',
    datetime = datetime.datetime(2025, 12, 12, 11, 29, 46, 247000),
    open = Decimal('28266'),
    avg_price = Decimal('28284.374007'),
    close = Decimal('28220'),
    high = Decimal('28342'),
    low = Decimal('28192'),
    amount = Decimal('28220'),
    total_amount = Decimal('946904273'),
    volume = 0,
    total_volume = 33478,
    tick_type = 1,
    chg_type = 2,
    price_chg = Decimal('119'),
    pct_chg = Decimal('0.423472'),
    bid_side_total_vol = 15254,
    ask_side_total_vol = 17295,
    bid_side_total_cnt = 22855,
    ask_side_total_cnt = 21882,
    bid_price = [Decimal('28218'), Decimal('28217'), Decimal('28216'), Decimal('28215'), Decimal('28214')],
    bid_volume = [5, 6, 11, 6, 10],
    diff_bid_vol = [0, 0, 0, 0, 0],
    ask_price = [Decimal('28220'), Decimal('28221'), Decimal('28222'), Decimal('28223'), Decimal('28224')],
    ask_volume = [2, 8, 14, 9, 9],
    diff_ask_vol = [0, -1, 1, 0, 0],
    first_derived_bid_price = Decimal('28215'),
    first_derived_ask_price = Decimal('28222'),
    first_derived_bid_vol = 1,
    first_derived_ask_vol = 1,
    underlying_price = Decimal('28185.62'),
    simtrade = False
)

```

### Attributes

Quote

```
code (str): 商品代碼
datetime (datetime.datetime): 時間
open (Decimal): 開盤價
avg_price (Decimal): 均價
close (Decimal): 成交價
high (Decimal): 最高價(自開盤)
low (Decimal): 最低價(自開盤)
amount (Decimal): 成交額 (NTD)
total_amount (Decimal): 總成交額 (NTD)
volume (int): 成交量 (lot)
total_volume (int): 總成交量 (lot)
tick_type (int): 內外盤別{1: 外盤, 2: 內盤, 0: 無法判定}
chg_type (int): 漲跌註記{1: 漲停, 2: 漲, 3: 平盤, 4: 跌, 5: 跌停}
price_chg (Decimal): 漲跌
pct_chg (Decimal): 漲跌幅 (%)
bid_side_total_vol (int): 買盤成交總量 (lot)
ask_side_total_vol (int): 賣盤成交總量 (lot)
bid_side_total_cnt (int): 買盤成交筆數
ask_side_total_cnt (int): 賣盤成交筆數
bid_price (:List:Decimal): 委買價
bid_volume (:List:int): 委買量 (lot)
diff_bid_vol (:List:int): 委買價增減量 (lot)
ask_price (:List:Decimal): 委賣價
ask_volume (:List:int): 委賣量 (lot)
diff_ask_vol (:List:int): 委賣價增減量 (lot)
first_derived_bid_price (Decimal): 衍生一檔委買價
first_derived_ask_price (Decimal): 衍生一檔委賣價
first_derived_bid_vol (int): 衍生一檔委買量
first_derived_ask_vol (int): 衍生一檔委賣量
underlying_price (Decimal): 標的物價格
simtrade (bool): 試撮

```

## Callback

In default, we set quote callback as print function. You can modify callback function as you wish. Just remember, always avoid making calulations inside the callback function.

### Tick

In: pythonic way by using decorator

```
from shioaji import TickFOPv1, Exchange

@api.on_tick_fop_v1()
def quote_callback(exchange:Exchange, tick:TickFOPv1):
    print(f"Exchange: {exchange}, Tick: {tick}")

```

```
@api.quote.on_quote
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

```

In: traditional way

```
from shioaji import TickFOPv1, Exchange

def quote_callback(exchange:Exchange, tick:TickFOPv1):
    print(f"Exchange: {exchange}, Tick: {tick}")

api.quote.set_on_tick_fop_v1_callback(quote_callback)

```

```
def quote_callback(topic: str, tick: dict):
    print(f"Topic: {topic}, Tick: {tick}")

api.quote.set_quote_callback(quote_callback)

```

Out

```
Exchange: Exchange.TAIFEX, Tick: Tick(code='TXFG1', datetime=datetime.datetime(2021, 7, 2, 13, 17, 22, 784000), open=Decimal('17651'), underlying_price=Decimal('17727.12'), trade_bid_total_vol=61550, trade_ask_volume=60914, avg_price=Decimal('17657.959752'), close=Decimal('17653'), high=Decimal('17724'), low=Decimal('17588'), amount=Decimal('35306'), total_amount=Decimal('1683421593'), volume=2, total_volume=95335, tick_type=1, chg_type=2, price_chg=Decimal('7'), pct_chg=Decimal('0.039669'), simtrade=0)

```

```
Topic: L/TFE/TXFG1, Quote: {'Amount': [17654.0], 'AmountSum': [1682856730.0], 'AvgPrice': [17657.961764], 'Close': [17654.0], 'Code': 'TXFG1', 'Date': '2021/07/02', 'DiffPrice': [8.0], 'DiffRate': [0.045336], 'DiffType': [2], 'High': [17724.0], 'Low': [17588.0], 'Open': 17651.0, 'TargetKindPrice': 17725.14, 'TickType': [1], 'Time': '13:17:16.533000', 'TradeAskVolSum': 60890, 'TradeBidVolSum': 61520, 'VolSum': [95303], 'Volume': [1]}

```

### BidAsk

In: pythonic way by using decorator

```
from shioaji import BidAskFOPv1, Exchange

@api.on_bidask_fop_v1()
def quote_callback(exchange:Exchange, bidask:BidAskFOPv1):
    print(f"Exchange: {exchange}, BidAsk: {bidask}")

```

```
@api.quote.on_quote
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

```

In: traditional way

```
from shioaji import BidAskFOPv1, Exchange

def quote_callback(exchange:Exchange, bidask:BidAskFOPv1):
    print(f"Exchange: {exchange}, BidAsk: {bidask}")

api.quote.set_on_bidask_fop_v1_callback(quote_callback)

```

```
def quote_callback(topic: str, quote: dict):
    print(f"Topic: {topic}, Quote: {quote}")

api.quote.set_quote_callback(quote_callback)

```

Out

```
Exchange: Exchange.TAIFEX, BidAsk: BidAsk(code='TXFG1', datetime=datetime.datetime(2021, 7, 2, 13, 18, 0, 684000), bid_total_vol=69, ask_total_vol=94, bid_price=[Decimal('17651'), Decimal('17650'), Decimal('17649'), Decimal('17648'), Decimal('17647')], bid_volume=[10, 12, 18, 18, 11], diff_bid_vol=[0, 0, 0, 0, 0], ask_price=[Decimal('17653'), Decimal('17654'), Decimal('17655'), Decimal('17656'), Decimal('17657')], ask_volume=[6, 17, 29, 22, 20], diff_ask_vol=[0, 0, 0, 0, 0], first_derived_bid_price=Decimal('17647'), first_derived_ask_price=Decimal('17657'), first_derived_bid_vol=2, first_derived_ask_vol=3, underlying_price=Decimal('17725.5'), simtrade=0)

```

```
Topic: Q/TFE/TXFG1, Quote: {'AskPrice': [17653.0, 17654.0, 17655.0, 17656.0, 17657.0], 'AskVolSum': 85, 'AskVolume': [3, 16, 24, 22, 20], 'BidPrice': [17651.0, 17650.0, 17649.0, 17648.0, 17647.0], 'BidVolSum': 67, 'BidVolume': [10, 10, 18, 18, 11], 'Code': 'TXFG1', 'Date': '2021/07/02', 'DiffAskVol': [-4, -2, 0, 0, 0], 'DiffAskVolSum': 0, 'DiffBidVol': [1, 0, 2, 0, 0], 'DiffBidVolSum': 0, 'FirstDerivedAskPrice': 17657.0, 'FirstDerivedAskVolume': 3, 'FirstDerivedBidPrice': 17647.0, 'FirstDerivedBidVolume': 2, 'TargetKindPrice': 17716.19, 'Time': '13:17:57.809000'}

```

### Quote

In: pythonic way by using decorator

```
from shioaji import QuoteFOPv1, Exchange

@api.on_quote_fop_v1()
def quote_callback(exchange:Exchange, quote:QuoteFOPv1):
    print(f"Exchange: {exchange}, Quote: {quote}")

```

In: traditional way

```
from shioaji import QuoteFOPv1, Exchange

def quote_callback(exchange:Exchange, quote:QuoteFOPv1):
    print(f"Exchange: {exchange}, Quote: {quote}")

api.quote.set_on_quote_fop_v1_callback(quote_callback)

```

Out

```
Exchange: Exchange.TAIFEX, Quote: Quote(code='TXFL5', datetime=datetime.datetime(2025, 12, 12, 11, 29, 46, 247000), open=Decimal('28266'), avg_price=Decimal('28284.374007'), close=Decimal('28220'), high=Decimal('28342'), low=Decimal('28192'), amount=Decimal('28220'), total_amount=Decimal('946904273'), volume=0, total_volume=33478, tick_type=1, chg_type=2, price_chg=Decimal('119'), pct_chg=Decimal('0.423472'), bid_side_total_vol=15254, ask_side_total_vol=17295, bid_side_total_cnt=22855, ask_side_total_cnt=21882, bid_price=[Decimal('28218'), Decimal('28217'), Decimal('28216'), Decimal('28215'), Decimal('28214')], bid_volume=[5, 6, 11, 6, 10], diff_bid_vol=[0, 0, 0, 0, 0], ask_price=[Decimal('28220'), Decimal('28221'), Decimal('28222'), Decimal('28223'), Decimal('28224')], ask_volume=[2, 8, 14, 9, 9], diff_ask_vol=[0, -1, 1, 0, 0], first_derived_bid_price=Decimal('28215'), first_derived_ask_price=Decimal('28222'), first_derived_bid_vol=1, first_derived_ask_vol=1, underlying_price=Decimal('28185.62'), simtrade=False)

```

- Advanced quote callback settings please refer to [Quote-Binding Mode](../../../advanced/quote_binding/).
