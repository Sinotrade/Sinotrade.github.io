Query **stock / futures-options account** unrealized profit/loss. [Login](../../login) is required first.

## Unrealized Profit/Loss

list_positions

```
api.list_positions?

Signature:
    api.list_positions(
        account: shioaji.account.Account = None,
        unit: shioaji.Unit = <Unit.Common: 'Common'>,
        timeout: int = 5000,
        cb: Callable[[List[Union[shioaji.position.StockPosition, shioaji.position.FuturePosition]]], NoneType] = None,
    ) -> List[Union[shioaji.position.StockPosition, shioaji.position.FuturePosition]]

```

Parameters

```
account: optional, stock or futures-options account (defaults to api.stock_account)
unit:    optional, Unit.Common (common stock / default) or Unit.Share (odd lot)
timeout: timeout in milliseconds
cb:      optional, callback function, used when timeout=0

```

list_positions

```
shioaji portfolio positions [--account-type S|F] [--unit common|share] [--account BROKER_ID-ACCOUNT_ID]

```

Parameters

```
--account-type: optional, S (stock / default) or F (futures and options)
--unit:         optional, common (default) or share (odd lot)
--account:      optional, BROKER_ID-ACCOUNT_ID format; defaults to the default account if omitted

```

list_positions

```
POST /api/v1/portfolio/position_unit
Content-Type: application/json

{
  "account_type": "S",
  "unit": "Common",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: optional, "S" (stock / default) or "F" (futures and options)
unit:         optional, "Common" (default) or "Share" (odd lot)
broker_id:    optional, broker ID
account_id:   optional, account ID
person_id:    optional, personal ID

```

### Stock

StockPosition

```
id (int):                       position ID
code (str):                     symbol code
direction (Action):             buy/sell {Buy, Sell}
quantity (int):                 quantity
price (float):                  average price
last_price (float):             current price
pnl (float):                    profit/loss
yd_quantity (int):              yesterday's quantity
cond (StockOrderCond):          {Cash, Netting, MarginTrading, ShortSelling, Emerging}
margin_purchase_amount (int):   margin purchase amount
collateral (int):               collateral
short_sale_margin (int):        short sale margin
interest (int):                 interest

```

#### Common stock

In

```
api.list_positions(account=api.stock_account)

```

Out

```
[
    StockPosition(
        id=0,
        code='2890',
        direction=<Action.Buy: 'Buy'>,
        quantity=1,
        price=30.0,
        last_price=31.0,
        pnl=1000,
        yd_quantity=1,
        cond=<StockOrderCond.Cash: 'Cash'>,
        margin_purchase_amount=0,
        collateral=0,
        short_sale_margin=0,
        interest=0,
    ),
    StockPosition(
        id=1,
        code='2330',
        direction=<Action.Buy: 'Buy'>,
        quantity=1,
        price=2000.0,
        last_price=1980.0,
        pnl=-20000,
        yd_quantity=1,
        cond=<StockOrderCond.Cash: 'Cash'>,
        margin_purchase_amount=0,
        collateral=0,
        short_sale_margin=0,
        interest=0,
    ),
]

```

**Convert to DataFrame (polars example)**

In

```
import polars as pl
positions = api.list_positions(account=api.stock_account)
df = pl.DataFrame(p.dict() for p in positions)
df

```

Out

| id | code | direction | quantity | price | last_price | pnl | yd_quantity | cond | margin_purchase_amount | collateral | short_sale_margin | interest | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 2890 | Buy | 1 | 30.0 | 31.0 | 1000 | 1 | Cash | 0 | 0 | 0 | 0 | | 1 | 2330 | Buy | 1 | 2000.0 | 1980.0 | -20000 | 1 | Cash | 0 | 0 | 0 | 0 |

#### Odd lot

In

```
from shioaji import Unit
api.list_positions(account=api.stock_account, unit=Unit.Share)

```

Out

```
[
    StockPosition(
        id=0,
        code='2890',
        direction=<Action.Buy: 'Buy'>,
        quantity=1000,
        price=30.0,
        last_price=31.0,
        pnl=1000,
        yd_quantity=1000,
        cond=<StockOrderCond.Cash: 'Cash'>,
        margin_purchase_amount=0,
        collateral=0,
        short_sale_margin=0,
        interest=0,
    ),
    StockPosition(
        id=1,
        code='2330',
        direction=<Action.Buy: 'Buy'>,
        quantity=1000,
        price=2000.0,
        last_price=1980.0,
        pnl=-20000,
        yd_quantity=1000,
        cond=<StockOrderCond.Cash: 'Cash'>,
        margin_purchase_amount=0,
        collateral=0,
        short_sale_margin=0,
        interest=0,
    ),
]

```

