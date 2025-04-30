需要先[登錄](../../login)。

## 已實現損益

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

帶入想查詢的時間區間。`begin_date`為起始時間，`end_date`為結束時間。`unit`為數量單位，`Common`為整股，`Share`為零股。

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

轉成DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in profitloss)
df

```

Out

| id | code | cond | date | pnl | pr_ratio | price | quantity | seqno | dseq | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 2890 | StockOrderCond.Cash | 2020-05-22 | 1000.0 | 0.1237 | 10.1 | 1 | 14816 | ID111 |

StockProfitLoss

```
id (int): 可利用此id查詢明細
code (str): 商品代碼
seqno (str): seqno no.
dseq (str): seqno no.
quantity (int): 數量
price (float): 價格
pnl (float): 損益
pr_ratio (float): 損益比
cond (StockOrderCond): {
                Cash: 現股(預設值), 
                Netting: 餘額交割,
                MarginTrading: 融資, 
                ShortSelling: 融券, 
                Emerging: 興櫃
            }
date (str): 交易日期

```

FutureProfitLoss

```
id (int): 可利用此id查詢明細
code (str): 商品代碼
quantity (int): 數量
pnl (float): 損益
date (str): 交易日期
entry_price (int): 進倉價格
cover_price (int): 平倉價格
tax (int): 交易稅
fee (int): 交易手續費

```

## 已實現損益 - 明細

可從針對`list_profit_loss`得到的結果，將`id`帶入`detail_id`查詢該筆明細。`unit`為數量單位，`Common`為整股，`Share`為零股。

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

轉成DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in profitloss_detail)
df

```

Out

| date | code | quantity | dseq | fee | tax | currency | price | cost | rep_margintrading_amt | rep_collateral | rep_margin | shortselling_fee | ex_dividend_amt | interest | trade_type | cond | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2020-01-01 | 2890 | 1 | IX000 | 20 | 0 | TWD | 10.8 | 10820 | 0 | 0 | 0 | 0 | 0 | 0 | Common | Cash |

StockProfitDetail

```
date (str): 交易日期
code (str): 商品代碼
quantity (int): 數量
dseq (str): 委託書號
fee (int): 交易手續費
tax (int): 交易稅
currency (str): 幣別 {NTD, USD, HKD, EUR, CAD, BAS}
price (float): 成交單價
cost (int): 付出成本
rep_margintrading_amt (int): 償還融資金額
rep_collateral (int): 償還擔保品
rep_margin (int): 償還保證金
shortselling_fee (int): 融券手續費
ex_dividend_amt: 除息金額
interest (int): 利息
trade_type (TradeType): {Common, DayTrade}
cond (StockOrderCond): {
                Cash: 現股(預設值), 
                Netting: 餘額交割,
                MarginTrading: 融資, 
                ShortSelling: 融券, 
                Emerging: 興櫃
            }

```

FutureProfitDetail

```
date (str): 交易日期
code (str): 商品代碼
quantity (int): 數量
dseq (str): 委託書號
fee (int): 交易手續費
tax (int): 交易稅
currency (str): 幣別 {NTD, USD, HKD, EUR, CAD, BAS}
direction (Action): 買賣別 {Buy, Sell}
entry_price (int): 進倉價格
cover_price (int): 平倉價格
pnl (int): 損益

```

## 已實現損益 - 彙總

用於查詢一段時間內的損益彙總。

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

帶入想查詢的時間區間。`begin_date`為起始時間，`end_date`為結束時間。

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

轉成DataFrame

In

```
df = pd.DataFrame(pnl.__dict__ for pnl in profitloss_summary.profitloss_summary) 
df

```

Out

| code | quantity | entry_price | cover_price | pnl | currency | entry_cost | cover_cost | buy_cost | sell_cost | pr_ratio | cond | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2890 | 2000 | 17 | 10 | -11585 | NTD | 34550 | 21600 | 33112 | 21527 | -34.99 | Cash |

StockProfitLossSummary

```
code (str): 商品代碼
quantity (int): 數量
entry_price (int): 進倉價格
cover_price (int): 平倉價格
pnl (float): 損益
currency (str): 幣別
entry_cost (int): 進倉金額(不含手續費及交易稅)
cover_cost (int): 平倉金額(不含手續費及交易稅)
buy_cost (int): 付出成本
sell_cost (int): 賣出收入
pr_ratio (float): 損益比
cond (StockOrderCond): {
                Cash: 現股(預設值), 
                Netting: 餘額交割,
                MarginTrading: 融資, 
                ShortSelling: 融券, 
                Emerging: 興櫃
            }

```

FutureProfitLossSummary

```
code (str): 商品代碼
quantity (int): 數量
entry_price (int): 進倉價格
cover_price (int): 平倉價格
pnl (float): 損益
currency (str): 幣別
direction (Action): 買賣別 {Buy, Sell}
tax (int): 交易稅
fee (int): 交易手續費

```
