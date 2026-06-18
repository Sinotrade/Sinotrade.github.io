為避免影響其他使用者連線，請遵守以下使用規範。

## 流量限制

流量

- 現貨（僅限整股交易，零股不納入計算）：

  | 近 30 日使用 API 成交金額 | 每日流量限制 | | --- | --- | | 0 | 500MB | | 1 - 1 億 | 2GB | | > 1 億 | 10GB |

- 期貨：

  | 近 30 日使用 API 成交金額 | 每日流量限制 | | --- | --- | | 0 | 500MB | | 1 - 大台 1000 口 / 小台 4000 口 | 2GB | | > 大台 1000 口 / 小台 4000 口 | 10GB |

提醒

流量於開盤日早上 8:00 重置。

## 流量及連線數查詢

UsageStatus

```
connections (int):     連線數量
bytes (int):           已使用流量
limit_bytes (int):     每日流量限制
remaining_bytes (int): 剩餘可使用流量

```

In

```
api.usage()

```

Out

```
UsageOut(connections=2, bytes=43883999, limit_bytes=2147483648, remaining_bytes=2103599649)

```

**換算成 MB**

In

```
usage = api.usage()
print(f"已用 {usage.bytes / 1024 / 1024:.2f} MB / "
      f"上限 {usage.limit_bytes / 1024 / 1024:.0f} MB / "
      f"剩餘 {usage.remaining_bytes / 1024 / 1024:.2f} MB")

```

Out

```
已用 41.85 MB / 上限 2048 MB / 剩餘 2006.15 MB

```

In

```
shioaji auth usage

```

Out

```
API Usage
  Connections:  2
  Data Used:    41.9 MB / 2.00 GB  [░░░░░░░░░░░░░░░░░░░░]  2.0%
  Remaining:    1.96 GB

```

In

```
curl http://localhost:8080/api/v1/auth/usage

```

Out

```
{
  "connections": 2,
  "bytes": 43885469,
  "limit_bytes": 2147483648,
  "remaining_bytes": 2103598179
}

```

## 次數限制

次數

- 行情：

  `credit_enquires`、`short_stock_sources`、`snapshots`、`ticks`、`kbars`

  - 以上查詢總次數 10 秒上限 50 次
  - 盤中查詢 `ticks` 次數不得超過 10 次
  - 盤中查詢 `kbars` 次數不得超過 270 次

- 帳務：

  `list_profit_loss_detail`、`account_balance`、`list_settlements`、`list_profit_loss`、`list_positions`、`margin`

  - 以上查詢總次數 5 秒上限 25 次

- 委託：

  `place_order`、`update_status`、`update_qty`、`update_price`、`cancel_order`

  - 以上查詢總次數 10 秒上限 250 次

- 訂閱數：

  - `api.subscribe()` 數量上限為 200 個

- 連線：

  - 同一永豐金證券 `person_id` 僅可使用最多 5 個連線（`api.login()` 即建立一個連線）

- 登入：

  - `api.login()` 一天上限 1000 次

## 違規處置

Warn

- 若流量超過限制，行情（`ticks`、`snapshots`、`kbars`）類查詢將回傳空值，其他功能不受影響
- 若使用量超過限制，將暫停服務一分鐘
- 若當日連續多次超過限制，本公司將暫停該 IP 及 ID 使用權
- 若 ID 被暫停使用，請洽 Shioaji 管理人員
