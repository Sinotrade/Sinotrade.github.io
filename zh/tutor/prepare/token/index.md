Shioaji 使用 API Key 作為登入方式，請依下列步驟申請。

## 金鑰

### 申請金鑰

1. 至理財網個人服務中的 [API 管理頁面](https://www.sinotrade.com.tw/newweb/PythonAPIKey/)

1. 點選新增API KEY

1. 利用手機或是信箱做雙因子驗證，驗證成功才能建立API KEY。

1. 進行API KEY的到期時間設定，以及勾選權限與帳戶，並且設定IP限制。

   權限勾選說明

   - 行情 / 資料 : 可否使用行情 / 資料相關 API
   - 帳務 : 可否使用帳務相關 API
   - 交易 : 可否使用交易相關 API
   - 正式環境 : 可否在正式環境中使用

   注意

   IP建議使用限制，能使該KEY安全性提高。

1. 新增成功會得到金鑰(API Key)與密鑰(Secret Key)

   注意

   - 請妥善保存您的鑰匙，勿將其透漏給任何人，以免造成資產損失。
   - Secret Key 僅在建立成功時取得，此後再無任何方法得到，請確保以保存

## 憑證

### 憑證下載

1. 至 [API 管理頁面](https://www.sinotrade.com.tw/newweb/PythonAPIKey/) 點選下載憑證按鈕

1. 下載完成請前往下載資料夾將憑證放置到 API 要讀取的路徑

1. 至[理財網](https://www.sinotrade.com.tw/CSCenter/CSCenter_13_3)下載 eleader

1. 登入 eleader

1. 從上方帳戶資料選取(3303)帳號資料設定

1. 點選「步驟說明」

1. 憑證操作步驟說明

### 確認密鑰與憑證

在您的 Python 專案根目錄新增 `.env` 檔案（跟 `pyproject.toml` 同層），內容如下：

```
SJ_API_KEY=<前面申請的 API Key>
SJ_SEC_KEY=<前面申請的 Secret Key>
SJ_CA_PATH=<前面設定的憑證路徑>
SJ_CA_PASSWD=<憑證密碼>

```

專案資料夾結構如下：

```
your-project
├── README.md
├── .env
├── pyproject.toml
├── src
│   └── your_package
│       └─ __init__.py
└── uv.lock

```

加入 python-dotenv 套件來將 .env 的金鑰與憑證載入環境變數：

```
uv add python-dotenv

```

在 `src/your_package/__init__.py` 中新增以下內容：

```
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    api = sj.Shioaji(simulation=True)
    api.login(
        api_key=os.environ["SJ_API_KEY"],
        secret_key=os.environ["SJ_SEC_KEY"],
        fetch_contract=False
    )
    api.activate_ca(
        ca_path=os.environ["SJ_CA_PATH"],
        ca_passwd=os.environ["SJ_CA_PASSWD"],
    )
    print("login and activate ca success")

```

在 `pyproject.toml` 中 `[project.scripts]` 新增 `main` 指令：

```
[project.scripts]
main = "your_package:main"

```

執行 `main` 指令：

```
uv run main

```

如果看到 `login and activate ca success` 代表成功登入模擬環境了。

在要執行 `shioaji server start` 的目錄底下建立 `.env` 檔，內容如下：

```
SJ_API_KEY=<前面申請的 API Key>
SJ_SEC_KEY=<前面申請的 Secret Key>
SJ_CA_PATH=<前面設定的憑證路徑>
SJ_CA_PASSWD=<憑證密碼>

```

啟動 server，會自動讀取 `.env` 完成登入與憑證載入：

```
shioaji server start

```

確認狀態：

```
shioaji server check

```

成功的話會顯示模擬模式與已登入帳戶資訊。

### 啟用憑證

下單前必須啟用憑證。若您僅使用模擬模式，可略過本節。

呼叫 `api.activate_ca()` 載入並啟用憑證：

```
result = api.activate_ca(
    ca_path="/path/to/your/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="YOUR_PERSON_ID",
)
print(result)
# True

```

Windows 路徑

在 Windows 系統中，若路徑使用反斜線 `\` 分隔，請改為斜線 `/` 或雙反斜線 `\\`。

確認憑證效期：

```
api.get_ca_expiretime("YOUR_PERSON_ID")

```

`shioaji server start` 會自動讀取 `.env` 中的 `SJ_CA_PATH` 與 `SJ_CA_PASSWD` 完成啟用，無需另外呼叫。

使用 CLI 確認憑證效期：

```
shioaji auth ca-expiretime --person-id YOUR_PERSON_ID

```

回應：

```
person_id: YOUR_PERSON_ID
expire_time: 2026-09-13T15:59:59

```

或透過 HTTP：

```
curl "http://localhost:8080/api/v1/auth/ca_expiretime?person_id=YOUR_PERSON_ID"

```

回應：

```
{"person_id":"YOUR_PERSON_ID","expire_time":"2026-09-13T15:59:59"}

```

接著如果你還有沒有進行 API 簽署的話，請前往下一章進行簽署與測試審核。
