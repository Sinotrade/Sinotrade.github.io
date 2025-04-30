用於查詢期貨帳戶的保證金，需先[登入](../../login)。

In

```
api.margin?

```

Out

```
Signature:
api.margin(
    account: shioaji.account.Account = None,
    timeout: int = 5000,
    cb: Callable[[shioaji.position.Margin], NoneType] = None,
) -> shioaji.position.Margin
Docstring: query future account of margin

```

In

```
api.margin(api.futopt_account)

```

Out

```
Margin(
    status=<FetchStatus.Fetched: 'Fetched'>, 
    yesterday_balance=6000.0, 
    today_balance=6000.0, 
    deposit_withdrawal=0.0, 
    fee=0.0, 
    tax=0.0, 
    initial_margin=0.0, 
    maintenance_margin=0.0, 
    margin_call=0.0, 
    risk_indicator=999.0, 
    royalty_revenue_expenditure=0.0, 
    equity=6000.0, 
    equity_amount=6000.0, 
    option_openbuy_market_value=0.0, 
    option_opensell_market_value=0.0, 
    option_open_position=0.0, 
    option_settle_profitloss=0.0, 
    future_open_position=0.0, 
    today_future_open_position=0.0, 
    future_settle_profitloss=0.0, 
    available_margin=6000.0, 
    plus_margin=0.0, 
    plus_margin_indicator=0.0, 
    security_collateral_amount=0.0, 
    order_margin_premium=0.0, 
    collateral_amount=0.0
)

```

Margin

```
status (FetchStatus): 資料回傳狀態
yesterday_balance (float): 前日餘額
today_balance (float): 今日餘額
deposit_withdrawal (float): 存提
fee (float): 手續費
tax (float): 期交稅
initial_margin (float): 原始保證金
maintenance_margin (float): 維持保證金
margin_call (float): 追繳保證金
risk_indicator (float): 風險指標
royalty_revenue_expenditure (float): 權利金收入與支出
equity (float): 權益數
equity_amount (float): 權益總值
option_openbuy_market_value (float): 未沖銷買方選擇權市值
option_opensell_market_value (float): 未沖銷賣方選擇權市值
option_open_position (float): 參考未平倉選擇權損益
option_settle_profitloss (float): 參考選擇權平倉損益
future_open_position (float): 未沖銷期貨浮動損益
today_future_open_position (float): 參考當日未沖銷期貨浮動損益
future_settle_profitloss (float): 期貨平倉損益
available_margin (float): 可動用(出金)保證金
plus_margin (float): 依「加收保證金指標」所加收之保證金
plus_margin_indicator (float): 加收保證金指標
security_collateral_amount (float): 有價證券抵繳總額
order_margin_premium (float): 委託保證金及委託權利金
collateral_amount (float): 有價品額

```
