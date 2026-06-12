Query **stock / futures-options account** realized profit/loss. [Login](../../login) is required first.

## Realized Profit/Loss

list_profit_loss

```
api.list_profit_loss?

Signature:
    api.list_profit_loss(
        account: shioaji.account.Account = None,
        begin_date: str = '',
        end_date: str = '',
        unit: shioaji.Unit = <Unit.Common: 'Common'>,
        timeout: int = 5000,
        cb: Callable[[List[Union[shioaji.position.StockProfitLoss, shioaji.position.FutureProfitLoss]]], NoneType] = None,
    ) -> List[Union[shioaji.position.StockProfitLoss, shioaji.position.FutureProfitLoss]]

```

Parameters

```
account:    stock or futures-options account
begin_date: query begin date, format YYYY-MM-DD
end_date:   query end date, format YYYY-MM-DD
unit:       Unit.Common (default) or Unit.Share (odd lot)
timeout:    timeout in milliseconds
cb:         callback function, used when timeout=0

```

list_profit_loss

```
$ shioaji portfolio profit-loss --help

Get realized profit and loss

Usage: shioaji portfolio profit-loss [OPTIONS]

Options:
      --account-type <ACCOUNT_TYPE>  Account type: S (stock) or F (futures) [default: S]
      --account <ACCOUNT>            Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)
      --begin-date <BEGIN_DATE>      Begin date (YYYY-MM-DD, default: today) [default: 2026-06-12]
      --end-date <END_DATE>          End date (YYYY-MM-DD, default: today) [default: 2026-06-12]
      --unit <UNIT>                  Unit: common (default) or share [default: common] [possible values: common, share]

```

Parameters

```
--account-type: optional, S (stock / default) or F (futures and options)
--account:      optional, BROKER_ID-ACCOUNT_ID format; defaults to the default account of that type
--begin-date:   query begin date, format YYYY-MM-DD, defaults to today
--end-date:     query end date, format YYYY-MM-DD, defaults to today
--unit:         optional, common (default) or share (odd lot)

```

list_profit_loss

```
POST /api/v1/portfolio/profit_loss
Content-Type: application/json

{
  "account_type": "S",
  "begin_date": "2026-05-01",
  "end_date": "2026-05-31",
  "unit": "Common",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: "S" (stock / default) or "F" (futures and options)
begin_date:   query begin date, format YYYY-MM-DD
end_date:     query end date, format YYYY-MM-DD
unit:         "Common" (default) or "Share" (odd lot)
broker_id:    broker ID
account_id:   account ID
person_id:    personal ID

```

### Stock

StockProfitLoss

```
id (int):              position ID (use to query detail)
code (str):            symbol code
quantity (int):        quantity
pnl (float):           profit/loss
date (str):            trade date
dseq (str):            order sequence
price (float):         trade price
pr_ratio (float):      profit/loss ratio
cond (StockOrderCond): {Cash, Netting, MarginTrading, ShortSelling, Emerging}
seqno (str):           order serial number

```

In

```
api.list_profit_loss(api.stock_account, '2026-05-01', '2026-05-21')

```

Out

```
[
    StockProfitLoss(
        id=0,
        code='2890',
        quantity=1,
        pnl=1000,
        date='2026-05-05',
        dseq='Y0TR2',
        price=31,
        pr_ratio=0.0333,
        cond=<StockOrderCond.Cash: 'Cash'>,
        seqno='113382',
    ),
    StockProfitLoss(
        id=1,
        code='2330',
        quantity=1,
        pnl=-20000,
        date='2026-05-06',
        dseq='Y20K2',
        price=1980,
        pr_ratio=-0.01,
        cond=<StockOrderCond.Cash: 'Cash'>,
        seqno='184354',
    ),
]

```

**Convert to DataFrame (polars example)**

In

```
import polars as pl
profit_loss = api.list_profit_loss(api.stock_account, '2026-05-01', '2026-05-21')
df = pl.DataFrame(p.dict() for p in profit_loss)
df

```

Out

| id | code | quantity | pnl | date | dseq | price | pr_ratio | cond | seqno | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 2890 | 1 | 1000 | 2026-05-05 | Y0TR2 | 31 | 0.0333 | Cash | 113382 | | 1 | 2330 | 1 | -20000 | 2026-05-06 | Y20K2 | 1980 | -0.01 | Cash | 184354 |

In

```
shioaji portfolio profit-loss --account-type S --begin-date 2026-05-01 --end-date 2026-05-21

```

Out

