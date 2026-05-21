Query **futures account** margin. [Login](../../login) is required first.

Margin

```
api.margin?

Signature:
    api.margin(
        account: shioaji.account.Account = None,
        timeout: int = 5000,
        cb: Callable[[shioaji.position.Margin], NoneType] = None,
    ) -> shioaji.position.Margin

```

Parameters

```
account: optional, futures account (defaults to api.futopt_account)
timeout: timeout in milliseconds
cb:      optional, callback function, used when timeout=0

```

Margin

```
shioaji portfolio margin [--account BROKER_ID-ACCOUNT_ID]

```

Parameters

```
--account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default futures account if omitted

```

Margin

```
POST /api/v1/portfolio/margin
Content-Type: application/json

{
  "account_type": "F",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: account type, fixed as "F"
broker_id:    optional, broker ID
account_id:   optional, account ID
person_id:    optional, personal ID

```

## Attributes

Margin

```
yesterday_balance (float):            yesterday's balance
today_balance (float):                today's balance
deposit_withdrawal (float):           deposit and withdrawal
fee (float):                          fee
tax (float):                          futures transaction tax
initial_margin (float):               initial margin
maintenance_margin (float):           maintenance margin
margin_call (float):                  margin call
risk_indicator (float):               risk indicator
royalty_revenue_expenditure (float):  royalty revenue and expenditure
equity (float):                       equity
equity_amount (float):                equity amount
option_openbuy_market_value (float):  open buy option market value
option_opensell_market_value (float): open sell option market value
option_open_position (float):         reference open option profit/loss
option_settle_profitloss (float):     reference settled option profit/loss
future_open_position (float):         open futures floating profit/loss
today_future_open_position (float):   reference today's open futures floating profit/loss
future_settle_profitloss (float):     settled futures profit/loss
available_margin (float):             available (withdrawable) margin
plus_margin (float):                  additional margin charged per the additional margin indicator
plus_margin_indicator (float):        additional margin indicator
security_collateral_amount (float):   total securities collateral
order_margin_premium (float):         order margin and order premium
collateral_amount (float):            collateral amount

```

## Examples

In

```
api.margin()

```

Out

```
Margin(
    yesterday_balance=60100,
    today_balance=60100,
    deposit_withdrawal=0,
    fee=0,
    tax=0,
    initial_margin=0,
    maintenance_margin=0,
    margin_call=0,
    risk_indicator=999,
    royalty_revenue_expenditure=0,
    equity=60100,
    equity_amount=60100,
    option_openbuy_market_value=0,
    option_opensell_market_value=0,
    option_open_position=0,
    option_settle_profitloss=0,
    future_open_position=0,
    today_future_open_position=0,
    future_settle_profitloss=0,
    available_margin=60100,
    plus_margin=0,
    plus_margin_indicator=0,
    security_collateral_amount=0,
    order_margin_premium=0,
    collateral_amount=0
)

```

**With specific account**

In

```
api.margin(account=api.futopt_account)

```

In

```
shioaji portfolio margin

```

Out

```
yesterday_balance: 60100
today_balance: 60100
deposit_withdrawal: 0
fee: 0
tax: 0
initial_margin: 0
maintenance_margin: 0
margin_call: 0
risk_indicator: 999
royalty_revenue_expenditure: 0
equity: 60100
equity_amount: 60100
option_openbuy_market_value: 0
option_opensell_market_value: 0
option_open_position: 0
option_settle_profitloss: 0
future_open_position: 0
today_future_open_position: 0
future_settle_profitloss: 0
available_margin: 60100
plus_margin: 0
plus_margin_indicator: 0
security_collateral_amount: 0
order_margin_premium: 0
collateral_amount: 0

```

**With specific account**

In

```
shioaji portfolio margin --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/margin \
  -H 'Content-Type: application/json' \
  -d '{}'

```

Out

```
{
  "yesterday_balance": 60100.0,
  "today_balance": 60100.0,
  "deposit_withdrawal": 0.0,
  "fee": 0.0,
  "tax": 0.0,
  "initial_margin": 0.0,
  "maintenance_margin": 0.0,
  "margin_call": 0.0,
  "risk_indicator": 999.0,
  "royalty_revenue_expenditure": 0.0,
  "equity": 60100.0,
  "equity_amount": 60100.0,
  "option_openbuy_market_value": 0.0,
  "option_opensell_market_value": 0.0,
  "option_open_position": 0.0,
  "option_settle_profitloss": 0.0,
  "future_open_position": 0.0,
  "today_future_open_position": 0.0,
  "future_settle_profitloss": 0.0,
  "available_margin": 60100.0,
  "plus_margin": 0.0,
  "plus_margin_indicator": 0.0,
  "security_collateral_amount": 0.0,
  "order_margin_premium": 0.0,
  "collateral_amount": 0.0
}

```

**With specific account**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/margin \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```
