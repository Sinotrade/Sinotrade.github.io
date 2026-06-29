Practice with our services in the simulation environment first to avoid mistakes that could cause financial loss in production. This page explains how to enter simulation mode.

## Enter Simulation Mode

```
api = sj.Shioaji(simulation=True)  # simulation mode
accounts = api.login(
    api_key="YOUR_API_KEY",     # change this
    secret_key="YOUR_SECRET_KEY"  # change this
)

```

```
# .env (in the working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # change this
SJ_SEC_KEY=YOUR_SECRET_KEY             # change this
SJ_PRODUCTION=false                    # simulation mode

# Start the server (auto-reads .env and logs in)
shioaji server start

```

```
# .env (in the working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # change this
SJ_SEC_KEY=YOUR_SECRET_KEY             # change this
SJ_PRODUCTION=false                    # simulation mode

# Start the server in a terminal (auto-reads .env and logs in)
shioaji server start

```

## Available APIs

Market data

```
1. quote.subscribe
2. quote.unsubscribe
3. ticks
4. kbars
5. snapshots
6. short_stock_sources
7. credit_enquires
8. scanners

```

Orders

```
1. place_order
2. update_order
3. cancel_order
4. update_status
5. list_trades

```

Note

Order placement in the simulation environment does not support emerging stocks or odd-lot trading.

Accounting

```
1. list_positions
2. list_profit_loss

```
