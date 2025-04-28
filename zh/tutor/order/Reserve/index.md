When Stock triggers some transaction abnormal conditions, it is necessary to `Reserve Order` in advance. Abnormal conditions include: watch out for stocks, warn about stocks, dispose of stocks, and manage stocks.

Reminder

- First, you need to [login](../../login/) and [activate CA](../../prepare/terms/).
- Service hours are from 8:00 to 14:30 on trading days.

### Get Stock Reserve Summay Status

In

```
reserve_summary_resp = api.stock_reserve_summary(account)

```

Out

```
ReserveStocksSummaryResponse(
    response=ReserveStocksSummary(
        stocks=[
            ReserveStockSummary(
                contract=Contract(
                    security_type=<SecurityType.Stock: 'STK'>, 
                    exchange=<Exchange.TSE: 'TSE'>, 
                    code='2890', 
                    name='永豐金'
                ),
                available_share=5000, 
                reserved_share=0
            )
        ], 
        account=StockAccount(
            person_id='X123456789', 
            broker_id='9A95', 
            account_id='12345678', 
            signed=True
            )
        )
    )

```

### Reserve Stock

In

```
contract = api.Contracts.Stocks["2890"]
resp = api.reserve_stock(account, contract, 1000)

```

Out

```
ReserveStockResponse(
    response=ReserveOrderResp(
        contract=Stock(
            exchange=<Exchange.TSE: 'TSE'>, 
            code='2890', 
            symbol='TSE2890', 
            name='永豐金'
        ), 
        account=StockAccount(
            person_id='X123456789', 
            broker_id='9A95', 
            account_id='12345678', 
            signed=True), 
        share=1000, 
        status=True, 
        info=''
    )
)

```

### Get Stock Reserve Detail Satus

In

```
resp = api.stock_reserve_detail(account)

```

Out

```
ReserveStocksDetailResponse(
    response=ReserveStocksDetail(stocks=[
            ReserveStockDetail(
                contract=Contract(
                    security_type=<SecurityType.Stock: 'STK'>, 
                    exchange=<Exchange.TSE: 'TSE'>, 
                    code='6153', 
                    name='嘉聯益'
                ), 
                share=1000, 
                order_ts=1638253253, 
                status=True, 
                info='已完成'
            )
        ], 
        account=StockAccount(
            person_id='X123456789', 
            broker_id='9A95', 
            account_id='12345678', 
            signed=True)
        )
)

```

### Reserve Earmarking

In

```
contract = api.Contracts.Stocks["2890"]
resp = api.reserve_earmarking(account, contract, 1000, 15.15)

```

Out

```
ReserveEarmarkingResponse(
    response=EarmarkingOrderResp(
        contract=Stock(
            exchange=<Exchange.TSE: 'TSE'>, 
            code='2890', 
            symbol='TSE2890', 
            name='永豐金', 
        ), 
        account=StockAccount(
            person_id='X123456789', 
            broker_id='9A95', 
            account_id='12345678', 
            signed=True)
        ), 
        share=1000, 
        price=15.15, 
        status=True, 
        info='OK')
)

```

### Get Earmarking Detail Status

In

```
api.earmarking_detail(account)

```

Out

```
EarmarkStocksDetailResponse(
    response=EarmarkStocksDetail(
        stocks=[
            EarmarkStockDetail(
                contract=Contract(
                    security_type=<SecurityType.Stock: 'STK'>, 
                    exchange=<Exchange.TSE: 'TSE'>, 
                    code='2890', 
                    name='永豐金'
                ), 
                share=1000, 
                price=15.15, 
                amount=15171, 
                order_ts=1638416488, 
                status=False, 
                info='扣款失敗'), 
            EarmarkStockDetail(
                contract=Contract(
                    security_type=<SecurityType.Stock: 'STK'>, 
                    exchange=<Exchange.TSE: 'TSE'>, 
                    code='2890', 
                    name='永豐金'
                ), 
                share=1000, 
                price=15.15, 
                amount=15171, 
                order_ts=1638415662, status=True, 
                info='')
            ], 
            account=StockAccount(
                person_id='X123456789', 
                broker_id='9A95', 
                account_id='12345678', 
                signed=True)
            )
        )
    )

```

### Example

Query the reserve status of all accounts under your name.

In

```
import shioaji as sj

api = sj.Shioaji()
accounts = api.login("YOUR_PERSON_ID", "YOUR_PASSWORD", contracts_timeout=10000)
api.activate_ca(
    ca_path="/c/your/ca/path/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="Person of this Ca",
)
for account in accounts:
    if account.account_type == AccountType.Stock:
        reserve_summary_resp = api.stock_reserve_summary(account)
        for reserve_stock_summary in reserve_summary_resp.response.stocks:
                if reserve_stock_summary.available_share:
                    resp = api.reserve_stock(
                        account, 
                        reserve_stock_summary.contract,
                        reserve_stock_summary.available_share
                    )

```
