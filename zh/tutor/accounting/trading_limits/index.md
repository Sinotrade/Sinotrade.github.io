提醒

查詢時間為交易日 8:30~15:00。

用於查詢證券帳戶交易額度，需要先[登入](../../login)。

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
status (FetchStatus): 資料回傳狀態
trading_limit (int): 電子交易總額度
trading_used (int): 電子交易已用額度
trading_available (int): 電子交易可用額度
margin_limit (int): 融資額度上限
margin_used (int): 融資已用額度
margin_available (int): 融資可用額度
short_limit (int): 融券額度上限
short_used (int): 融券已用額度
short_available (int): 融券可用額度

```
