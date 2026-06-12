Query **stock account** trading limits. [Login](../../login) is required first.

Note

Available query hours: 8:30–15:00 on trading days.

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
account: optional, stock account (defaults to api.stock_account)
timeout: timeout in milliseconds
cb:      optional, callback function, used when timeout=0

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
--account: optional, BROKER_ID-ACCOUNT_ID format; defaults to the default stock account

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
account_type: account type, fixed as "S"
broker_id:    optional, broker ID
account_id:   optional, account ID
person_id:    optional, personal ID

```

## Attributes

TradingLimits

```
trading_limit (int):     electronic trading limit
trading_used (int):      electronic trading used
trading_available (int): electronic trading available
margin_limit (int):      margin limit
margin_used (int):       margin used
margin_available (int):  margin available
short_limit (int):       short selling limit
short_used (int):        short selling used
short_available (int):   short selling available

```

## Examples

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
