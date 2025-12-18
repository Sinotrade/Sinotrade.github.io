## 處置股

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

### 範例

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

轉成DataFrame

In

```
df = pd.DataFrame(punish.__dict__)
df

```

Out

| code | start_date | end_date | updated_at | interval | unit_limit | total_limit | description | announced_date | | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 2349 | 2025-12-17 | 2025-12-31 | 2025-12-16 18:18:20 | 5分鐘 | 10.0 | 30.0 | ... | 2025-12-16 | | 2408 | 2025-12-08 | 2025-12-19 | 2025-12-16 18:18:20 | 5分鐘 | 10.0 | 30.0 | ... | 2025-12-05 |

### 屬性

Punish

```
code (list[str]): 商品代碼
start_date (list[date]): 處置開始日期
end_date (list[date]): 處置結束日期
updated_at (list[datetime]): 更新時間
interval (list[str]): 撮合間隔
unit_limit (list[float]): 單筆委託上限
total_limit (list[float]): 單日委託上限
description (list[str]): 處置內容
announced_date (list[date]): 公告日期

```

______________________________________________________________________

## 注意股

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

### 範例

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

轉成DataFrame

In

```
df = pd.DataFrame(notice.__dict__)
df

```

Out

| code | updated_at | close | reason | announced_date | | --- | --- | --- | --- | --- | | 089508 | 2025-12-16 18:18:19 | 9.85 | 最近六個營業日累積收盤價漲幅達39.34%﹝第一款﹞。 | 2025-12-16 | | 2349 | 2025-12-16 18:18:19 | 16.2 | 最近六個營業日累積收盤價漲幅達41.59%﹝第一款﹞... | 2025-12-16 |

### 屬性

Notice

```
code (list[str]): 商品代碼
updated_at (list[datetime]): 更新時間
close (list[float]): 收盤價
reason (list[str]): 注意交易資訊
announced_date (list[date]): 公告日期

```
