In order to avoid affecting other users' connections, please follow the following usage rules.

Traffic

- Stock :

  | Trading volume by API in the past 30 days | Daily Traffic Limit | | --- | --- | | 0 | 500MB | | 1 - 1E | 2GB | | > 1E | 10GB |

- Future :

  | Trading volume by API in the past 30 days | Daily Traffic Limit | | --- | --- | | 0 | 500MB | | 1 - TXF 1000 contracts / MXF 4000 contracts | 2GB | | > TXF 1000 contracts / MXF 4000 contracts | 10GB |

Traffic query

```
api.usage()

```

Out

```
UsageStatus(connections=1, bytes=41343260, limit_bytes=2147483648, remaining_bytes=2106140388)

```

```
connection: connection count.
bytes: traffic.
limit_bytes: limit bytes of daily.
remaining_bytes: remaining bytes of daily.

```

Counts

- Data :

  `credit_enquire`, `short_stock_sources`, `snapshots`, `ticks`, `kbars`

  - The total amount of inquiries above is limited to 50 times within 5 seconds.
  - During trading hours, it is prohibited to query `ticks` more than 10 times.
  - During trading hours, it is prohibited to query `kbars` more than 270 times.

- Portfolio :

  `list_profit_loss_detail`,`account_balance`, `list_settlements`, `list_profit_loss`, `list_positions`, `margin`

  The total amount of inquiries above is limited to 25 times within 5 seconds.

- Order :

  `place_order`, `update_status`, `update_qty`, `update_price`, `cancel_order`

  The total amount of inquiries above is limited to 250 times within 10 seconds.

- Subscribe :

  Number of `api.subscribe()` is 200.

- Connect :

  The same SinoPac Securities `person_id` can only use up to 5 connections.

  note. `api.login()`create a connection.

- Login :

  Up to 1000 times per day.

Warn

- If the traffic exceeds the limit, query requests for market data such as ticks, snapshots, and kbars will return empty values, while other functionalities remain unaffected.
- If the usage exceeds the limit, the service will be suspended for one minute.
- If the limit is exceeded multiple times in a row on the same day, the company will suspend the right to use the IP and ID.
- If the ID is suspended, please contact Shioaji management staff
