用於查詢**證券／期貨選擇權帳戶**已實現損益，需要先[登入](../../login)。

## 已實現損益

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
account:    證券或期貨選擇權帳戶
begin_date: 查詢起始日期，格式 YYYY-MM-DD
end_date:   查詢結束日期，格式 YYYY-MM-DD
unit:       Unit.Common（整股／預設）或 Unit.Share（零股）
timeout:    逾時毫秒
cb:         callback 函式，timeout=0 時使用

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
account_type: "S"（證券／預設）或 "F"（期貨選擇權）
begin_date:   查詢起始日期，格式 YYYY-MM-DD
end_date:     查詢結束日期，格式 YYYY-MM-DD
unit:         "Common"（整股／預設）或 "Share"（零股）
broker_id:    券商代碼
account_id:   帳戶代碼
person_id:    身分證字號

```

### 證券

StockProfitLoss

```
id (int):              部位代碼（可用於查詢明細）
code (str):            商品代碼
quantity (int):        數量
pnl (float):           損益
date (str):            交易日期
dseq (str):            委託書號
price (float):         成交價格
pr_ratio (float):      損益比
cond (StockOrderCond): {Cash: 現股, Netting: 餘額交割, MarginTrading: 融資, ShortSelling: 融券, Emerging: 興櫃}
seqno (str):           委託序號

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

**轉成 DataFrame（以 polars 示範）**

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

### 期貨選擇權

FutureProfitLoss

```
id (int):           部位代碼（可用於查詢明細）
code (str):         商品代碼
quantity (int):     數量
pnl (float):        損益
date (str):         交易日期
entry_price (float): 進倉價格
cover_price (float): 平倉價格
tax (int):          交易稅
fee (int):          交易手續費
direction (Action): 買賣別 {Buy: 買, Sell: 賣}

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

## 已實現損益 - 明細

`detail_id` 為[已實現損益](#%E5%B7%B2%E5%AF%A6%E7%8F%BE%E6%90%8D%E7%9B%8A)回傳結果中的 `id`，用於查詢該筆損益的明細。

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
account:   證券或期貨選擇權帳戶
detail_id: 部位 ID（從 list_profit_loss 結果取得）
unit:      Unit.Common（整股／預設）或 Unit.Share（零股）
timeout:   逾時毫秒
cb:        callback 函式，timeout=0 時使用

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
account_type: "S"（證券／預設）或 "F"（期貨選擇權）
detail_id:    部位 ID（從 list_profit_loss 結果取得）
unit:         "Common"（整股／預設）或 "Share"（零股）
broker_id:    券商代碼
account_id:   帳戶代碼
person_id:    身分證字號

```

### 證券

StockProfitDetail

```
date (str):                  交易日期
code (str):                  商品代碼
quantity (float):            數量
dseq (str):                  委託書號
fee (int):                   交易手續費
tax (int):                   交易稅
currency (str):              幣別 {TWD, USD, HKD, EUR, CAD, BAS}
price (float):               成交單價
cost (int):                  付出成本
rep_margintrading_amt (int): 償還融資金額
rep_collateral (int):        償還擔保品
rep_margin (int):            償還保證金
shortselling_fee (int):      融券手續費
ex_dividend_amt (int):       除息金額
interest (int):              利息
trade_type (TradeType):      {Common, DayTrade}
cond (StockOrderCond):       {Cash: 現股, Netting: 餘額交割, MarginTrading: 融資, ShortSelling: 融券, Emerging: 興櫃}

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

### 期貨選擇權

FutureProfitDetail

```
date (str):           交易日期
code (str):           商品代碼
quantity (int):       數量
dseq (str):           委託書號
fee (float):          交易手續費
tax (float):          交易稅
currency (str):       幣別 {TWD, USD, HKD, EUR, CAD, BAS}
direction (Action):   買賣別 {Buy: 買, Sell: 賣}
entry_date (str):     進倉日期
entry_quantity (int): 進倉數量
entry_seqno (str):    進倉委託序號
entry_price (float):  進倉價格
cover_price (float):  平倉價格
pnl (int):            損益

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

## 已實現損益 - 彙總