**Common stock**

In

```
shioaji portfolio positions --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
[2]{id,code,direction,quantity,price,last_price,pnl,yd_quantity,cond,margin_purchase_amount,collateral,short_sale_margin,interest}:
  0,"2890",Buy,1,30.0,31.0,1000,1,Cash,0,0,0,0
  1,"2330",Buy,1,2000.0,1980.0,-20000,1,Cash,0,0,0,0

```

**Odd lot**

In

```
shioaji portfolio positions --unit share --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
[2]{id,code,direction,quantity,price,last_price,pnl,yd_quantity,cond,margin_purchase_amount,collateral,short_sale_margin,interest}:
  0,"2890",Buy,1000,30.0,31.0,1000,1000,Cash,0,0,0,0
  1,"2330",Buy,1000,2000.0,1980.0,-20000,1000,Cash,0,0,0,0

```

**Common stock**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/position_unit \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "id": 0,
    "code": "2890",
    "direction": "Buy",
    "quantity": 1,
    "price": 30.0,
    "last_price": 31.0,
    "pnl": 1000.0,
    "yd_quantity": 1,
    "cond": "Cash",
    "margin_purchase_amount": 0,
    "collateral": 0,
    "short_sale_margin": 0,
    "interest": 0
  },
  {
    "id": 1,
    "code": "2330",
    "direction": "Buy",
    "quantity": 1,
    "price": 2000.0,
    "last_price": 1980.0,
    "pnl": -20000.0,
    "yd_quantity": 1,
    "cond": "Cash",
    "margin_purchase_amount": 0,
    "collateral": 0,
    "short_sale_margin": 0,
    "interest": 0
  }
]

```

**Odd lot**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/position_unit \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "unit": "Share", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "id": 0,
    "code": "2890",
    "direction": "Buy",
    "quantity": 1000,
    "price": 30.0,
    "last_price": 31.0,
    "pnl": 1000.0,
    "yd_quantity": 1000,
    "cond": "Cash",
    "margin_purchase_amount": 0,
    "collateral": 0,
    "short_sale_margin": 0,
    "interest": 0
  },
  {
    "id": 1,
    "code": "2330",
    "direction": "Buy",
    "quantity": 1000,
    "price": 2000.0,
    "last_price": 1980.0,
    "pnl": -20000.0,
    "yd_quantity": 1000,
    "cond": "Cash",
    "margin_purchase_amount": 0,
    "collateral": 0,
    "short_sale_margin": 0,
    "interest": 0
  }
]

```

### Futures and Options

FuturePosition

```
id (int):           position ID
code (str):         symbol code
direction (Action): buy/sell {Buy, Sell}
quantity (int):     quantity
price (float):      average price
last_price (float): current price
pnl (float):        profit/loss

```

In

```
api.list_positions(account=api.futopt_account)

```

Out

```
[
    FuturePosition(
        id=0,
        code='TXO20260620200C',
        direction=<Action.Buy: 'Buy'>,
        quantity=3,
        price=131.0,
        last_price=126.0,
        pnl=-750.0,
    ),
]

```

In

```
shioaji portfolio positions --account-type F --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
[1]{id,code,direction,quantity,price,last_price,pnl}:
  0,"TXO20260620200C",Buy,3,131.0,126.0,-750.0

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/position_unit \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "id": 0,
    "code": "TXO20260620200C",
    "direction": "Buy",
    "quantity": 3,
    "price": 131.0,
    "last_price": 126.0,
    "pnl": -750.0
  }
]

```

## Unrealized Profit/Loss — Detail

