使用者能先在模擬環境熟悉我們所提供的服務，可避免在正式環境操作失誤造成財物的損失。以下會詳細說明在測試環境所提供的功能。

模擬環境

```
import shioaji as sj
api = sj.Shioaji(simulation=True)

```

## 可使用的APIs

行情資料

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

下單

```
1. place_order
2. update_order
3. cancel_order
4. update_status
5. list_trades

```

帳務

```
1. list_positions
2. list_profit_loss

```
