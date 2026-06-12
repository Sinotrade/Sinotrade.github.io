用於查詢**證券／期貨選擇權帳戶**未實現損益，需要先[登入](../../login)。

## 未實現損益

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
account: 選填，證券或期貨選擇權帳戶（省略則使用 api.stock_account）
unit:    選填，Unit.Common（整股／預設）或 Unit.Share（零股）
timeout: 逾時毫秒
cb:      選填，callback 函式，timeout=0 時使用

```

list_positions

```
shioaji portfolio positions [--account-type S|F] [--unit common|share] [--account BROKER_ID-ACCOUNT_ID]

```

Parameters

```
--account-type: 選填，S（證券／預設）或 F（期貨選擇權）
--unit:         選填，common（整股／預設）或 share（零股）
--account:      選填，BROKER_ID-ACCOUNT_ID 格式，省略則使用預設帳戶

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
account_type: 選填，"S"（證券／預設）或 "F"（期貨選擇權）
unit:         選填，"Common"（整股／預設）或 "Share"（零股）
broker_id:    選填，券商代碼
account_id:   選填，帳戶代碼
person_id:    選填，身分證字號

```

### 證券

StockPosition

```
id (int):                       部位代碼
code (str):                     商品代碼
direction (Action):             買賣別 {Buy: 買, Sell: 賣}
quantity (int):                 數量
price (float):                  平均價格
last_price (float):             目前股價
pnl (float):                    損益
yd_quantity (int):              昨日庫存數量
cond (StockOrderCond):          {Cash: 現股, Netting: 餘額交割, MarginTrading: 融資, ShortSelling: 融券, Emerging: 興櫃}
margin_purchase_amount (int):   融資金額
collateral (int):               擔保品
short_sale_margin (int):        保證金
interest (int):                 利息

```

#### 整股

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

**轉成 DataFrame（以 polars 示範）**

In

```
import polars as pl
positions = api.list_positions(account=api.stock_account)
df = pl.DataFrame(p.dict() for p in positions)
df

```

Out

| id | code | direction | quantity | price | last_price | pnl | yd_quantity | cond | margin_purchase_amount | collateral | short_sale_margin | interest | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 2890 | Buy | 1 | 30.0 | 31.0 | 1000 | 1 | Cash | 0 | 0 | 0 | 0 | | 1 | 2330 | Buy | 1 | 2000.0 | 1980.0 | -20000 | 1 | Cash | 0 | 0 | 0 | 0 |

#### 零股

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

**整股**

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

**零股**

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

**整股**

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

**零股**

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

### 期貨選擇權

FuturePosition

```
id (int):           部位代碼
code (str):         商品代碼
direction (Action): 買賣別 {Buy: 買, Sell: 賣}
quantity (int):     數量
price (float):      平均價格
last_price (float): 目前價格
pnl (float):        損益

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

## 未實現損益 - 明細

`detail_id` 為[未實現損益](#%E6%9C%AA%E5%AF%A6%E7%8F%BE%E6%90%8D%E7%9B%8A)回傳結果中的 `id`，用於查詢該筆部位的明細。

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
account:   選填，證券或期貨選擇權帳戶（省略則使用 api.stock_account）
detail_id: 選填，部位 ID（從 list_positions 結果取得）
timeout:   逾時毫秒
cb:        選填，callback 函式，timeout=0 時使用

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
--account-type: 選填，S（證券，預設）或 F（期貨選擇權）
--account:      選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用該類型的預設帳號
--detail-id:    部位 ID（從 portfolio positions 結果取得）

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
account_type: 選填，"S"（證券／預設）或 "F"（期貨選擇權）
detail_id:    選填，部位 ID（從 list_positions 結果取得）
broker_id:    選填，券商代碼
account_id:   選填，帳戶代碼
person_id:    選填，身分證字號

```

### 證券

StockPositionDetail

```
date (str):              交易日期
code (str):              商品代碼
quantity (int):          數量
price (float):           付出成本
last_price (float):      現值
dseq (str):              委託書號
direction (Action):      買賣別 {Buy: 買, Sell: 賣}
pnl (float):             損益
currency (Currency):     幣別 {TWD, USD, HKD, EUR, CAD, BAS}
fee (float):             交易手續費
cond (StockOrderCond):   {Cash: 現股, Netting: 餘額交割, MarginTrading: 融資, ShortSelling: 融券, Emerging: 興櫃}
ex_dividends (int):      除息金額
interest (int):          利息
margintrading_amt (int): 融資金額
collateral (int):        擔保品

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

### 期貨選擇權

FuturePositionDetail

```
date (str):           交易日期
code (str):           商品代碼
quantity (int):       數量
price (float):        平均價格
last_price (float):   目前價格
dseq (str):           委託書號
direction (Action):   買賣別 {Buy: 買, Sell: 賣}
pnl (float):          損益
currency (Currency):  幣別 {TWD, USD, HKD, EUR, CAD, BAS}
fee (float):          交易手續費
entry_quantity (int): 新倉數量

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
