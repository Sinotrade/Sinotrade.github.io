**Warning**: The features of this page will be removed in the future.

### Account Margin

In

```
api.get_account_margin?

```

Out

```
Signature: api.get_account_margin(currency='NTD', margin_type='1', account={})
Docstring:
query margin    currency: {NTX, USX, NTD, USD, HKD, EUR, JPY, GBP}
the margin calculate in which currency
    - NTX: 約當台幣
    - USX: 約當美金
    - NTD: 新台幣
    - USD: 美元
    - HKD: 港幣
    - EUR: 歐元
    - JPY: 日幣
    - GBP: 英鎊
margin_type: {'1', '2'}
    query margin type
    - 1 : 即時
    - 2 : 風險

```

In

```
account_margin = api.get_account_margin()
account_margin

```

Out

```
AccountMargin(person_id='PERSON_ID' broker_id='BROKER_ID' account_id='ACC_ID' signed=SIGNED username='USERNAME')

```

directly pass our AccountMargin object to pandas to using your model

In

```
df_margin = pd.DataFrame(account_margin.data())
df_margin

```

| | OrderPSecurity | ProfitAccCount | FProfit | FMissConProfit | OMissConProfit | ... | Bapamt | Sapamt | Adps | Adamt | Ybaln | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | 50000.0 | 50000.0 | 0.0 | 0.0 | 0.0 | ... | 0.0 | 0.0 | 0.0 | 0.0 | 50000.0 |

### Get Open Position

In

```
api.get_account_openposition?

```

Out

```
Signature: api.get_account_openposition(product_type='0', query_type='0', account={})
Docstring:
query open position
product_type: {0, 1, 2, 3}
    filter product type of open position
    - 0: all
    - 1: future
    - 2: option
    - 3: usd base
query_type: {0, 1}
    query return with detail or summary
    - 0: detail
    - 1: summary

```

In

```
positions = api.get_account_openposition(query_type='1', account=api.futopt_account)
positions

```

Out

```
AccountOpenPosition(person_id='PERSON_ID' broker_id='BROKER_ID' account_id='ACC_ID' signed=SIGNED username='USERNAME')

```

### AccountOpenPosition

In

```
df_positions = pd.DataFrame(positions.data())
df_positions

```

| | Account | Code | CodeName | ContractAverPrice | Currency | Date | FlowProfitLoss | MTAMT | OTAMT | OrderBS | OrderNum | OrderType | RealPrice | SettlePrice | SettleProfitLoss | StartSecurity | UpKeepSecurity | Volume | paddingByte | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | FF0020009104000 | TXFA9 | 台指期貨 01 | 9508.4137 | NTD | 00000000 | 4795201.620000 | 6438000.000000 | 8352000.000000 | B | | | 9784.0 | 9784.00 | 4795201.620000 | 8352000.000000 | 6438000.000000 | 87.000000 | |

### Get Settle ProfitLoss

In

```
api.get_account_settle_profitloss?

```

Out

```
Signature: api.get_account_settle_profitloss(product_type='0', summary='Y', start_date='', end_date='', currency='', account={})
Docstring:
query settlement profit loss
product_type: {0, 1, 2}
    filter product type of open position
    - 0: all
    - 1: future
    - 2: option
summary: {Y, N}
    query return with detail or summary
    - Y: summary
    - N: detail
start_date: str
    the start date of query range format with %Y%m%d
    ex: 20180101
end_date: str
    the end date of query range format with %Y%m%d
    ex: 20180201
currency: {NTD, USD, HKD, EUR, CAD, BAS}
    the profit loss calculate in which currency
    - NTD: 新台幣
    - USD: 美元
    - HKD: 港幣
    - EUR: 歐元
    - CAD: 加幣 
    - BAS: 基幣

```

### AccountSettleProfitLoss

In

```
st_date = (date.today() - timedelta(days=60)).strftime('%Y%m%d')
settle_profitloss = api.get_account_settle_profitloss(summary='Y', start_date=st_date)
settle_profitloss

```

```
df_profitloss = pd.DataFrame(settle_profitloss.data())
df_profitloss

```

| | account | averagePrice | code | codeName | currency | floatProfitLoss | handCharge | ord_bs | ord_type | ordno | ordno_b | settleAvgPrc | settleDate | settleVolume | tFlag | tdate | tradeProfitLoss | tradeTax | unVolume | volume | | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | | 0 | F0020009104000 | 9900.0 | TXFK8 | 台指期貨 11 | NTD | 460.000000 | 60.000000 | S | 00 | kY002 | kY003 | 9897.0 | 20181022 | 1.000000 | 1 | 20181022 | 600.000000 | 80.000000 | 0.000000 | 1.000000 |