用於查詢一段時間內的已實現損益彙總；回傳物件 `ProfitLossSummaryTotal` 包含每檔商品的明細列表 `profitloss_summary` 與總計 `total`。

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
account:    證券或期貨選擇權帳戶
begin_date: 查詢起始日期，格式 YYYY-MM-DD
end_date:   查詢結束日期，格式 YYYY-MM-DD
timeout:    逾時毫秒
cb:         callback 函式，timeout=0 時使用

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
account_type: "S"（證券／預設）或 "F"（期貨選擇權）
begin_date:   查詢起始日期，格式 YYYY-MM-DD
end_date:     查詢結束日期，格式 YYYY-MM-DD
broker_id:    券商代碼
account_id:   帳戶代碼
person_id:    身分證字號

```

### 證券

StockProfitLossSummary

```
code (str):            商品代碼
quantity (int):        數量
entry_price (float):   進倉價格
cover_price (float):   平倉價格
pnl (float):           損益
currency (str):        幣別
entry_cost (int):      進倉金額（不含手續費及交易稅）
cover_cost (int):      平倉金額（不含手續費及交易稅）
buy_cost (int):        付出成本
sell_cost (int):       賣出收入
pr_ratio (float):      損益比
cond (StockOrderCond): {Cash: 現股, Netting: 餘額交割, MarginTrading: 融資, ShortSelling: 融券, Emerging: 興櫃}

```

ProfitLossTotal

```
entry_amount (float): 進倉總金額
cover_amount (float): 平倉總金額
quantity (int):       總數量
buy_cost (float):     付出總成本
sell_cost (float):    賣出總收入
pnl (float):          總損益
pr_ratio (float):     總損益比

```

In

```
api.list_profit_loss_summary(api.stock_account, '2026-05-01', '2026-05-21')

```

Out

```
ProfitLossSummaryTotal(
    profitloss_summary=[
        StockProfitLossSummary(
            code='2890',
            quantity=1000,
            entry_price=30,
            cover_price=31,
            pnl=1000,
            currency='NTD',
            entry_cost=30000,
            cover_cost=31000,
            buy_cost=30119,
            sell_cost=30881,
            pr_ratio=3.33,
            cond=<StockOrderCond.Cash: 'Cash'>,
        ),
        StockProfitLossSummary(
            code='2330',
            quantity=1000,
            entry_price=2000,
            cover_price=1980,
            pnl=-20000,
            currency='NTD',
            entry_cost=2000000,
            cover_cost=1980000,
            buy_cost=2000119,
            sell_cost=1979881,
            pr_ratio=-1.00,
            cond=<StockOrderCond.Cash: 'Cash'>,
        ),
    ],
    total=ProfitLossTotal(
        entry_amount=0,
        cover_amount=0,
        quantity=2000,
        buy_cost=2030238,
        sell_cost=2010762,
        pnl=-19000,
        pr_ratio=-0.94,
    ),
)

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

### 期貨選擇權

FutureProfitLossSummary

```
code (str):          商品代碼
quantity (int):      數量
entry_price (float): 進倉價格
cover_price (float): 平倉價格
pnl (float):         損益
currency (str):      幣別
direction (Action):  買賣別 {Buy: 買, Sell: 賣}
tax (int):           交易稅
fee (int):           交易手續費

```

ProfitLossTotal

```
entry_amount (float): 進倉總金額
cover_amount (float): 平倉總金額
quantity (int):       總數量
buy_cost (float):     付出總成本
sell_cost (float):    賣出總收入
pnl (float):          總損益
pr_ratio (float):     總損益比

```

In

```
api.list_profit_loss_summary(api.futopt_account, '2026-05-01', '2026-05-21')

```

Out

```
ProfitLossSummaryTotal(
    profitloss_summary=[
        FutureProfitLossSummary(
            code='TXO20260620200C',
            quantity=3,
            entry_price=131.0,
            cover_price=126.0,
            pnl=-750.0,
            currency='NTD',
            direction=<Action.Buy: 'Buy'>,
            tax=5,
            fee=120,
        ),
    ],
    total=ProfitLossTotal(
        entry_amount=19650,
        cover_amount=18900,
        quantity=3,
        buy_cost=19775,
        sell_cost=18775,
        pnl=-750,
        pr_ratio=-3.79,
    ),
)

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