`detail_id` is the `id` returned from [Unrealized Profit/Loss](#unrealized-profitloss); use it to query the detail of that position.

list_position_detail

```
api.list_position_detail?

Signature:
    api.list_position_detail(
        account: shioaji.account.Account = None,
        detail_id: int = 0,
        timeout: int = 5000,
        cb: Callable[[List[Union[shioaji.position.StockPositionDetail, shioaji.position.FuturePositionDetail]]], NoneType] = None,
    ) -> List[Union[shioaji.position.StockPositionDetail, shioaji.position.FuturePositionDetail]]

```

Parameters

```
account:   optional, stock or futures-options account (defaults to api.stock_account)
detail_id: optional, position ID (from list_positions result)
timeout:   timeout in milliseconds
cb:        optional, callback function, used when timeout=0

```

list_position_detail

```
$ shioaji portfolio position-detail --help

Get position detail by detail id

Usage: shioaji portfolio position-detail [OPTIONS] --detail-id <DETAIL_ID>

Options:
      --account-type <ACCOUNT_TYPE>  Account type: S (stock) or F (futures) [default: S]
      --account <ACCOUNT>            Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)
      --detail-id <DETAIL_ID>        Detail ID (the `id` field from `portfolio positions`)

```

Parameters

```
--account-type: optional, S (stock / default) or F (futures and options)
--account:      optional, BROKER_ID-ACCOUNT_ID format; defaults to the default account of that type
--detail-id:    position ID (from the portfolio positions result)

```

list_position_detail

```
POST /api/v1/portfolio/position_detail
Content-Type: application/json

{
  "account_type": "S",
  "detail_id": <int>,
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: optional, "S" (stock / default) or "F" (futures and options)
detail_id:    optional, position ID (from list_positions result)
broker_id:    optional, broker ID
account_id:   optional, account ID
person_id:    optional, personal ID

```

### Stock

StockPositionDetail

```
date (str):              trade date
code (str):              symbol code
quantity (int):          quantity
price (float):           cost
last_price (float):      current value
dseq (str):              order sequence
direction (Action):      buy/sell {Buy, Sell}
pnl (float):             profit/loss
currency (Currency):     {TWD, USD, HKD, EUR, CAD, BAS}
fee (float):             transaction fee
cond (StockOrderCond):   {Cash, Netting, MarginTrading, ShortSelling, Emerging}
ex_dividends (int):      ex-dividends amount
interest (int):          interest
margintrading_amt (int): margin purchase amount
collateral (int):        collateral

```

In

```
api.list_position_detail(account=api.stock_account, detail_id=0)

```

Out

```
[
    StockPositionDetail(
        date='2026-05-18',
        code='2890',
        quantity=1,
        price=30000,
        last_price=31000,
        dseq='Y1QDH',
        direction=<Action.Buy: 'Buy'>,
        pnl=1000,
        currency=<Currency.TWD: 'TWD'>,
        fee=100,
        cond=<StockOrderCond.Cash: 'Cash'>,
        ex_dividends=0,
        interest=0,
        margintrading_amt=0,
        collateral=0,
    ),
]

```

In

```
shioaji portfolio position-detail --account-type S --detail-id 0

```

Out

```
[1]{date,code,quantity,price,last_price,dseq,direction,pnl,currency,fee,cond,ex_dividends,interest,margintrading_amt,collateral}:
  "2026-05-18","2890",1,30000,31000,Y1QDH,Buy,1000,TWD,100,Cash,0,0,0,0

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/position_detail \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "detail_id": 0, "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "date": "2026-05-18",
    "code": "2890",
    "quantity": 1,
    "price": 30000.0,
    "last_price": 31000.0,
    "dseq": "Y1QDH",
    "direction": "Buy",
    "pnl": 1000.0,
    "currency": "TWD",
    "fee": 100.0,
    "cond": "Cash",
    "ex_dividends": 0,
    "interest": 0,
    "margintrading_amt": 0,
    "collateral": 0
  }
]

```

### Futures and Options

FuturePositionDetail

```
date (str):           trade date
code (str):           symbol code
quantity (int):       quantity
price (float):        average price
last_price (float):   current price
dseq (str):           order sequence
direction (Action):   buy/sell {Buy, Sell}
pnl (float):          profit/loss
currency (Currency):  {TWD, USD, HKD, EUR, CAD, BAS}
fee (float):          transaction fee
entry_quantity (int): entry quantity

```

In

```
api.list_position_detail(account=api.futopt_account, detail_id=0)

```

Out

```
[
    FuturePositionDetail(
        date='2026-05-21',
        code='TXO20260620200C',
        quantity=3,
        price=131.0,
        last_price=126.0,
        dseq='tA0n8',
        direction=<Action.Buy: 'Buy'>,
        pnl=-750.0,
        currency=<Currency.TWD: 'TWD'>,
        fee=120.0,
        entry_quantity=3,
    ),
]

```

In

```
shioaji portfolio position-detail --account-type F --detail-id 0

```

Out

```
[1]{date,code,quantity,price,last_price,dseq,direction,pnl,currency,fee,entry_quantity}:
  "2026-05-21","TXO20260620200C",3,131,126,tA0n8,Buy,-750,TWD,120,3

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/position_detail \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "detail_id": 0, "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "date": "2026-05-21",
    "code": "TXO20260620200C",
    "quantity": 3,
    "price": 131.0,
    "last_price": 126.0,
    "dseq": "tA0n8",
    "direction": "Buy",
    "pnl": -750.0,
    "currency": "TWD",
    "fee": 120.0,
    "entry_quantity": 3
  }
]

```
