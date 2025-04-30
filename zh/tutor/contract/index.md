商品檔將在很多地方被使用，例如下單、訂閱行情...等。

### 取得商品檔

下方提供兩種方法取得商品檔:

- 方法1: [登入](../../tutor/login)成功後，將開始下載商品檔。但這個下載過程將不會影響其他的操作。若您想了解是否下載完成，可利用`Contracts.status`去得到下載狀態。`contracts_timeout` 設定為10000，它將等待10秒下載商品檔。

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

- 方法2: 若不想在登入時下載商品檔，將`fetch_contract` 設定為`False`。利用 `fetch_contracts` 下載商品檔

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

### 商品檔資訊

目前我們所提供的商品包含:證券、期貨、選擇權以及指數。可從下列方法更詳細得到我們所提供的商品。

In

```
api.Contracts

```

Out

```
Contracts(Indexs=(OTC, TSE), Stocks=(OES, OTC, TSE), Futures=(BRF, CAF, CBF, CCF, CDF, CEF, CFF, CGF, CHF, CJF, CK1, CKF, CLF, CM1, CMF, CNF, CQF, CRF, CSF, CU1, CUF, CWF, CXF, CYF, CZ1, CZF, DCF, DD1, DDF, DEF, DFF, DGF, DHF, DIF, DJF, DKF, DLF, DNF, DOF, DPF, DQF, DSF, DUF, DVF, DWF, DXF, DYF, DZF, EEF, EGF, EHF, EMF, EPF, ERF, EXF, EY1, EYF, FEF, FFF, FGF, FKF, FQF, FRF, FTF, FVF, FWF, FXF, FYF, FZF, G2F, GAF, GCF, GDF, GHF, GIF, GJF, GLF, GMF, GNF, GOF, GRF, GTF, GUF, GWF, GXF, GZF, HAF, HBF, HCF, HHF, HIF, HLF, HOF, HS1, HSF, HY1, HYF, IA1, IAF, IHF, IIF, IJF, IMF, IOF, IPF, IQF, IRF, ITF, IXF, IYF, IZF, JBF, JFF, JNF, JPF, JSF, JWF, JZF, KAF, KB1, KBF, KCF, KDF, KFF, KGF, KIF, KKF, KLF, KOF, KPF, KSF, KWF, LBF, LCF, LE1, LEF, LIF, LMF, LOF, LQF, LRF, LTF, LUF, LVF, LWF, LXF, LYF, MAF, MBF, MCF, MJF, MKF, MPF, MQF, MVF, MX1, MXF, MYF, NAF, NBF, NCF, NDF, NEF, NGF, NHF, NIF, NJF, NLF, NMF, NNF, NOF, NQF, NSF, NUF, NVF, NWF, NXF, NYF, NZF, OAF, OBF, OCF, ODF, OEF, OGF, OHF, OJF, OKF, OLF, OMF, OOF, OPF, OQF, ORF, OS1, OSF, OTF, OUF, OVF, OWF, OXF, OYF, OZF, PAF, PBF, PCF, PDF, PEF, PFF, PGF, PHF, PIF, PJF, PKF, PLF, PMF, PNF, POF, PPF, PQF, RHF, RTF, SPF, T5F, TGF, TJF, TXF, UDF, UNF, XAF, XBF, XEF, XIF, XJF), Options=(CAO, CBO, CCO, CDO, CEO, CFO, CGO, CHO, CJO, CKO, CLO, CMO, CNO, CQO, CRO, CSO, CXO, CZO, DCO, DEO, DFO, DGO, DHO, DJO, DKO, DLO, DNO, DOO, DPO, DQO, DSO, DUO, DVO, DWO, DXO, GIO, GXO, HCO, IJO, LOO, NYA, NYO, NZO, OAO, OBO, OCO, OJO, OKO, OOO, OZO, RHO, RTO, TEO, TFO, TGO, TX1, TXO))

```

#### 證券

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
exchange (Exchange): 交易所 {OES, OTC, TSE ...等}
code (str): 商品代碼
symbol (str): 符號
name (str): 商品名稱
category (str): 類別
unit (int): 單位
limit_up (float): 漲停價
limit_down (float): 跌停價
reference (float): 參考價
update_date (str): 更新日期
margin_trading_balance (int): 融資餘額
short_selling_balance (int): 融券餘額
day_trade (DayTrade): 可否當沖 {Yes, No, OnlyBuy}

```

#### 期貨

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
code (str): 商品代碼
symbol (str): 符號
name (str): 商品名稱
category (str): 類別
delivery_month (str): 交割月份
delivery_date (str): 結算日
underlying_kind (str): 標的類型
unit (int): 單位
limit_up (float): 漲停價
limit_down (float): 跌停價
reference (float): 參考價
update_date (str): 更新時間

```

#### 選擇權

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
code (str): 商品代碼
symbol (str): 符號
name (str): 商品名稱
category (str): 類型
delivery_month (str): 交割月份
delivery_date (str): 交割日期
strike_price (int or float): 屢約價
option_right (OptionRight): 買賣權別
underlying_kind (str): 標的類型
limit_up (float): 漲停價
limit_down (float): 跌停價
reference (float): 參考價
update_date (str): 更新時間

```

#### 指數

`Indexs`物件顯示所有可以支援的指數商品，其他類別亦然。指數類的商品不支援下單，但允許訂閱行情。

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
exchange (Exchange): 交易所{OES, OTC, TSE ...等}
code (str): 商品代碼
symbol (str): 符號
name (str): 商品名稱

```
