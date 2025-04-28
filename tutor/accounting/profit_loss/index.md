You need to [login](../../login) first.

## Profit Loss

The feature of list_profit_loss is used to query realized profit loss of account.

In

```
api.list_profit_loss?

```

Out

```
Signature:
    api.list_profit_loss(
        account: shioaji.account.Account = None,
        begin_date: str = '',
        end_date: str = '',
        unit: shioaji.constant.Unit = <Unit.Common: 'Common'>,
        timeout: int = 5000,
        cb: Callable[[List[shioaji.position.ProfitLoss]], NoneType] = None,
    ) -> List[shioaji.position.ProfitLoss]
Docstring:
    query account of profit loss

    Args:
        account (:obj:Account): 
            choice the account from listing account (Default: stock account)
        begin_date (str): the start date of query profit loss (Default: today)
        end_date (str): the end date of query profit loss (Default: today)

```

Enter the time interval you want to query. `begin_date` is the start time, and `end_date` is the end time. `unit` is the quantity unit, where `Common` represents whole shares and `Share` represents fractional shares.

In

```
profitloss = api.list_profit_loss(api.stock_account,'2020-05-05','2020-05-30')
profitloss

```

Out

```
[
    StockProfitLoss(
        id=0, 
        code='2890', 
        seqno='14816', 
        dseq='ID111', 
        quantity=1, 
        price=10.1, 
        pnl=1234.0, 
        pr_ratio=0.1237, 
        cond='Cash', 
        date='2020-05-22'
    )
]

```

To DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in profitloss)
df

```

Out

| id | code | cond | date | pnl | pr_ratio | price | quantity | seqno | dseq | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 2890 | StockOrderCond.Cash | 2020-05-22 | 1000.0 | 0.1237 | 10.1 | 1 | 14816 | ID111 |

StockProfitLoss

```
id (int): use to find detail
code (str): contract id
seqno (str): seqno no
dseq (str): seqno no
quantity (int): quantity
price (float): price
pnl (float): profit and loss
pr_ratio (float): profit rate
cond (StockOrderCond): {Cash, Netting, MarginTrading, ShortSelling}
date (str): trade date

```

FutureProfitLoss

```
id (int): use to find detail
code (str): contract id
quantity (int): quantity
pnl (float): profit and loss
date (str): trade date
entry_price (int): entry price
cover_price (int): cover price
tax (int): tax
fee (int): transaction fee

```

## Profit Loss Detail

The feature of list_profit_loss_detail is used to query profit loss detail of account. `unit` is the quantity unit, where `Common` represents whole shares and `Share` represents fractional shares.

In

```
api.list_profit_loss_detail?

```

Out

```
Signature:
api.list_profit_loss_detail(
    account: shioaji.account.Account = None,
    detail_id: int = 0,
    unit: shioaji.constant.Unit = <Unit.Common: 'Common'>,
    timeout: int = 5000,
    cb: Callable[[List[Union[shioaji.position.StockProfitDetail, shioaji.position.FutureProfitDetail]]], NoneType] = None,
) -> List[Union[shioaji.position.StockProfitDetail, shioaji.position.FutureProfitDetail]]
Docstring:
query account of profit loss detail

Args:
    account (:obj:Account):
        choice the account from listing account (Default: stock account)
    detail_id (int): the id is from ProfitLoss object, ProfitLoss is from list_profit_loss

```

In

```
profitloss_detail = api.list_profit_loss_detail(api.stock_account, 2)
profitloss_detail

```

Out

```
[
    StockProfitDetail(
        date='2020-01-01', 
        code='2890', 
        quantity=1, 
        dseq='IX000', 
        fee=20, 
        tax=0, 
        currency='TWD', 
        price=10.8, 
        cost=10820, 
        rep_margintrading_amt=0, 
        rep_collateral=0, 
        rep_margin=0, 
        shortselling_fee=0, 
        ex_dividend_amt=0, 
        interest=0
    )
]

```

To DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in profitloss_detail)
df

```

Out

