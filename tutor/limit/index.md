## Fair Use Policy

Shioaji's usage limits are anti-abuse guardrails that protect connection quality for all users; they are not a starting point for program design. Correct usage should stay far away from these limits. If your program keeps hitting them, it usually means a loop, reconnection, polling, or error-retry path is wrong — fix the usage pattern instead of running close to the limits.

Correct usage

- For real-time intraday data, use quote subscriptions (`api.subscribe()` or SSE streaming); subscription pushes do not count toward traffic. Do not poll `snapshots`, `ticks`, or `kbars` as a substitute for real-time quotes.
- Historical data queries are recommended after market close; during trading hours, query only when necessary and keep it minimal. Cache the results after querying to avoid repeated queries.
- Use order/deal callbacks (or SSE order events) for order status instead of polling `update_status()`.
- Keep one logged-in connection per process; avoid repeated `login()` calls.
- When you receive an error or an empty response, check its meaning first (e.g. check traffic with `api.usage()`) before retrying.

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

Do not poll historical data queries during trading hours

`snapshots`, `ticks`, and `kbars` are **request-type quote queries** designed for after-market analysis and backtesting — they are not a source of real-time quotes. The most common misuse is polling `snapshots` repeatedly during trading hours as a real-time feed, which puts heavy load on the system; exceeding the request rate limits or causing excessive system load will suspend your access under the violation handling rules. For real-time intraday data, use quote subscriptions (`api.subscribe()` or SSE streaming) instead.

## Violation Handling

Warn

- If **traffic** exceeds the limit: market data queries (`ticks`, `snapshots`, `kbars`) return empty values; other features are not affected.
- If the **request rate** exceeds the limit: service is suspended for one minute.
- If the limits are exceeded multiple times in a day (including polling `snapshots` or other historical data queries during trading hours): the company will suspend the IP and ID.
- The company continuously monitors system load. When excessive load affects overall service quality, the IP and ID of overusing clients may be suspended, even if the limits above have not been reached.
- Retrying `login()` repeatedly during a suspension will not lift it and may extend it. Fix the usage pattern first, then contact the Shioaji administrators via [Telegram](https://t.me/joinchat/973EyAQlrfthZTk1) or [Discord](https://discord.gg/5nzmWCTnG7).
