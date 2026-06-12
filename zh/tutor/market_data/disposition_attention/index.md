用於查詢公告的**處置股**與**注意股**名單。

## 處置股

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
timeout: 逾時毫秒
cb:      callback 函式，timeout=0 時使用

```

punish

```
$ shioaji data regulatory --help

Get regulatory disposition/attention stock data

Usage: shioaji data regulatory [OPTIONS]

Options:
      --type <REGULATORY_TYPE>
          Regulatory data type: punish (處置股) or notice (注意股)

          Possible values:
          - punish: Disposition stocks (處置股)
          - notice: Attention stocks (注意股)

          [default: punish]

```

Parameters

```
--type: 選填，punish（處置股，預設）或 notice（注意股）

```

punish

```
GET /api/v1/data/regulatory_punish

```

### 屬性

Punish

```
code (list[str]):            商品代碼
start_date (list[date]):     處置開始日期
end_date (list[date]):       處置結束日期
updated_at (list[datetime]): 更新時間
interval (list[str]):        撮合間隔
unit_limit (list[float]):    單筆委託上限
total_limit (list[float]):   單日委託上限
description (list[str]):     處置內容
announced_date (list[date]): 公告日期

```

### 範例

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

**轉成 DataFrame（以 polars 示範）**

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
shioaji data regulatory --type punish

```

Out

```
[94]{code,start_date,end_date,updated_at,interval,unit_limit,total_limit,description,announced_date}:
  "050503","2026-06-02","2026-06-15",2026-06-01T18:18:33,5分鐘,10,30,"...","2026-06-01"
  "058462","2026-06-03","2026-06-16",2026-06-02T18:18:37,20分鐘,null,null,"...","2026-06-02"
  ...

```

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

## 注意股

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
timeout: 逾時毫秒
cb:      callback 函式，timeout=0 時使用

```

notice

```
shioaji data regulatory --type notice

```

Parameters

```
--type: 選填，punish（處置股，預設）或 notice（注意股）

```

notice

```
GET /api/v1/data/regulatory_notice

```

### 屬性

Notice

```
code (list[str]):            商品代碼
updated_at (list[datetime]): 更新時間
close (list[float]):         收盤價
reason (list[str]):          注意交易資訊
announced_date (list[date]): 公告日期

```

### 範例

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

**轉成 DataFrame（以 polars 示範）**

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
shioaji data regulatory --type notice

```

Out

```
[68]{code,updated_at,close,reason,announced_date}:
  "051359",2026-06-11T18:18:40,8.85,最近六個營業日累積收盤價漲幅達39.68%﹝第一款﹞。,"2026-06-11"
  "058191",2026-06-11T18:18:41,10.9,最近六個營業日累積收盤價漲幅達32.69%﹝第一款﹞。,"2026-06-11"
  ...

```

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