| date | code | quantity | dseq | fee | tax | currency | price | cost | rep_margintrading_amt | rep_collateral | rep_margin | shortselling_fee | ex_dividend_amt | interest | trade_type | cond | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2020-01-01 | 2890 | 1 | IX000 | 20 | 0 | TWD | 10.8 | 10820 | 0 | 0 | 0 | 0 | 0 | 0 | Common | Cash |

StockProfitDetail

```
date (str): trade date
code (str): contract id
quantity (int): quantity
dseq (str): detail seqno no
fee (int): fee
tax (int): trading tax
currency (str): {NTD, USD, HKD, EUR, CAD, BAS}
price (float): price
cost (int): cost of price
rep_margintrading_amt (int): repay amount of margin trading
rep_collateral (int): repay collateral
rep_margin (int): repay margin
shortselling_fee (int): fee of short selling
ex_dividend_amt: ex-dividend amount
interest (int): interest
trade_type (TradeType): {Common, DayTrade}
cond (StockOrderCond): {Cash, Netting, MarginTrading, ShortSelling}

```

FutureProfitDetail

```
date (str): trade date
code (str): contract id
quantity (int): quantity
dseq (str): detail seqno no
fee (int): fee
tax (int): trading tax
currency (str): {NTD, USD, HKD, EUR, CAD, BAS}
direction (Action): {Buy, Sell}
entry_price (int): entry price
cover_price (int): cover price
pnl (int): profit and loss

```

## Profit Loss Summary

The feature of list_profit_loss_summary is used to query summary of profit loss for a period of time.

In

```
api.list_profit_loss_summary?

```

Out

```
Signature:
api.list_profit_loss_summary(
    account: shioaji.account.Account = None,
    begin_date: str = '',
    end_date: str = '',
    timeout: int = 5000,
    cb: Callable[[ProfitLossSummaryTotal], NoneType] = None,
) -> ProfitLossSummaryTotal
Docstring:
query summary profit loss of a period time

Args:
    account (:obj:Account):
        choice the account from listing account (Default: stock account)
    begin_date (str): the start date of query profit loss (Default: today)
    end_date (str): the end date of query profit loss (Default: today)

```

Enter the time interval you want to query. `begin_date` is the start time, and `end_date` is the end time.

In

```
profitloss_summary = api.list_profit_loss_summary(api.stock_account,'2020-05-05','2020-05-30')
profitloss_summary

```

Out

```
ProfitLossSummaryTotal(
    status=<FetchStatus.Fetched: 'Fetched'>, 
    profitloss_summary=[
        StockProfitLossSummary(
            code='2890', 
            quantity=2000, 
            entry_price=17, 
            cover_price=10, 
            pnl=-11585.0, 
            currency='NTD', 
            entry_cost=34550, 
            cover_cost=21600, 
            buy_cost=33112, 
            sell_cost=21527, 
            pr_ratio=-34.99
        )
    ], 
    total=ProfitLossTotal(
        quantity=2000, 
        buy_cost=33112, 
        sell_cost=21527, 
        pnl=-11585.0, 
        pr_ratio=-34.99
    )
)

```

To DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in profitloss_summary.profitloss_summary) 
df

```

Out

| code | quantity | entry_price | cover_price | pnl | currency | entry_cost | cover_cost | buy_cost | sell_cost | pr_ratio | cond | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2890 | 2000 | 17 | 10 | -11585 | NTD | 34550 | 21600 | 33112 | 21527 | -34.99 | Cash |

StockProfitLossSummary

```
code (str): contract id
quantity (int): quantity
entry_price (int): price of entry
cover_price (int): price of cover
pnl (float): profit and loss
currency (str): currency
entry_cost (int): cost of entry
cover_cost (int): cost of cover
buy_cost (int): cost of buy
sell_cost (int): cost of sell
pr_ratio (float): profit rate
cond (StockOrderCond): {Cash, Netting, MarginTrading, ShortSelling}

```

FutureProfitLossSummary

```
code (str): contract id
quantity (int): quantity
entry_price (int): price of entry
cover_price (int): price of cover
pnl (float): profit and loss
currency (str): currency
direction (Action): {Buy, Sell}
tax (int): tax
fee (int): fee

```
