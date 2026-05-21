用於查詢**期貨帳戶**保證金，需要先[登入](../../login)。

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
account: 選填，期貨帳戶（省略則使用 api.futopt_account）
timeout: 逾時毫秒
cb:      選填，callback 函式，timeout=0 時使用

```

Margin

```
shioaji portfolio margin [--account BROKER_ID-ACCOUNT_ID]

```

Parameters

```
--account: 選填，BROKER_ID-ACCOUNT_ID 格式，省略則使用預設期貨帳戶

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
account_type: 帳戶類型，固定為 "F"
broker_id:    選填，券商代碼
account_id:   選填，帳戶代碼
person_id:    選填，身分證字號

```

## 屬性

Margin

```
yesterday_balance (float):           前日餘額
today_balance (float):               今日餘額
deposit_withdrawal (float):          存提
fee (float):                         手續費
tax (float):                         期交稅
initial_margin (float):              原始保證金
maintenance_margin (float):          維持保證金
margin_call (float):                 追繳保證金
risk_indicator (float):              風險指標
royalty_revenue_expenditure (float): 權利金收入與支出
equity (float):                      權益數
equity_amount (float):               權益總值
option_openbuy_market_value (float): 未沖銷買方選擇權市值
option_opensell_market_value (float): 未沖銷賣方選擇權市值
option_open_position (float):        參考未平倉選擇權損益
option_settle_profitloss (float):    參考選擇權平倉損益
future_open_position (float):        未沖銷期貨浮動損益
today_future_open_position (float):  參考當日未沖銷期貨浮動損益
future_settle_profitloss (float):    期貨平倉損益
available_margin (float):            可動用(出金)保證金
plus_margin (float):                 依「加收保證金指標」所加收之保證金
plus_margin_indicator (float):       加收保證金指標
security_collateral_amount (float):  有價證券抵繳總額
order_margin_premium (float):        委託保證金及委託權利金
collateral_amount (float):           有價品額

```

## 範例

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

**指定帳戶**

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

**指定帳戶**

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

**指定帳戶**

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/margin \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "F", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```
