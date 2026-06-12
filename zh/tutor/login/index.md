登入必須擁有永豐金帳戶。若你還沒有擁有永豐金帳戶，可詳見[開戶](../prepare/open_account/)。

## 登入

API Key

Shioaji 使用 API Key 作為登入方式，申請可參見 [金鑰與憑證申請](../prepare/token/)。

In

```
import shioaji as sj
api = sj.Shioaji(simulation=False)  # 是否進入模擬模式
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY"
)

```

Out

```
# 與 Solace 行情伺服器連線建立成功
Response Code: 0 | Event Code: 0 | Info: host '<IP>:80', hostname '<IP>:80' IP <IP>:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up

# 登入後取得的帳戶列表
[FutureAccount(person_id='', broker_id='', account_id='', signed=true, username=''),
 IntlAccount(person_id='', broker_id='', account_id='', signed=false, username=''),
 StockAccount(person_id='', broker_id='', account_id='', signed=true, username='')]

```

Login Arguments

```
api_key (str): API 金鑰
secret_key (str): 密鑰
fetch_contract (bool): 是否從快取中讀取商品檔或從伺服器下載商品檔 (預設值: True)
contracts_timeout (int): 獲取商品檔 timeout (預設值: 0 ms)
contracts_cb (typing.Callable): 獲取商品檔 callback (預設值: None)
subscribe_trade (bool): 是否訂閱委託/成交回報 (預設值: True)
receive_window (int): 登入動作有效執行時間 (預設值: 30,000 毫秒)

```

注意

若收到 **Sign data is timeout**，表示登入超過有效執行時間，可能原因：

- 系統時間與伺服器時間相差過大 → 校準系統時間
- 登入執行時間超過 `receive_window` → 將 `receive_window` 調高（預設 30,000 ms)

**獲取商品檔 Callback**

可使用 `contracts_cb` 監看商品檔載入進度：

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    contracts_cb=lambda security_type: print(f"{repr(security_type)} fetch done.")
)

```

Out

```
[
    FutureAccount(person_id='', broker_id='', account_id='', signed=True, username=''),
    StockAccount(person_id='', broker_id='', account_id='', signed=True, username='')
]
<SecurityType.Index: 'IND'> fetch done.
<SecurityType.Future: 'FUT'> fetch done.
<SecurityType.Option: 'OPT'> fetch done.
<SecurityType.Stock: 'STK'> fetch done.

```

In

```
# .env（放在執行目錄）應包含：
SJ_API_KEY=YOUR_API_KEY                # 請修改此處
SJ_SEC_KEY=YOUR_SECRET_KEY             # 請修改此處
SJ_PRODUCTION=true                     # 是否進入正式模式

# 啟動 server（自動讀取 .env，完成登入）
shioaji server start

```

Out

```
# 讀取 .env 中的 API 金鑰與設定
Loaded environment variables from .env file
INFO shioaji::cli::server: Starting Shioaji API Server...

# 首次登入（無 cached token）
INFO shioaji::api::api_v1::auth::token_login: No cached token available, performing new login
INFO shioaji::api::api_v1::auth::token_login: Stored new token in slot 1

