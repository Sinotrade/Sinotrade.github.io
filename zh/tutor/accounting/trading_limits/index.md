用於查詢**證券帳戶**交易額度，需要先[登入](../../login)。

提醒

查詢時間為交易日 8:30~15:00。

TradingLimits

```
api.trading_limits?

Signature:
    api.trading_limits(
        account: shioaji.account.Account = None,
        timeout: int = 5000,
        cb: Callable[[shioaji.position.TradingLimits], NoneType] = None,
    ) -> shioaji.position.TradingLimits

```

Parameters

```
account: 選填，證券帳戶（省略則使用 api.stock_account）
timeout: 逾時毫秒
cb:      選填，callback 函式，timeout=0 時使用

```

TradingLimits

```
$ shioaji portfolio trading-limits --help

Get trading limits (stock account)

Usage: shioaji portfolio trading-limits [OPTIONS]

Options:
      --account <ACCOUNT>  Account in BROKER_ID-ACCOUNT_ID format (e.g. 9A00-1234567)

```

Parameters

```
--account: 選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用預設證券帳號

```

TradingLimits

```
POST /api/v1/portfolio/trading_limits
Content-Type: application/json

{
  "account_type": "S",
  "broker_id": <string>,
  "account_id": <string>,
  "person_id": <string>
}

```

Parameters

```
account_type: 帳戶類型，固定為 "S"
broker_id:    選填，券商代碼
account_id:   選填，帳戶代碼
person_id:    選填，身分證字號

```

## 屬性

TradingLimits

```
trading_limit (int):     電子交易總額度
trading_used (int):      電子交易已用額度
trading_available (int): 電子交易可用額度
margin_limit (int):      融資額度上限
margin_used (int):       融資已用額度
margin_available (int):  融資可用額度
short_limit (int):       融券額度上限
short_used (int):        融券已用額度
short_available (int):   融券可用額度

```

## 範例

In

```
api.trading_limits(account=api.stock_account)

```

Out

```
TradingLimits(
    trading_limit=1000000,
    trading_used=0,
    trading_available=1000000,
    margin_limit=0,
    margin_used=0,
    margin_available=0,
    short_limit=0,
    short_used=0,
    short_available=0
)

```

In

```
shioaji portfolio trading-limits --account YOUR_BROKER_ID-YOUR_ACCOUNT_ID

```

Out

```
trading_limit: 1000000
trading_used: 0
trading_available: 1000000
margin_limit: 0
margin_used: 0
margin_available: 0
short_limit: 0
short_used: 0
short_available: 0

```

In

```
curl -X POST http://localhost:8080/api/v1/portfolio/trading_limits \
  -H 'Content-Type: application/json' \
  -d '{"account_type": "S", "broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

Out

```
{"trading_limit":1000000,"trading_used":0,"trading_available":1000000,"margin_limit":0,"margin_used":0,"margin_available":0,"short_limit":0,"short_used":0,"short_available":0}

```
