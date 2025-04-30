在版本1.0之後，我們將使用Token作為我們的登入方式。請根據下列的步驟進行申請及使用。

## 申請金鑰

1. 至[理財網](https://www.sinotrade.com.tw/newweb/PythonAPIKey/)個人服務中的API管理頁面

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

## 憑證下載

1. 點選下載憑證按鈕
1. 下載完成請前往下載資料夾將憑證放置到 API 要讀取的路徑

## 確認密鑰與憑證

延續前面開好的專案 `sj-trading`，在專案資料夾中新增 `.env` 檔案，並且新增以下內容

`.env` 檔案內容如下

```
API_KEY=<前面申請的API Key>
SECRET_KEY=<前面申請的Secret Key>
CA_CERT_PATH=<前面設定的憑證路徑>
CA_PASSWORD=<憑證密碼>

```

專案資料夾結構如下

```
sj-trading
├── README.md
├── .env
├── pyproject.toml
├── src
│   └── sj_trading
│       └─ __init__.py
└── uv.lock

```

加入 python-dotenv 套件來將 .env 的金鑰與憑證載入環境變數

```
uv add python-dotenv

```

在 `src/sj_trading/__init__.py` 中新增以下內容

```
import os
from dotenv import load_dotenv

load_dotenv()

def main():
    api = sj.Shioaji(simulation=True)
    api.login(
        api_key=os.environ["API_KEY"],
        secret_key=os.environ["SECRET_KEY"],
        fetch_contract=False
    )
    api.activate_ca(
        ca_path=os.environ["CA_CERT_PATH"],
        ca_passwd=os.environ["CA_PASSWORD"],
    )
    print("login and activate ca success")

```

在 `pyproject.toml` 中 `[project.scripts]` 新增 `main` 指令

```
[project.scripts]
main = "sj_trading:main"

```

執行 `main` 指令

```
uv run main

```

如果看到 `login and activate ca success` 代表成功登入模擬環境了

接著如果你還有沒有進行 API 簽署的話，請前往下一章進行簽署與測試審核。
