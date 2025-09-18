Contract object will be used by a lot of place like place order, subscribe quote, etc.

### Get Contracts

The following provides two methods to get contracts:

- method 1: After [Login](../../tutor/login/) success we will start to fetch all kind of contract but fetching will not block other action. So how to know the fetch action is done ? We have status of contracts download that you can use `Contracts.status`. If you set contracts_timeout inside `login` set to 10000, it will block the fetch and wait 10 second until the contract is back.

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY", 
    secret_key="YOUR_SECRET_KEY",
    contracts_timeout=10000,
)

```

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    person_id="YOUR_PERSON_ID", 
    passwd="YOUR_PASSWORD",
    contracts_timeout=10000,
)

```

- method 2: If `fetch_contract` inside `login` is set to False, it will not download contract. You can use `fetch_contracts` to download.

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY", 
    secret_key="YOUR_SECRET_KEY",
    fetch_contract=False,
)
api.fetch_contracts(contract_download=True)

```

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    person_id="YOUR_PERSON_ID", 
    passwd="YOUR_PASSWORD",
    fetch_contract=False,
)
api.fetch_contracts(contract_download=True)

```

### Contracts Information

The contracts we currently offer include: stocks, futures, options and indices. The products we provide can get more detailed information through the following ways.

In

```
api.Contracts

```

Out

```
Contracts(Indexs=(OTC, TSE), Stocks=(OES, OTC, TSE), Futures=(BRF, CAF, CBF, CCF, CDF, CEF, CFF, CGF, CHF, CJF, CK1, CKF, CLF, CM1, CMF, CNF, CQF, CRF, CSF, CU1, CUF, CWF, CXF, CYF, CZ1, CZF, DCF, DD1, DDF, DEF, DFF, DGF, DHF, DIF, DJF, DKF, DLF, DNF, DOF, DPF, DQF, DSF, DUF, DVF, DWF, DXF, DYF, DZF, EEF, EGF, EHF, EMF, EPF, ERF, EXF, EY1, EYF, FEF, FFF, FGF, FKF, FQF, FRF, FTF, FVF, FWF, FXF, FYF, FZF, G2F, GAF, GCF, GDF, GHF, GIF, GJF, GLF, GMF, GNF, GOF, GRF, GTF, GUF, GWF, GXF, GZF, HAF, HBF, HCF, HHF, HIF, HLF, HOF, HS1, HSF, HY1, HYF, IA1, IAF, IHF, IIF, IJF, IMF, IOF, IPF, IQF, IRF, ITF, IXF, IYF, IZF, JBF, JFF, JNF, JPF, JSF, JWF, JZF, KAF, KB1, KBF, KCF, KDF, KFF, KGF, KIF, KKF, KLF, KOF, KPF, KSF, KWF, LBF, LCF, LE1, LEF, LIF, LMF, LOF, LQF, LRF, LTF, LUF, LVF, LWF, LXF, LYF, MAF, MBF, MCF, MJF, MKF, MPF, MQF, MVF, MX1, MXF, MYF, NAF, NBF, NCF, NDF, NEF, NGF, NHF, NIF, NJF, NLF, NMF, NNF, NOF, NQF, NSF, NUF, NVF, NWF, NXF, NYF, NZF, OAF, OBF, OCF, ODF, OEF, OGF, OHF, OJF, OKF, OLF, OMF, OOF, OPF, OQF, ORF, OS1, OSF, OTF, OUF, OVF, OWF, OXF, OYF, OZF, PAF, PBF, PCF, PDF, PEF, PFF, PGF, PHF, PIF, PJF, PKF, PLF, PMF, PNF, POF, PPF, PQF, RHF, RTF, SPF, T5F, TGF, TJF, TXF, UDF, UNF, XAF, XBF, XEF, XIF, XJF), Options=(CAO, CBO, CCO, CDO, CEO, CFO, CGO, CHO, CJO, CKO, CLO, CMO, CNO, CQO, CRO, CSO, CXO, CZO, DCO, DEO, DFO, DGO, DHO, DJO, DKO, DLO, DNO, DOO, DPO, DQO, DSO, DUO, DVO, DWO, DXO, GIO, GXO, HCO, IJO, LOO, NYA, NYO, NZO, OAO, OBO, OCO, OJO, OKO, OOO, OZO, RHO, RTO, TEO, TFO, TGO, TX1, TXO))

```

#### Stock

In

```
api.Contracts.Stocks["2890"]
# or api.Contracts.Stocks.TSE.TSE2890

```

