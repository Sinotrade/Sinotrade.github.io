To avoid affecting other users' connections, please follow the usage rules below.

## Traffic Limit

Traffic

- Stock (common-stock trades only; odd lot is excluded):

  | 30-day API trading amount | Daily traffic limit | | --- | --- | | 0 | 500MB | | 1 - 100M | 2GB | | > 100M | 10GB |

- Futures:

  | 30-day API trading volume | Daily traffic limit | | --- | --- | | 0 | 500MB | | 1 - 1000 TXF / 4000 MXF | 2GB | | > 1000 TXF / 4000 MXF | 10GB |

Note

Traffic resets at 8:00 AM on each trading day.

## Usage and Connection Query

UsageStatus

```
connections (int):     number of connections
bytes (int):           bytes used
limit_bytes (int):     daily traffic limit
remaining_bytes (int): remaining bytes

```

In

```
api.usage()

```

Out

```
UsageOut(connections=2, bytes=43883999, limit_bytes=2147483648, remaining_bytes=2103599649)

```

**Convert to MB**

In

```
usage = api.usage()
print(f"Used {usage.bytes / 1024 / 1024:.2f} MB / "
      f"Limit {usage.limit_bytes / 1024 / 1024:.0f} MB / "
      f"Remaining {usage.remaining_bytes / 1024 / 1024:.2f} MB")

```

Out

```
Used 41.85 MB / Limit 2048 MB / Remaining 2006.15 MB

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

## Request Rate Limit

Request rate

- Market data:

  `credit_enquires`, `short_stock_sources`, `snapshots`, `ticks`, `kbars`

  - Total request rate: up to 50 calls per 10 seconds
  - Intraday `ticks` queries: up to 10 calls
  - Intraday `kbars` queries: up to 270 calls

- Accounting:

  `list_profit_loss_detail`, `account_balance`, `list_settlements`, `list_profit_loss`, `list_positions`, `margin`

  - Total request rate: up to 25 calls per 5 seconds

- Orders:

  `place_order`, `update_status`, `update_qty`, `update_price`, `cancel_order`

  - Total request rate: up to 250 calls per 10 seconds

- Subscriptions:

  - `api.subscribe()` up to 200 subscriptions

- Connections:

  - Each `person_id` may have at most 5 connections (`api.login()` opens a connection)

- Login:

  - `api.login()` up to 1000 calls per day

## Violation Handling

Warn

- If traffic exceeds the limit, market data queries (`ticks`, `snapshots`, `kbars`) return empty values; other features are not affected.
- If usage exceeds the limit, service is suspended for one minute.
- If the limit is exceeded multiple times in a day, the company will suspend the IP and ID.
- If the ID is suspended, please contact the Shioaji administrator.
