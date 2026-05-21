Contract objects are used in many places, such as placing orders and subscribing to quotes.

Contracts are updated daily at the following times. Plan your downloads accordingly.

Contract update schedule

- 07:50 Futures contract update
- 08:00 Full-market contract update
- 14:45 Futures night-session contract update
- 17:15 Futures night-session contract update

### Get Contracts

The following provides two methods to get contracts:

**Method 1**

After [Login](../../tutor/login/) succeeds, all kinds of contracts will start downloading, but the download will not block other actions. To check whether the download has finished, use `Contracts.status`. Setting `contracts_timeout` inside `login` to 10000 will block until the contracts come back, waiting up to 10 seconds.

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

**Method 2**

If `fetch_contract` inside `login` is set to `False`, contracts will not be downloaded at login. You can then use `fetch_contracts` to download them later.

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

Contracts are loaded automatically by the server when `shioaji server start` is executed (see the server startup log on the [Login](../login/) page). No additional action is required.

### Contracts Information

The contracts we currently offer for the Taiwan market include stocks, futures, options, and indices. Use the methods below for more details.

Contract

```
security_type (str): Security type {STK, FUT, OPT, IND}
exchange (str): Exchange
code (str): Product code
symbol (str): Symbol
name (str): Product name
category (str): Category
currency (str): Settlement currency
delivery_month (str): Delivery month (FUT/OPT)
delivery_date (str): Settlement date (FUT/OPT)
strike_price (float): Strike price (OPT)
option_right (str): Call or Put (OPT)
underlying_kind (str): Underlying type (FUT/OPT)
underlying_code (str): Underlying product code (OPT)
unit (float): Trading unit
multiplier (int): Contract multiplier (FUT/OPT)
limit_up (float): Limit-up price
limit_down (float): Limit-down price
reference (float): Reference price
update_date (str): Update date
margin_trading_balance (int): Margin trading balance (STK)
short_selling_balance (int): Short selling balance (STK)
day_trade (str): Day trade availability {Yes, No, OnlyBuy} (STK)
target_code (str): Resolved target product code; only continuous-month aliases (e.g. TXFR1/R2) carry a value (FUT)

```

- Unused fields are returned as empty strings or 0
- Python SDK object reprs omit fields whose value is 0

**Query All Contracts**

In

```
api.Contracts

```

Out

```
Contracts(Indexs=(OTC, TAIFEX, TSE), Stocks=(OES, OTC, TSE), Futures=(BRF, BTF, CAF, CBF, CCF, CDF, CEF, CFF, CGF, CHF, CJF, CKF, CLF, CMF, CNF, CQF, CRF, CSF, CUF, CWF, CXF, CYF, CZF, DAF, DBF, DCF, DE1, DEF, DFF, DGF, DHF, DIF, DJF, DKF, DLF, DNF, DOF, DPF, DQF, DSF, DVF, DWF, DXF, DYF, DZF, E4F, ECF, ECI, ECL, EEF, EGF, EHF, EKF, EMF, EOF, EPF, ESF, ESI, ESL, EXF, EYF, EZF, F1F, FBF, FCF, FEF, FFF, FGF, FKF, FNF, FQF, FRF, FSF, FTF, FVF, FWF, FXF, FYF, FZF, G2F, GAF, GCF, GDF, GHF, GIF, GJF, GKF, GLF, GMF, GNF, GOF, GRF, GTF, GUF, GVF, GWF, GXF, GYF, GZF, HA1, HAF, HBF, HCF, HH1, HHF, HIF, HL1, HLF, HOF, HQF, HSF, IAF, IHF, IIF, IJF, IMF, IOF, IPF, IQF, IR1, IRF, ITF, IX1, IXF, IYF, IZF, JBF, JFF, JMF, JNF, JPF, JSF, JW1, JWF, JXF, JZF, KAF, KBF, KCF, KDF, KEF, KFF, KGF, KIF, KKF, KLF, KOF, KPF, KSF, KUF, KWF, LBF, LCF, LEF, LIF, LMF, LOF, LQF, LRF, LTF, LUF, LVF, LWF, LXF, LYF, M1F, MBF, MJF, MKF, MQF, MVF, MX4, MXF, MYF, NAF, NBF, NCF, NDF, NEF, NGF, NIF, NJF, NKF, NKI, NKL, NLF, NMF, NOF, NQF, NSF, NUF, NVF, NWF, NYF, OAF, OBF, ODF, OEF, OHF, OJF, OKF, OLF, OMF, OOF, OPF, OQF, ORF, OSF, OTF, OUF, OVF, OWF, OXF, OYF, OZF, PAF, PBF, PCF, PDF, PEF, PFF, PGF, PHF, PIF, PJF, PKF, PL1, PLF, PMF, PNF, PPF, PQF, PRF, PSF, PTF, PUF, PVF, PWF, PXF, PYF, PZF, QAF, QBF, QCF, QDF, QEF, QFF, QGF, QHF, QIF, QJF, QKF, QLF, QMF, QNF, QOF, QPF, QQF, QRF, QSF, QTF, QUF, QV1, QVF, QWF, QXF, QYF, QZF, RAF, RBF, RCF, RDF, REF, RFF, RGF, RHF, RIF, RJF, RKF, RLF, RNF, ROF, RPF, RRF, RSF, RTF, RUF, RVF, RWF, RXF, RYF, RZF, SAF, SBF, SCF, SDF, SEF, SFF, SGF, SHF, SIF, SJF, SKF, SLF, SMF, SNF, SOF, SPF, SQF, SRF, SSF, SUF, SVF, SWF, SXF, SYF, SZF, TGF, TJF, TMF, TWN, TXF, UAF, UBF, UCF, UDF, UEF, UFF, UGF, UHF, UIF, UJF, UKF, ULF, UMF, UNF, UOF, UPF, UQF, URF, USF, UTF, UUF, UVF, UWF, UXF, UYF, UZF, VAF, VBF, VCF, VDF, VEF, VFF, VGF, VHF, VIF, VJF, VKF, XAF, XBF, XEF, XIF, XJF, YMF, YMI, YML, ZEF, ZFF), Options=(CAO, CBO, CCO, CDA, CDO, CEO, CFO, CGO, CHO, CKO, CMO, CNO, CSO, CZO, DFO, DGO, DHO, DJO, DKO, DQO, DSO, DVO, DXO, GIO, GXO, HCO, HSO, IJO, IRO, NYO, OAO, OBO, OJO, OKO, OOO, OZO, TEO, TFO, TGO, TX4, TXO, TXX, TXY), status=<FetchStatus.Fetched: 'Fetched'>)

```