# 載入商品檔進度
INFO shioaji::api::api_v1::contracts::api: Fetched 127 IND contracts (1 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 42787 STK contracts (9 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 2489 FUT contracts (1 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 8653 OPT contracts (2 pages)
INFO shioaji::server: Loaded 54056 contracts

# CA 憑證載入
INFO shioaji::server: CA certificate activated successfully

# 認證成功，登入完成
INFO shioaji::cli::server: Successfully authenticated with Shioaji API

# HTTP server 啟動完成，可以開始接收請求
INFO shioaji::cli::server: 🚀 Shioaji API Server is running on http://127.0.0.1:8080
INFO salvo_core::server: listening [HTTP/1.1] on http://127.0.0.1:8080

```

Login Arguments

```
SJ_API_KEY      API 金鑰（必填）
SJ_SEC_KEY      密鑰（必填）
SJ_PRODUCTION   是否進入正式模式 (預設值: false)

```

注意

若收到 **Sign data is timeout**，表示登入超過有效執行時間。請校準系統時間。

### 訂閱委託/成交回報

我們提供 2 個方式讓您可以調整訂閱委託/成交回報。首先是於 `login` 的參數 `subscribe_trade`，預設值為 `True`，會自動為您訂閱所有帳號的委託/成交回報。

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    subscribe_trade=True
)

```

另一個方式是，對特定帳號使用 API `subscribe_trade` 及 `unsubscribe_trade`，即可訂閱或取消訂閱委託/成交回報。

subscribe trade

```
api.subscribe_trade(account)

```

unsubscribe trade

```
api.unsubscribe_trade(account)

```

server 啟動時不自動訂閱，需逐帳號動態訂閱。

subscribe trade

```
shioaji auth subscribe-trade --account-type F

```

unsubscribe trade

```
shioaji auth unsubscribe-trade --account-type F

```

Parameters

```
--account-type: 選填，S（證券，預設）或 F（期貨/選擇權）
--account:      選填，BROKER_ID-ACCOUNT_ID 格式；未填時使用該類型的預設帳號

```

Out

```
account:
  account_type: F
  person_id: YOUR_PERSON_ID
  broker_id: F002000
  account_id: "YOUR_ACCOUNT_ID"
  signed: true
  username: ""
subscribe_trade: true
ts: 20260612021106

```

注意

`subscribe-trade` 只負責向 server 登記訂閱，執行完即結束。實際接收委託/成交回報請使用 `shioaji order events`（SSE 串流，Ctrl+C 停止），詳見[委託回報](../callback/orderdeal_event/)。

server 啟動時不自動訂閱，需逐帳號動態訂閱。

subscribe trade

```
curl -X POST http://localhost:8080/api/v1/auth/subscribe_trade \
  -H "Content-Type: application/json" \
  -d '{"broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

unsubscribe trade

```
curl -X POST http://localhost:8080/api/v1/auth/unsubscribe_trade \
  -H "Content-Type: application/json" \
  -d '{"broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

## 帳號

依 `account_type` 區分為三種：

- `S`：證券帳號（`StockAccount`）
- `F`：期貨帳號（`FutureAccount`）
- `H`：複委託帳號（註：shioaji 尚未支援 API 下單）

#### 帳號列表

In

```
accounts = api.list_accounts()
accounts

```

Out

```
[
    FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1'),
    IntlAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', signed=False, username='USERNAME_1'),
    StockAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_3', signed=True, username='USERNAME_1')
]

```

- 若 `signed` 在帳號列表中未出現，如同 `ACCOUNT_ID_2`，代表該帳號尚未簽署或尚未完成在測試模式中的測試報告。可參見 [API 簽署](../prepare/terms/)。

#### 預設帳號

In

```
print(api.stock_account)
print(api.futopt_account)

```

Out

```
StockAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_3', signed=True, username='USERNAME_1')
FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1')

```

#### 設定預設帳號

In

```
# 預設的期貨帳號從 ACCOUNT_ID_1 轉換成 ACCOUNT_ID_2
api.set_default_account(accounts[1])
print(api.futopt_account)

```

Out

```
FutureAccount(person_id='PERSON_ID_2', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', username='USERNAME_2')

```

**帳號列表**

In

```
shioaji auth accounts

```

Out

```
[3]{account_type,person_id,broker_id,account_id,signed,username}:
  F,PERSON_ID_1,BROKER_ID_1,"ACCOUNT_ID_1",true,USERNAME_1
  H,PERSON_ID_1,BROKER_ID_2,"ACCOUNT_ID_2",false,USERNAME_1
  S,PERSON_ID_1,BROKER_ID_2,"ACCOUNT_ID_3",true,USERNAME_1

```

- 若 `signed` 在帳號列表中未出現，代表該帳號尚未簽署或尚未完成在測試模式中的測試報告。可參見 [API 簽署](../prepare/terms/)。

**預設帳號**

server 啟動時自動挑列表中第一個證券 / 期貨帳號作為預設帳號；下單時 `--account` 不指定即使用預設；若要指定帳號，請帶 `--account BROKER-ACCOUNT`。

**帳號列表**

In

```
curl http://localhost:8080/api/v1/auth/accounts

```

Out

```
[{"account_type":"F","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_1","account_id":"ACCOUNT_ID_1","signed":true,"username":"USERNAME_1"},{"account_type":"H","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_2","account_id":"ACCOUNT_ID_2","signed":false,"username":"USERNAME_1"},{"account_type":"S","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_2","account_id":"ACCOUNT_ID_3","signed":true,"username":"USERNAME_1"}]

```

- 若 `signed` 在帳號列表中未出現，代表該帳號尚未簽署或尚未完成在測試模式中的測試報告。可參見 [API 簽署](../prepare/terms/)。

**預設帳號**

server 啟動時自動挑列表中第一個證券 / 期貨帳號作為預設帳號；下單 request 中 `account` 不帶 `broker_id` / `account_id` 即使用預設；若要指定帳號，請帶 `broker_id` + `account_id`。

## 登出

登出功能將關閉客戶端及服務端之間的連接。為了提供優質的服務，我們從 2021/08/06 開始[限制](../limit/)連線數。在不使用的時候終止程式是一個良好的習慣。

In

```
api.logout()

```

Out

```
True

```

停止 `shioaji server start` 啟動的 daemon：

```
shioaji server stop

```
