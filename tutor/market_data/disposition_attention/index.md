## Disposition Stocks

Disposition Stocks

```
>> api.punish?

Signature:
api.punish(
    timeout: int = 5000,
    cb: Callable[[shioaji.data.Punish], NoneType] = None,
) -> shioaji.data.Punish
Docstring: get punish information

```

### Example

In

```
punish = api.punish()
punish

```

Out

```
Punish(
    code=['2349', '2408', ...],
    start_date=[datetime.date(2025, 12, 17), datetime.date(2025, 12, 8), ...],
    end_date=[datetime.date(2025, 12, 31), datetime.date(2025, 12, 19), ...],
    updated_at=[datetime.datetime(2025, 12, 16, 18, 18, 20), datetime.datetime(2025, 12, 16, 18, 18, 20), ...],
    interval=['5分鐘', '5分鐘', ...],
    unit_limit=[10.0, 10.0, ...],
    total_limit=[30.0, 30.0, ...],
    description=['...', '...', ...],
    announced_date=[datetime.date(2025, 12, 16), datetime.date(2025, 12, 5), ...]
)

```

To DataFrame

In

```
df = pd.DataFrame(punish.__dict__)
df

```

Out

| code | start_date | end_date | updated_at | interval | unit_limit | total_limit | description | announced_date | | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2349 | 2025-12-17 | 2025-12-31 | 2025-12-16 18:18:20 | 5分鐘 | 10.0 | 30.0 | ... | 2025-12-16 | | 2408 | 2025-12-08 | 2025-12-19 | 2025-12-16 18:18:20 | 5分鐘 | 10.0 | 30.0 | ... | 2025-12-05 |

### Attributes

Punish

```
code (list[str]): code
start_date (list[date]): disposition start date
end_date (list[date]): disposition end date
updated_at (list[datetime]): updated time
interval (list[str]): matching interval
unit_limit (list[float]): single order limit
total_limit (list[float]): daily order limit
description (list[str]): disposition description
announced_date (list[date]): announced date

```

______________________________________________________________________

## Attention Stocks

Attention Stocks

```
>> api.notice?

Signature:
api.notice(
    timeout: int = 5000,
    cb: Callable[[shioaji.data.Notice], NoneType] = None,
) -> shioaji.data.Notice
Docstring: get notice information

```

### Example

In

```
notice = api.notice()
notice

```

Out

```
Notice(
    code=['089508', '2349', ...],
    updated_at=[datetime.datetime(2025, 12, 16, 18, 18, 19), datetime.datetime(2025, 12, 16, 18, 18, 19), ...],
    close=[9.85, 16.2, ...],
    reason=['最近六個營業日累積收盤價漲幅達39.34%﹝第一款﹞。', '最近六個營業日累積收盤價漲幅達41.59%﹝第一款﹞...', ...],
    announced_date=[datetime.date(2025, 12, 16), datetime.date(2025, 12, 16), ...]
)

```

To DataFrame

In

```
df = pd.DataFrame(notice.__dict__)
df

```

Out

| code | updated_at | close | reason | announced_date | | --- | --- | --- | --- | --- | | 089508 | 2025-12-16 18:18:19 | 9.85 | 最近六個營業日累積收盤價漲幅達39.34%﹝第一款﹞。 | 2025-12-16 | | 2349 | 2025-12-16 18:18:19 | 16.2 | 最近六個營業日累積收盤價漲幅達41.59%﹝第一款﹞... | 2025-12-16 |

### Attributes

Notice

```
code (list[str]): code
updated_at (list[datetime]): updated time
close (list[float]): close price
reason (list[str]): attention reason
announced_date (list[date]): announced date

```
