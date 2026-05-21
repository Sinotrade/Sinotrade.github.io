Query the published **disposition** and **attention** stock lists.

## Disposition Stocks

punish

```
api.punish?

Signature:
    api.punish(
        timeout: int = 5000,
        cb: Callable[[shioaji.data.Punish], NoneType] = None,
    ) -> shioaji.data.Punish

```

Parameters

```
timeout: timeout in milliseconds
cb:      callback function, used when timeout=0

```

punish

```
GET /api/v1/data/regulatory_punish

```

### Attributes

Punish

```
code (list[str]):            symbol codes
start_date (list[date]):     disposition start date
end_date (list[date]):       disposition end date
updated_at (list[datetime]): updated time
interval (list[str]):        matching interval
unit_limit (list[float]):    single-order limit
total_limit (list[float]):   daily-order limit
description (list[str]):     description
announced_date (list[date]): announced date

```

### Examples

In

```
api.punish()

```

Out

```
Punish[86](
    code=["1591", "1595", ...],
    start_date=["2026-05-21", "2026-05-11", ...],
    end_date=["2026-06-03", "2026-05-22", ...],
    updated_at=["2026-05-20T18:18:31", "2026-05-08T18:18:39", ...],
    interval=["25分鐘", "5分鐘", ...],
    unit_limit=[None, 10, ...],
    total_limit=[None, 30, ...],
    description=["...", "...", ...],
    announced_date=["2026-05-20", "2026-05-08", ...]
)

```

**Convert to DataFrame (polars example)**

In

```
import polars as pl
punish = api.punish()
df = pl.DataFrame(punish.dict())
df.head()

```

Out

| code | start_date | end_date | updated_at | interval | unit_limit | total_limit | description | announced_date | | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 1591 | 2026-05-21 | 2026-06-03 | 2026-05-20T18:18:31 | 25分鐘 | null | null | ... | 2026-05-20 | | 1595 | 2026-05-11 | 2026-05-22 | 2026-05-08T18:18:39 | 5分鐘 | 10 | 30 | ... | 2026-05-08 |

In

```
curl http://localhost:8080/api/v1/data/regulatory_punish

```

Out

```
{
  "code": ["1591", "1595", "..."],
  "start_date": ["2026-05-21", "2026-05-11", "..."],
  "end_date": ["2026-06-03", "2026-05-22", "..."],
  "updated_at": ["2026-05-20T18:18:31", "2026-05-08T18:18:39", "..."],
  "interval": ["25分鐘", "5分鐘", "..."],
  "unit_limit": [null, 10, "..."],
  "total_limit": [null, 30, "..."],
  "description": ["...", "...", "..."],
  "announced_date": ["2026-05-20", "2026-05-08", "..."]
}

```

______________________________________________________________________

## Attention Stocks

notice

```
api.notice?

Signature:
    api.notice(
        timeout: int = 5000,
        cb: Callable[[shioaji.data.Notice], NoneType] = None,
    ) -> shioaji.data.Notice

```

Parameters

```
timeout: timeout in milliseconds
cb:      callback function, used when timeout=0

```

notice

```
GET /api/v1/data/regulatory_notice

```

### Attributes

Notice

```
code (list[str]):            symbol codes
updated_at (list[datetime]): updated time
close (list[float]):         closing price
reason (list[str]):          attention reason
announced_date (list[date]): announced date

```

### Examples

In

```
api.notice()

```

Out

```
Notice[2](
    code=["6775", "6990"],
    updated_at=["2026-05-21T17:18:15", "2026-05-21T17:18:15"],
    close=[51.16, 153.29],
    reason=["...", "..."],
    announced_date=["2026-05-21", "2026-05-21"]
)

```

**Convert to DataFrame (polars example)**

In

```
import polars as pl
notice = api.notice()
df = pl.DataFrame(notice.dict())
df.head()

```

Out

| code | updated_at | close | reason | announced_date | | --- | --- | --- | --- | --- | | 6775 | 2026-05-21T17:18:15 | 51.16 | ... | 2026-05-21 | | 6990 | 2026-05-21T17:18:15 | 153.29 | ... | 2026-05-21 |

In

```
curl http://localhost:8080/api/v1/data/regulatory_notice

```

Out

```
{
  "code": ["6775", "6990"],
  "updated_at": ["2026-05-21T17:18:15", "2026-05-21T17:18:15"],
  "close": [51.16, 153.29],
  "reason": ["...", "..."],
  "announced_date": ["2026-05-21", "2026-05-21"]
}

```