Out

```
Stock(
    exchange=<Exchange.TSE: 'TSE'>, 
    code='2890', 
    symbol='TSE2890', 
    name='永豐金', 
    category='17', 
    unit=1000, 
    limit_up=19.1, 
    limit_down=15.7, 
    reference=17.4, 
    update_date='2023/01/17', 
    day_trade=<DayTrade.Yes: 'Yes'>
)

```

Stock

```
exchange (Exchange): Attributes of industry
    {OES, OTC, TSE ...etc}
code (str): Id
symbol (str): Symbol
name (str): Name
category (str): Category
unit (int): Unit
limit_up (float): Limit up
limit_down (float): Limit down
reference (float): Reference price
update_date (str): Update date
margin_trading_balance (int): Margin trading balance
short_selling_balance (int): Short selling balance
day_trade (DayTrade): Day trade
    {Yes, No, OnlyBuy}

```

Out

```
Stock(
    exchange=<Exchange.TSE: 'TSE'>, 
    code='2890', 
    symbol='TSE2890', 
    name='永豐金', 
    category='17', 
    unit=1000, 
    limit_up=19.1, 
    limit_down=15.7, 
    reference=17.4, 
    update_date='2023/01/17', 
    day_trade=<DayTrade.Yes: 'Yes'>
)

```

#### Futures

In

```
api.Contracts.Futures["TXFA3"]
# or api.Contracts.Futures.TXF.TXF202301

```

Out

```
Future(
    code='TXFA3', 
    symbol='TXF202301', 
    name='臺股期貨01', 
    category='TXF', 
    delivery_month='202301', 
    delivery_date='2023/01/30', 
    underlying_kind='I', 
    unit=1, 
    limit_up=16417.0, 
    limit_down=13433.0, 
    reference=14925.0, 
    update_date='2023/01/18'
)

```

Future

```
code (str): Id
symbol (str): Symbol
name (str): Name
category (str): Category
delivery_month (str): Delivery Month
delivery_date (str): Delivery Date
underlying_kind (str): Underlying Kind
unit (int): Unit
limit_up (float): Limit up
limit_down (float): Limit down
reference (float): Reference price
update_date (str): Update date

```

#### Options

In

```
api.Contracts.Options["TXO18000R3"]
# or api.Contracts.Options.TXO.TXO20230618000P

```

Out

```
Option(
    code='TXO18000R3', 
    symbol='TXO20230618000P', 
    name='臺指選擇權06月 18000P', 
    category='TXO', 
    delivery_month='202306', 
    delivery_date='2023/06/21', 
    strike_price=18000, 
    option_right=<OptionRight.Put: 'P'>, 
    underlying_kind='I', 
    unit=1, 
    limit_up=4720.0, 
    limit_down=1740.0, 
    reference=3230.0, 
    update_date='2023/01/18'
)

```

Option

```
code (str): Id
symbol (str): Symbol
name (str): Name
category (str): Category
delivery_month (str): Delivery Month
delivery_date (str): Delivery Date
strike_price (int or float): Strike Price
option_right (OptionRight): Option Right
underlying_kind (str): Underlying Kind
unit (int): Unit
limit_up (float): Limit up
limit_down (float): Limit down
reference (float): Reference price
update_date (str): Update date

```

#### Index

The `Indexs` object shows all supported index contracts, among other categories. Index contracts do not support place_order, but allow subscribing to market quotes. This will be discussed in the next topic.

In

```
api.Contracts.Indexs.TSE

```

Out

```
TSE(TSE001, TSE015, TSE016, TSE017, TSE018, TSE019, TSE020, TSE022, TSE023, TSE024, TSE025, TSE026, TSE028, TSE029, TSE030, TSE031, TSE032, TSE033, TSE035, TSE036, TSE037, TSE038, TSE039, TSE040, TSE041, TSE042, TSE043, TSE004, TSE005)

```

In

```
api.Contracts.Indexs.TSE["001"]
# or api.Contracts.Indexs.TSE.TSE001

```

Out

```
Index(
    exchange=<Exchange.TSE: 'TSE'>, 
    code='001', 
    symbol='TSE001', 
    name='加權指數'
)

```

Index

```
exchange (Exchange): exchange
    {OES, OTC, TSE ...etc}
code (str): Code
symbol (str): Symbol
name (str): Name

```

Contract Update Information

- 07:50 Futures contract update
- 08:00 All market contract update
- 14:50 Futures night contract update
- 17:15 Futures night contract update
