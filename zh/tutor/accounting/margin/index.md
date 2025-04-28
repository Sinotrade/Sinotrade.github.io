The feature of margin is used to query margin of futures account and you need to [login](../../login) first.

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
status (FetchStatus): fetch status
yesterday_balance (float): balance of yesterday
today_balance (float): balance of today
deposit_withdrawal (float): deposit and withdrawal
fee (float): fee
tax (float): tax
initial_margin (float): margin of origin
maintenance_margin (float):  margin of maintenance
margin_call (float):  margin of call
risk_indicator (float): risk indicator
royalty_revenue_expenditure (float): revenue and expenditure of royalty
equity (float): equity
equity_amount (float): amount of equity
option_openbuy_market_value (float): value of option openbuy market
option_opensell_market_value (float): value of option opensell market
option_open_position (float): profit loss of open option 
option_settle_profitloss (float): profit loss of settle option
future_open_position (float): profit loss of open future
today_future_open_position (float): profit loss of today open future
future_settle_profitloss (float): profit loss of settle future
available_margin (float): available margin
plus_margin (float): plus margin
plus_margin_indicator (float): indicator of plus margin
security_collateral_amount (float): amount of security collateral
order_margin_premium (float): order margin and order premium 
collateral_amount (float): amount of collateral

```
