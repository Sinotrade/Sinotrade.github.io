使用者能先在模擬環境熟悉我們所提供的服務，可避免在正式環境操作失誤造成財物的損失。以下說明如何進入模擬環境。

## 進入模擬環境

```
api = sj.Shioaji(simulation=True)  # 模擬模式
accounts = api.login(
    api_key="YOUR_API_KEY",     # 請修改此處
    secret_key="YOUR_SECRET_KEY"  # 請修改此處
)

```

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=false                    # 模擬模式

# 啟動 server（自動讀取 .env，完成登入）
shioaji server start

```

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=false                    # 模擬模式

# 啟動 server（在 terminal 執行，自動讀取 .env，完成登入）
shioaji server start

```

## 可使用的 APIs

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

提醒

模擬環境的下單不支援興櫃與零股交易。

帳務

```
1. list_positions
2. list_profit_loss

```
