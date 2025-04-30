為避免影響其他使用者連線，請遵守以下使用規範

流量

- 現貨 :

  | 近 30 日使用 API 成交金額 | 每日流量限制 | | --- | --- | | 0 | 500MB | | 1 - 1億 | 2GB | | > 1億 | 10GB |

- 期貨 :

  | 近 30 日使用 API 成交金額 | 每日流量限制 | | --- | --- | | 0 | 500MB | | 1 - 大台1000口 / 小台4000口 | 2GB | | > 大台1000口 / 小台4000口 | 10G |

流量及連線數查詢

```
api.usage()

```

Out

```
UsageStatus(connections=1, bytes=41343260, limit_bytes=2147483648, remaining_bytes=2106140388)

```

```
connection: 連線數量
bytes: 已使用流量
limit_bytes: 每日流量限制
remaining_bytes: 剩餘可使用流量

```

次數

- 行情 :

  `credit_enquire`, `short_stock_sources`, `snapshots`, `ticks`, `kbars`

  - 以上查詢總次數 5 秒上限 50 次
  - 盤中查詢 `ticks` 次數不得超過 10 次
  - 盤中查詢 `kbars` 次數不得超過 270 次

- 帳務 :

  `list_profit_loss_detail`,`account_balance`, `list_settlements`, `list_profit_loss`, `list_positions`, `margin`

  以上查詢總次數 5 秒上限 25 次

- 委託 :

  `place_order`, `update_status`, `update_qty`, `update_price`, `cancel_order`

  以上查詢總次數 10 秒上限 250 次

- 訂閱數 :

  `api.subscribe()`數量為200個

- 連線 :

  同一永豐金證券`person_id`，僅可使用最多5個連線。 注意: `api.login()`即建立一個連線

- 登入 :

  `api.login()`一天上限1000次

Warn

- 若流量超過限制，行情(ticks、snapshots、kbars)類查詢將回傳空值，其他功能不受影響
- 若使用量超過限制，將暫停服務一分鐘
- 若當日連續多次超過限制，本公司將暫停該 IP 及 ID 使用權
- 若 ID 被暫停使用，請洽 Shioaji 管理人員
