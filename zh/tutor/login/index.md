使用Shioaji必須擁有永豐金帳戶。若你還沒有擁有永豐金帳戶，可詳見[開戶](../prepare/open_account/)。登入方式使用 API Key 作為，申請可參見 [金鑰與憑證申請](../prepare/token/)。

In

```
import shioaji as sj
api = sj.Shioaji(simulation=False)  # 是否進入模擬模式
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    subscribe_trade=True
)

```

Out

```
# 與 Solace 行情伺服器連線建立成功
Response Code: 0 | Event Code: 0 | Info: host '<IP>:80', hostname '<IP>:80' IP <IP>:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up
Response Code: 200 | Event Code: 18 | Info: #P2P/v:<...> | Event: Session Property modification ok

# 登入後取得的帳戶列表
[FutureAccount(person_id='PERSON_ID', broker_id='BROKER_ID', account_id='ACCOUNT_ID', signed=true, username='USERNAME'),
 StockAccount(person_id='PERSON_ID', broker_id='BROKER_ID', account_id='ACCOUNT_ID', signed=true, username='USERNAME'),
 IntlAccount(person_id='PERSON_ID', broker_id='BROKER_ID', account_id='ACCOUNT_ID', signed=false, username='USERNAME')]

```

Login Arguments

```
api_key (str): API 金鑰
secret_key (str): 密鑰
subscribe_trade (bool): 是否訂閱委託/成交回報 (預設值: True)
receive_window (int): 登入動作有效執行時間 (預設值: 30,000 毫秒)

```

注意

若收到 **Sign data is timeout**，表示登入超過有效執行時間，可能原因：

- 系統時間與伺服器時間相差過大 → 校準系統時間
- 登入執行時間超過 `receive_window` → 將 `receive_window` 調高（預設 30,000 ms)

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
INFO shioaji::api::api_v1::contracts::api: Fetched 41809 STK contracts (9 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 2503 FUT contracts (1 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 9031 OPT contracts (2 pages)
INFO shioaji::server: Loaded 53470 contracts

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

## 帳號

我們支援三種類型的帳號：

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

In

```
curl http://localhost:8080/api/v1/auth/accounts

```

Out

```
[{"account_type":"F","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_1","account_id":"ACCOUNT_ID_1","signed":true,"username":"USERNAME_1"},{"account_type":"H","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_2","account_id":"ACCOUNT_ID_2","signed":false,"username":"USERNAME_1"},{"account_type":"S","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_2","account_id":"ACCOUNT_ID_3","signed":true,"username":"USERNAME_1"}]

```

注意

- 若 `signed` 在帳號列表中未出現，代表該帳號尚未簽署或尚未完成在測試模式中的測試報告。可參見 [API 簽署](../prepare/terms/)。

-->

#### 預設&設定帳號

##### 預設帳號

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

##### 設定帳號

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

server 啟動時自動挑列表中第一個證券 / 期貨帳號作為預設帳號；下單時 `--account` 不指定即使用預設；若要指定帳號，請帶 `--account BROKER-ACCOUNT`。

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
