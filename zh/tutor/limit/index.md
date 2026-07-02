## 合理使用規範

Shioaji 的各項使用限制是為了保護所有使用者的連線品質而設的防濫用邊界，不是設計程式的出發點。正確的使用方式應該離這些限制很遠；若程式經常碰到限制，通常代表迴圈、重連、輪詢或錯誤重試的邏輯有問題，請修正使用方式，而不是貼著限制執行。

正確使用方式

- 盤中即時資料請使用行情訂閱（`api.subscribe()` 或 SSE 串流），訂閱推播不計入流量；請勿以輪詢 `snapshots`、`ticks`、`kbars` 取代即時行情
- 歷史行情建議於盤後查詢，盤中僅在必要時少量查詢。查詢後請自行快取、避免重複查詢
- 委託狀態請使用主動回報（callback 或 SSE order event），避免以 `update_status()` 輪詢
- 每個程式行程維持一個已登入的連線，避免反覆 `login()`
- 收到錯誤或空回應時，請先確認其意義（例如先以 `api.usage()` 檢查流量），再決定是否重試

## 流量限制

流量

- 現貨（僅限整股交易，零股不納入計算）：

  | 近 30 日使用 API 成交金額 | 每日流量限制 | | --- | --- | | 0 | 500MB | | 1 - 1 億 | 2GB | | > 1 億 | 10GB |

- 期貨：

  | 近 30 日使用 API 成交口數 | 每日流量限制 | | --- | --- | | 0 | 500MB | | 1 - 大台 1000 口 / 小台 4000 口 | 2GB | | > 大台 1000 口 / 小台 4000 口 | 10GB |

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

盤中請勿輪詢歷史行情查詢

`snapshots`、`ticks`、`kbars` 屬於**查詢型行情**，設計用途為盤後分析與回測，並非即時行情來源。最常見的錯誤用法是盤中反覆輪詢 `snapshots` 當作即時報價，這會對系統造成大量負載；超過次數限制或造成系統負載過高，將依違規處置暫停使用權。盤中需要即時資料，請改用行情訂閱（`api.subscribe()` 或 SSE 串流）。

## 違規處置

Warn

- 若**流量**超過限制：行情（`ticks`、`snapshots`、`kbars`）類查詢將回傳空值，其他功能不受影響
- 若**查詢次數**超過限制：將暫停服務一分鐘
- 若當日連續多次超過限制（包含盤中輪詢 `snapshots` 等歷史行情查詢）：本公司將暫停該 IP 及 ID 使用權
- 本公司將持續監控系統負載狀況；當系統負載過高、影響整體服務品質時，將暫停過度使用之客戶的 IP 及 ID 使用權，不以是否達到上述限制為限
- 暫停期間反覆重試 `login()` 無法解除限制，且可能延長暫停時間；請先修正程式使用方式，再透過 [Telegram](https://t.me/joinchat/973EyAQlrfthZTk1) 或 [Discord](https://discord.gg/5nzmWCTnG7) 聯繫 Shioaji 管理人員
