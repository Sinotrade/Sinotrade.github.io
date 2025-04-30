用於查詢帳戶未實現損益，需要先[登入](../../login)。

## 未實現損益

In

```
api.list_positions?

```

Out

```
Signature:
api.list_positions(
    account: shioaji.account.Account = None,
    unit: shioaji.constant.Unit = <Unit.Common: 'Common'>,
    timeout: int = 5000,
    cb: Callable[[List[Union[shioaji.position.StockPosition, shioaji.position.FuturePosition]]], NoneType] = None,
) -> List[Union[shioaji.position.StockPosition, shioaji.position.FuturePosition]]
Docstring:
query account of unrealized gain or loss
Args:
    account (:obj:Account):
        choice the account from listing account (Default: stock account)

```

### 證券

#### 整股部位

In

```
api.list_positions(api.stock_account)

```

Out

```
[
    StockPosition(
        id=0, 
        code='2890', 
        direction=<Action.Buy: 'Buy'>, 
        quantity=12, 
        price=2.79, 
        last_price=16.95, 
        pnl=169171.0, 
        yd_quantity=12, 
        margin_purchase_amount=0, 
        collateral=0, 
        short_sale_margin=0, 
        interest=0
    )
]

```

轉成DataFrame

In

```
positions = api.list_positions(api.stock_account)
df = pd.DataFrame(s.__dict__ for s in positions)
df

```

Out

| id | code | direction | quantity | price | last_price | pnl | yd_quantity | cond | margin_purchase_amount | collateral | short_sale_margin | interest | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 0 | 2890 | Buy | 12 | 2.79 | 16.95 | 169172 | 12 | Cash | 0 | 0 | 0 |

StockPosition

```
id (int): 部位代碼
code (str): 商品代碼
direction (Action): {Buy: 買, Sell: 賣}
quantity (int): 數量
price (float): 平均價格
last_price (float): 目前股價
pnl (float): 損益
yd_quantity (int): 昨日庫存數量
cond (StockOrderCond): {
    Cash: 現股(預設值), 
    Netting: 餘額交割,
    MarginTrading: 融資, 
    ShortSelling: 融券, 
    Emerging: 興櫃
    }
margin_purchase_amount (int): 融資金額 
collateral (int): 擔保品 
short_sale_margin (int): 保證金
interest (int): 利息

```

#### 零股部位

單位為股數

In

```
api.list_positions(
    api.stock_account, 
    unit=sj.constant.Unit.Share
)

```

Out

```
[
    StockPosition(
        id=0, 
        code='2890', 
        direction=<Action.Buy: 'Buy'>, 
        quantity=10000, 
        price=10.1, 
        last_price=12.0, 
        pnl=1234.0, 
        yd_quantity=10000, 
        margin_purchase_amount=0, 
        collateral=0, 
        short_sale_margin=0, 
        interest=0
    )
]

```

### 期貨選擇權

`account`預設為證券帳號，若欲查詢期權內容需帶入期權帳號。

In

```
api.list_positions(api.futopt_account)

```

Out

```
[
    FuturePosition(
        id=0,
        code='TX201370J2', 
        direction=<Action.Buy: 'Buy'>, 
        quantity=3, 
        price=131.0000, 
        last_price=126.0, 
        pnl=-750.00
    )
]

```

轉成DataFrame

In

```
positions = api.list_positions(api.futopt_account)
df = pd.DataFrame(p.__dict__ for p in positions)
df

```

Out

| id | code | direction | quantity | price | last_price | pnl | | --- | --- | --- | --- | --- | --- | --- | | 0 | TXFA3 | Buy | 4 | 14181 | 14375 | 155200 |

FuturePosition

```
id (int): 部位代碼
code (str): 商品代碼
direction (Action): {Buy: 買, Sell: 賣}
quantity (int): 數量
price (float): 平均價格
last_price (float): 目前價格
pnl (float): 損益

```

## 未實現損益 - 明細

可從針對`list_positions`得到的結果，將`id`帶入`detail_id`查詢該筆明細。

### 證券

In

```
api.list_position_detail?

```

Out

```
Signature:
    api.list_position_detail(
    account: shioaji.account.Account = None,
    detail_id: int = 0,
    timeout: int = 5000,
    cb: Callable[[List[Union[shioaji.position.StockPositionDetail, shioaji.position.    FuturePositionDetail]]], NoneType] = None,
) -> List[Union[shioaji.position.StockPositionDetail, shioaji.position.FuturePositionDetail]]
Docstring:
query account of position detail

Args:
    account (:obj:Account):
        choice the account from listing account (Default: stock account)
    detail_id (int): the id is from Position object, Position is from list_positions

```

In

```
position_detail = api.list_position_detail(api.stock_account, 1)
position_detail

```

Out

```
[
    StockPositionDetail(
        date='2023-02-22', 
        code='3558', 
        quantity=0, 
        price=1461.0, 
        last_price=1470.0, 
        dseq='WA371', 
        direction=<Action.Buy: 'Buy'>, 
        pnl=9.0, 
        currency=<Currency.TWD: 'TWD'>, 
        fee=1.0
    )
]

```

轉成DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in position_detail)
df

```

Out

| date | code | quantity | price | last_price | direction | pnl | currency | fee | cond | ex_dividends | interest | margintrading_amt | collateral | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-02-22 | 3558 | 0 | 1461.0 | WA371 | Action.Buy | 11.0 | Currency.TWD | 1.0 | StockOrderCond.Cash | 0 | 0 | 0 | 0 |

屬性

```
date (str): 交易日期
code (str): 商品代碼    
quantity (int): 數量
price (float): 付出成本
last_price (float): 現值
dseq (str): 委託書號
direction (Action): {Buy: 買, Sell: 賣}
pnl (decimal): 損益
currency (string): 幣別 {NTD, USD, HKD, EUR, CAD, BAS}
fee (decimal): 交易手續費
cond (StockOrderCond): {
    Cash: 現股(預設值), 
    Netting: 餘額交割,
    MarginTrading: 融資, 
    ShortSelling: 融券, 
    Emerging: 興櫃
    }
ex_dividends(int): 除息金額
interest (int): 除息
margintrading_amt(int): 融資金額
collateral (int): 擔保品 

```

### 期貨選擇權

In

```
position_detail = api.list_position_detail(api.futopt_account, 0)
position_detail

```

Out

```
[
    FuturePositionDetail(
        date='2023-02-14', 
        code='MXFC3', 
        quantity=1, 
        price=15611.0, 
        last_price=15541.0, 
        dseq='tA0n8', 
        direction=<Action.Buy: 'Buy'>, 
        pnl=-3500.0, 
        currency=<Currency.TWD: 'TWD'>, 
        entry_quantity=1
    )
]

```

轉成DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in position_detail)
df

```

Out

| date | code | quantity | price | last_price | dseq | direction | pnl | currency | entry_quantity | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-02-14 | MXFC3 | 1 | 15611.0 | 15541.0 | tA0n8 | Action.Buy | -3500.0 | Currency.TWD | 1 |

屬性

```
code (str): 商品代碼
date (str): 交易日期
quantity (int): 數量
price (float): 價格
last_price (float): 目前股價    
dseq (str): 委託書號
direction (Action): {Buy: 買, Sell: 賣}
pnl (float): 損益
currency (str): 幣別 {NTD, USD, HKD, EUR, CAD, BAS}
fee (float or int): 交易手續費
entry_quantity(int): 新倉數量

```