```
[2]{id,code,quantity,pnl,date,dseq,price,pr_ratio,cond,seqno}:
  0,"2890",1,1000,"2026-05-05",Y0TR2,31,0.0333,Cash,"113382"
  1,"2330",1,-20000,"2026-05-06",Y20K2,1980,-0.01,Cash,"184354"

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/profit_loss \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "begin_date": "2026-05-01", "end_date": "2026-05-21", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "id": 0,
    "code": "2890",
    "quantity": 1,
    "pnl": 1000.0,
    "date": "2026-05-05",
    "dseq": "Y0TR2",
    "price": 31.0,
    "pr_ratio": 0.0333,
    "cond": "Cash",
    "seqno": "113382"
  },
  {
    "id": 1,
    "code": "2330",
    "quantity": 1,
    "pnl": -20000.0,
    "date": "2026-05-06",
    "dseq": "Y20K2",
    "price": 1980.0,
    "pr_ratio": -0.01,
    "cond": "Cash",
    "seqno": "184354"
  }
]

```

### Futures and Options

FutureProfitLoss

```
id (int):           position ID (use to query detail)
code (str):         symbol code
quantity (int):     quantity
pnl (float):        profit/loss
date (str):         trade date
entry_price (float): entry price
cover_price (float): cover price
tax (int):          transaction tax
fee (int):          transaction fee
direction (Action): buy/sell {Buy, Sell}

```

In

```
api.list_profit_loss(api.futopt_account, '2026-05-01', '2026-05-21')

```

Out

```
[
    FutureProfitLoss(
        id=0,
        code='TXO20260620200C',
        quantity=3,
        pnl=-750.0,
        date='2026-05-10',
        entry_price=131.0,
        cover_price=126.0,
        tax=5,
        fee=120,
        direction=<Action.Buy: 'Buy'>,
    ),
]

```

In

```
shioaji portfolio profit-loss --account-type F --begin-date 2026-05-01 --end-date 2026-05-21

```

Out

```
[1]{id,code,quantity,pnl,date,entry_price,cover_price,tax,fee,direction}:
  0,"TXO20260620200C",3,-750,"2026-05-10",131,126,5,120,Buy

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/profit_loss \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "begin_date": "2026-05-01", "end_date": "2026-05-21", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "id": 0,
    "code": "TXO20260620200C",
    "quantity": 3,
    "pnl": -750.0,
    "date": "2026-05-10",
    "entry_price": 131.0,
    "cover_price": 126.0,
    "tax": 5,
    "fee": 120,
    "direction": "Buy"
  }
]

```

## Realized Profit/Loss — Detail

