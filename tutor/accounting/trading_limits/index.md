Reminder

Query available on trading days from 8:30 to 15:00.

The feature of trading_limits is used to query trading limits of stock account and you need to [login](../../login) first.

In

```
api.trading_limits?

```

Out

```
Signature:
api.trading_limits(
    account: shioaji.account.Account = None,
    timeout: int = 5000,
    cb: Callable[[shioaji.position.TradingLimits], NoneType] = None,
) -> shioaji.position.TradingLimits
Docstring: query stock account trading limits

```

In

```
api.trading_limits(api.stock_account)

```

Out

```
TradingLimits(
    status=<FetchStatus.Fetched: 'Fetched'>,
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

TradingLimits

```
status (FetchStatus): fetch status
trading_limit (int): trading limit
trading_used (int): trading used
trading_available (int): trading available
margin_limit (int): margin limit
margin_used (int): margin used
margin_available (int): margin available
short_limit (int): short selling limit
short_used (int): short selling used
short_available (int): short selling available

```
