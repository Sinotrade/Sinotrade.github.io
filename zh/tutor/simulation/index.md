Users can first familiarize themselves with the API services in the simulation mode, which can avoid the loss of property caused by operational errors in the production environment.

Simulation

```
import shioaji as sj
api = sj.Shioaji(simulation=True)

```

## Available APIs

Data

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

Order

```
1. place_order
2. update_order
3. cancel_order
4. update_status
5. list_trades

```

Account

```
1. list_positions
2. list_profit_loss

```