`detail_id` is the `id` returned from [Realized Profit/Loss](#realized-profitloss); use it to query the detail of that position.

list_profit_loss_detail

```
api.list_profit_loss_detail?

Signature:
    api.list_profit_loss_detail(
        account: shioaji.account.Account = None,
        detail_id: int = 0,
        unit: shioaji.Unit = <Unit.Common: 'Common'>,
        timeout: int = 5000,
        cb: Callable[[List[Union[shioaji.position.StockProfitDetail, shioaji.position.FutureProfitDetail]]], NoneType] = None,
    ) -> List[Union[shioaji.position.StockProfitDetail, shioaji.position.FutureProfitDetail]]

```

Parameters

```
account:   stock or futures-options account
detail_id: position ID (from list_profit_loss result)
unit:      Unit.Common (default) or Unit.Share (odd lot)
timeout:   timeout in milliseconds
cb:        callback function, used when timeout=0

```

list_profit_loss_detail

```
$ shioaji portfolio profit-loss-detail --help

Get realized profit and loss detail by detail id

Usage: shioaji portfolio profit-loss-detail [OPTIONS] --detail-id <DETAIL_ID>

Options:
      --account-type <ACCOUNT_TYPE>  Account type: S (stock) or F (futures) [default: S]
      --account <ACCOUNT>            Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)
      --detail-id <DETAIL_ID>        Detail ID (the `id` field from `portfolio profit-loss`)
      --unit <UNIT>                  Unit: common (default) or share [default: common] [possible values: common, share]

```

Parameters

```
--account-type: optional, S (stock / default) or F (futures and options)
--account:      optional, BROKER_ID-ACCOUNT_ID format; defaults to the default account of that type
--detail-id:    position ID (from the portfolio profit-loss result)
--unit:         optional, common (default) or share (odd lot)

```

list_profit_loss_detail

```
POST /api/v1/portfolio/profit_loss_detail
Content-Type: application/json

{
  "account_type": "S",
  "detail_id": <int>,
  "unit": "Common",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: "S" (stock / default) or "F" (futures and options)
detail_id:    position ID (from list_profit_loss result)
unit:         "Common" (default) or "Share" (odd lot)
broker_id:    broker ID
account_id:   account ID
person_id:    personal ID

```

### Stock

StockProfitDetail

```
date (str):                  trade date
code (str):                  symbol code
quantity (int):              quantity
dseq (str):                  order sequence
fee (int):                   transaction fee
tax (int):                   transaction tax
currency (str):              currency {TWD, USD, HKD, EUR, CAD, BAS}
price (float):               trade price
cost (int):                  cost
rep_margintrading_amt (int): repaid margin amount
rep_collateral (int):        repaid collateral
rep_margin (int):            repaid margin
shortselling_fee (int):      short selling fee
ex_dividend_amt (int):       ex-dividends amount
interest (int):              interest
trade_type (TradeType):      {Common, DayTrade}
cond (StockOrderCond):       {Cash, Netting, MarginTrading, ShortSelling, Emerging}

```

In

```
api.list_profit_loss_detail(api.stock_account, detail_id=0)

```

Out

```
[
    StockProfitDetail(
        date='2026-04-23',
        code='2890',
        quantity=1,
        dseq='Y0O7E',
        fee=119,
        tax=0,
        currency='TWD',
        price=30.0,
        cost=30119,
        rep_margintrading_amt=0,
        rep_collateral=0,
        rep_margin=0,
        shortselling_fee=0,
        ex_dividend_amt=0,
        interest=0,
        trade_type=<TradeType.Common: 'Common'>,
        cond=<StockOrderCond.Cash: 'Cash'>,
    ),
]

```

In

```
shioaji portfolio profit-loss-detail --account-type S --detail-id 0

```

Out

```
[1]{date,code,quantity,dseq,fee,tax,currency,price,cost,rep_margintrading_amt,rep_collateral,rep_margin,shortselling_fee,ex_dividend_amt,interest,trade_type,cond}:
  "2026-04-23","2890",1,Y0O7E,119,0,TWD,30,30119,0,0,0,0,0,0,Common,Cash

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/profit_loss_detail \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "detail_id": 0, "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "date": "2026-04-23",
    "code": "2890",
    "quantity": 1.0,
    "dseq": "Y0O7E",
    "fee": 119,
    "tax": 0,
    "currency": "TWD",
    "price": 30.0,
    "cost": 30119,
    "rep_margintrading_amt": 0,
    "rep_collateral": 0,
    "rep_margin": 0,
    "shortselling_fee": 0,
    "ex_dividend_amt": 0,
    "interest": 0,
    "trade_type": "Common",
    "cond": "Cash"
  }
]

```

### Futures and Options

FutureProfitDetail

```
date (str):           trade date
code (str):           symbol code
quantity (int):       quantity
dseq (str):           order sequence
fee (float):          transaction fee
tax (float):          transaction tax
currency (str):       currency {TWD, USD, HKD, EUR, CAD, BAS}
direction (Action):   buy/sell {Buy, Sell}
entry_date (str):     entry date
entry_quantity (int): entry quantity
entry_seqno (str):    entry order serial number
entry_price (float):  entry price
cover_price (float):  cover price
pnl (int):            profit/loss

```

In

```
api.list_profit_loss_detail(api.futopt_account, detail_id=0)

```

Out

```
[
    FutureProfitDetail(
        date='2026-05-10',
        code='TXO20260620200C',
        quantity=3,
        dseq='tA0n8',
        fee=120.0,
        tax=5.0,
        currency='TWD',
        direction=<Action.Buy: 'Buy'>,
        entry_date='2026-05-08',
        entry_quantity=3,
        entry_seqno='113382',
        entry_price=131.0,
        cover_price=126.0,
        pnl=-750,
    ),
]

```

In

```
shioaji portfolio profit-loss-detail --account-type F --detail-id 0

```

Out

```
[1]{date,code,quantity,dseq,fee,tax,currency,direction,entry_date,entry_quantity,entry_seqno,entry_price,cover_price,pnl}:
  "2026-05-10","TXO20260620200C",3,tA0n8,120,5,TWD,Buy,"2026-05-08",3,"113382",131,126,-750

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/profit_loss_detail \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "detail_id": 0, "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
[
  {
    "date": "2026-05-10",
    "code": "TXO20260620200C",
    "quantity": 3,
    "dseq": "tA0n8",
    "fee": 120.0,
    "tax": 5.0,
    "currency": "TWD",
    "direction": "Buy",
    "entry_date": "2026-05-08",
    "entry_quantity": 3,
    "entry_seqno": "113382",
    "entry_price": 131.0,
    "cover_price": 126.0,
    "pnl": -750
  }
]

```

## Realized Profit/Loss — Summary

Query the realized profit/loss summary over a period. The returned `ProfitLossSummaryTotal` contains a per-symbol list `profitloss_summary` and a `total` aggregate.

list_profit_loss_summary

```
api.list_profit_loss_summary?

Signature:
    api.list_profit_loss_summary(
        account: shioaji.account.Account = None,
        begin_date: str = '',
        end_date: str = '',
        timeout: int = 5000,
        cb: Callable[[ProfitLossSummaryTotal], NoneType] = None,
    ) -> ProfitLossSummaryTotal

```

Parameters

```
account:    stock or futures-options account
begin_date: query begin date, format YYYY-MM-DD
end_date:   query end date, format YYYY-MM-DD
timeout:    timeout in milliseconds
cb:         callback function, used when timeout=0

```

list_profit_loss_summary

```
$ shioaji portfolio profit-loss-summary --help

Get profit and loss summary

Usage: shioaji portfolio profit-loss-summary [OPTIONS]

Options:
      --account-type <ACCOUNT_TYPE>  Account type: S (stock) or F (futures) [default: S]
      --account <ACCOUNT>            Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)
      --begin-date <BEGIN_DATE>      Begin date (YYYY-MM-DD, default: today) [default: 2026-06-12]
      --end-date <END_DATE>          End date (YYYY-MM-DD, default: today) [default: 2026-06-12]

```

Parameters

```
--account-type: optional, S (stock / default) or F (futures and options)
--account:      optional, BROKER_ID-ACCOUNT_ID format; defaults to the default account of that type
--begin-date:   query begin date, format YYYY-MM-DD, defaults to today
--end-date:     query end date, format YYYY-MM-DD, defaults to today

```

list_profit_loss_summary

```
POST /api/v1/portfolio/profitloss_sum
Content-Type: application/json

{
  "account_type": "S",
  "begin_date": "2026-05-01",
  "end_date": "2026-05-31",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: "S" (stock / default) or "F" (futures and options)
begin_date:   query begin date, format YYYY-MM-DD
end_date:     query end date, format YYYY-MM-DD
broker_id:    broker ID
account_id:   account ID
person_id:    personal ID

```

### Stock

StockProfitLossSummary

```
code (str):            symbol code
quantity (int):        quantity
entry_price (float):   entry price
cover_price (float):   cover price
pnl (float):           profit/loss
currency (str):        currency
entry_cost (int):      entry cost (excluding fees and taxes)
cover_cost (int):      cover cost (excluding fees and taxes)
buy_cost (int):        buy cost
sell_cost (int):       sell proceeds
pr_ratio (float):      profit/loss ratio
cond (StockOrderCond): {Cash, Netting, MarginTrading, ShortSelling, Emerging}

```

ProfitLossTotal

```
entry_amount (float): total entry amount
cover_amount (float): total cover amount
quantity (int):       total quantity
buy_cost (float):     total buy cost
sell_cost (float):    total sell proceeds
pnl (float):          total profit/loss
pr_ratio (float):     total profit/loss ratio

```

In

```
resp = api.list_profit_loss_summary(api.stock_account, '2026-05-01', '2026-05-21')
resp

```

Out

```
ProfitLossSummaryTotal(total=ProfitLossTotal(pnl=2781, pr_ratio=0.29))

```

**View per-symbol profit/loss details**

In

```
dict(resp)

```

Out

```
{
    'profitloss_summary': [
        StockProfitLossSummary(
            code='3265',
            quantity=1000,
            entry_price=181.5,
            cover_price=172.5,
            pnl=-9657,
            currency='NTD',
            entry_cost=181500,
            cover_cost=172500,
            buy_cost=181572,
            sell_cost=171915,
            pr_ratio=-5.32,
            cond=<StockOrderCond.Cash: 'Cash'>
        ),
        StockProfitLossSummary(
            code='8261',
            quantity=1000,
            entry_price=122,
            cover_price=132,
            pnl=9504,
            currency='NTD',
            entry_cost=122000,
            cover_cost=132000,
            buy_cost=122048,
            sell_cost=131552,
            pr_ratio=7.79,
            cond=<StockOrderCond.Cash: 'Cash'>
        ),
        ...
    ],
    'total': ProfitLossTotal(
        entry_amount=0,
        cover_amount=0,
        quantity=5000,
        buy_cost=975387,
        sell_cost=978168,
        pnl=2781,
        pr_ratio=0.29
    ),
    'status': <FetchStatus.Fetched: 'Fetched'>
}

```

In

```
shioaji portfolio profit-loss-summary --account-type S --begin-date 2026-05-01 --end-date 2026-05-21

```

Out

```
profitloss_sum[2]{code,quantity,entry_price,cover_price,pnl,currency,entry_cost,cover_cost,buy_cost,sell_cost,pr_ratio,cond}:
  "2890",1000,30,31,1000,NTD,30000,31000,30119,30881,3.33,Cash
  "2330",1000,2000,1980,-20000,NTD,2000000,1980000,2000119,1979881,-1,Cash
total:
  entry_amount: 0
  cover_amount: 0
  quantity: 2000
  buy_cost: 2030238
  sell_cost: 2010762
  pnl: -19000
  pr_ratio: -0.94

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/profitloss_sum \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "begin_date": "2026-05-01", "end_date": "2026-05-21", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
{
  "profitloss_sum": [
    {
      "code": "2890",
      "quantity": 1000,
      "entry_price": 30.0,
      "cover_price": 31.0,
      "pnl": 1000.0,
      "currency": "NTD",
      "entry_cost": 30000,
      "cover_cost": 31000,
      "buy_cost": 30119,
      "sell_cost": 30881,
      "pr_ratio": 3.33,
      "cond": "Cash"
    },
    {
      "code": "2330",
      "quantity": 1000,
      "entry_price": 2000.0,
      "cover_price": 1980.0,
      "pnl": -20000.0,
      "currency": "NTD",
      "entry_cost": 2000000,
      "cover_cost": 1980000,
      "buy_cost": 2000119,
      "sell_cost": 1979881,
      "pr_ratio": -1.00,
      "cond": "Cash"
    }
  ],
  "total": {
    "entry_amount": 0.0,
    "cover_amount": 0.0,
    "quantity": 2000,
    "buy_cost": 2030238.0,
    "sell_cost": 2010762.0,
    "pnl": -19000.0,
    "pr_ratio": -0.94
  }
}

```

### Futures and Options

FutureProfitLossSummary

```
code (str):          symbol code
quantity (int):      quantity
entry_price (float): entry price
cover_price (float): cover price
pnl (float):         profit/loss
currency (str):      currency
direction (Action):  buy/sell {Buy, Sell}
tax (int):           transaction tax
fee (int):           transaction fee

```

ProfitLossTotal

```
entry_amount (float): total entry amount
cover_amount (float): total cover amount
quantity (int):       total quantity
buy_cost (float):     total buy cost
sell_cost (float):    total sell proceeds
pnl (float):          total profit/loss
pr_ratio (float):     total profit/loss ratio

```

In

```
api.list_profit_loss_summary(api.futopt_account, '2026-05-01', '2026-05-21')

```

Out

```
ProfitLossSummaryTotal(total=ProfitLossTotal(pnl=-750, pr_ratio=-3.79))

```

In

```
shioaji portfolio profit-loss-summary --account-type F --begin-date 2026-05-01 --end-date 2026-05-21

```

Out

```
profitloss_sum[1]{code,quantity,entry_price,cover_price,pnl,currency,direction,tax,fee}:
  "TXO20260620200C",3,131,126,-750,NTD,Buy,5,120
total:
  entry_amount: 19650
  cover_amount: 18900
  quantity: 3
  buy_cost: 19775
  sell_cost: 18775
  pnl: -750
  pr_ratio: -3.79

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/profitloss_sum \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "begin_date": "2026-05-01", "end_date": "2026-05-21", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
{
  "profitloss_sum": [
    {
      "code": "TXO20260620200C",
      "quantity": 3,
      "entry_price": 131.0,
      "cover_price": 126.0,
      "pnl": -750.0,
      "currency": "NTD",
      "direction": "Buy",
      "tax": 5,
      "fee": 120
    }
  ],
  "total": {
    "entry_amount": 19650.0,
    "cover_amount": 18900.0,
    "quantity": 3,
    "buy_cost": 19775.0,
    "sell_cost": 18775.0,
    "pnl": -750.0,
    "pr_ratio": -3.79
  }
}

```
