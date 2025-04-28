The feature of list_positions is used to query unrealized gain or loss of account and you need to [login](../../login) first.

## Position

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

### Stocks

#### Common Stocks

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

To DataFrame

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
id (int): position id
code (str): contract id
direction (Action): action
    {Buy, Sell}
quantity (int): quantity
price (float): the average price
last_price (float): last price
pnl (float): unrealized profit
yd_quantity (int): yesterday
cond (StockOrderCond): Default Cash
    {Cash(現股), Netting(餘額交割), MarginTrading(融資),ShortSelling(融券), Emerging(興櫃)}
margin_purchase_amount (int): margin_purchase_amount
collateral (int): collateral
short_sale_margin (int): short_sale_margin
interest (int): interest

```

#### Odd Stocks

The unit is the number of shares.

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

### Futures and Options

`account` is defaulted as a Stock account, and if you want to query the Futures or Options content, you need to bring in the `futopt_account`.

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

To DataFrame

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
id (int): position id
code (str): contract id
direction (Action): action
    {Buy, Sell}
quantity (int): quantity
price (float): the average price
last_price (float): last price
pnl (float): unrealized profit

```

## Position Detail

Using the result obtained from `list_positions`, bring the `id` into `detail_id` to query the details of that position.

### Stocks

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

To DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in position_detail)
df

```

Out

| date | code | quantity | price | last_price | direction | pnl | currency | fee | cond | ex_dividends | interest | margintrading_amt | collateral | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-02-22 | 3558 | 0 | 1461.0 | WA371 | Action.Buy | 11.0 | Currency.TWD | 1.0 | StockOrderCond.Cash | 0 | 0 | 0 | 0 |

屬性

```
date (str): trade date
code (str): contract id    
quantity (int): quantity
price (float): price
last_price (float): last price
dseq (str): detail seqno no
direction (Action): {Buy, Sell}
pnl (decimal): unrealized profit
currency (string): {NTD, USD, HKD, EUR, CAD, BAS}
fee (decimal): fee
cond (StockOrderCond): Default Cash
    {Cash, Netting, MarginTrading,ShortSelling, Emerging}
ex_dividends(int): ex-dividend amount
interest (int): interest
margintrading_amt(int): margin trading amount
collateral (int): collateral 

```

### Futures and Options

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

To DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in position_detail)
df

```

Out

| date | code | quantity | price | last_price | dseq | direction | pnl | currency | entry_quantity | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2023-02-14 | MXFC3 | 1 | 15611.0 | 15541.0 | tA0n8 | Action.Buy | -3500.0 | Currency.TWD | 1 |

屬性

```
code (str): contract id
date (str): trade date
quantity (int): quantity
price (float): price
last_price (float): last price    
dseq (str): detail seqno no
direction (Action): {Buy, Sell}
pnl (float): unrealized profit
currency (str): {NTD, USD, HKD, EUR, CAD, BAS}
fee (float or int): fee
entry_quantity(int): entry quantity

```