See the per-category sections below (Stocks / Futures / Options / Indices).

**Query a Single Contract**

Use the categories under `api.Contracts` to access a single contract; this returns the corresponding SDK object (Stock / Future / Option / Index).

#### Stocks

In

```
api.Contracts.Stocks["2330"]
# or api.Contracts.Stocks.TSE.TSE2330

```

Out

```
Stock(
    exchange=<Exchange.TSE: 'TSE'>,
    code='2330',
    symbol='TSE2330',
    name='台積電',
    category='24',
    unit=1000.0,
    limit_up=2440.0,
    limit_down=2000.0,
    reference=2220.0,
    update_date='2026/05/14',
    margin_trading_balance=167,
    day_trade=<DayTrade.Yes: 'Yes'>,
)

```

#### Futures

In

```
api.Contracts.Futures["TXFR1"]
# or api.Contracts.Futures.TXF.TXFR1

```

Out

```
Future(
    code='TXFR1',
    symbol='TXFR1',
    name='臺股期貨近月',
    category='TXF',
    delivery_month='202605',
    delivery_date='2026/05/20',
    underlying_kind='I',
    unit=1.0,
    limit_up=45799.0,
    limit_down=37473.0,
    reference=41636.0,
    update_date='2026/05/15',
    target_code='TXFE6',
)

```

#### Options

In

```
api.Contracts.Options["TXO20260532400C"]

```

Out

```
Option(
    code='TXO32400E6',
    symbol='TXO20260532400C',
    name='臺指選擇權F505月 32400C',
    category='TXO',
    delivery_month='202605',
    delivery_date='2026/05/20',
    strike_price=32400.0,
    option_right=<OptionRight.Call: 'C'>,
    underlying_kind='I',
    unit=1.0,
    limit_up=13400.0,
    limit_down=5060.0,
    reference=9230.0,
    update_date='2026/05/15',
)

```

#### Indices

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
    name='加權指數',
)

```

The `shioaji` CLI does not provide a contract-lookup command. Use Python or the HTTP API.

Send a GET request to the server with `curl` to retrieve a single contract.

- URL format: `/api/v1/data/contracts/{code}?security_type=<TYPE>`
- `{code}`: product code
- `security_type`: security type (`STK` / `FUT` / `OPT` / `IND`)

**Stocks**

In

```
curl "http://localhost:8080/api/v1/data/contracts/2330?security_type=STK"

```

Out

```
{"security_type":"STK","exchange":"TSE","code":"2330","symbol":"TSE2330","name":"台積電","category":"24","currency":"TWD","delivery_month":"","delivery_date":"","strike_price":0.0,"option_right":"","underlying_kind":"","underlying_code":"","unit":1000.0,"multiplier":0,"limit_up":2440.0,"limit_down":2000.0,"reference":2220.0,"update_date":"2026/05/14","margin_trading_balance":167,"short_selling_balance":0,"day_trade":"Yes","target_code":""}

```

**Futures**

In

```
curl "http://localhost:8080/api/v1/data/contracts/TXFR1?security_type=FUT"

```

Out

```
{"security_type":"FUT","exchange":"TAIFEX","code":"TXFR1","symbol":"TXFR1","name":"臺股期貨近月","category":"TXF","currency":"TWD","delivery_month":"202605","delivery_date":"2026/05/20","strike_price":0.0,"option_right":"","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":45799.0,"limit_down":37473.0,"reference":41636.0,"update_date":"2026/05/15","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":"TXFE6"}

```

**Options**

In

```
curl "http://localhost:8080/api/v1/data/contracts/TXO20260532400C?security_type=OPT"

```

Out

```
{"security_type":"OPT","exchange":"TAIFEX","code":"TXO32400E6","symbol":"TXO20260532400C","name":"臺指選擇權F505月 32400C","category":"TXO","currency":"TWD","delivery_month":"202605","delivery_date":"2026/05/20","strike_price":32400.0,"option_right":"C","underlying_kind":"I","underlying_code":"","unit":1.0,"multiplier":0,"limit_up":13400.0,"limit_down":5060.0,"reference":9230.0,"update_date":"2026/05/15","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":""}

```

**Indices**

In

```
curl "http://localhost:8080/api/v1/data/contracts/001?security_type=IND"

```

Out

```
{"security_type":"IND","exchange":"TSE","code":"001","symbol":"TSE001","name":"加權指數","category":"","currency":"TWD","delivery_month":"","delivery_date":"","strike_price":0.0,"option_right":"","underlying_kind":"","underlying_code":"","unit":0.0,"multiplier":0,"limit_up":0.0,"limit_down":0.0,"reference":0.0,"update_date":"","margin_trading_balance":0,"short_selling_balance":0,"day_trade":"","target_code":""}

```
