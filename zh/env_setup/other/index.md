# 環境設定

本頁針對使用 CLI 或透過 HTTP 連線的開發者（JavaScript / Go / C++ / C# / Rust / Java 等）。 Python 使用者請參考 [Python 使用者](../python/) 頁。

## 系統需求

- 作業系統：Windows、MacOS 或 Linux 之 64 位元版本
- 使用者需要具備永豐金證券帳戶，並取得 Shioaji API 權限。

## 安裝 shioaji 命令

需要 `shioaji` 命令來啟動 HTTP server。

```
uv tool install shioaji

```

Linux / MacOS：

```
curl -fsSL https://raw.githubusercontent.com/sinotrade/shioaji/main/install.sh | sh

```

Windows (PowerShell)：

```
irm https://raw.githubusercontent.com/sinotrade/shioaji/main/install.ps1 | iex

```

## 建立 .env

在要執行 `shioaji server start` 的目錄底下建立 `.env` 檔，內容如下：

```
# 必填
SJ_API_KEY=YOUR_API_KEY
SJ_SEC_KEY=YOUR_SECRET_KEY

# 啟用憑證（正式環境下單必須）
SJ_CA_PATH=your/ca/path/Sinopac.pfx
SJ_CA_PASSWD=YOUR_CA_PASSWORD

# 環境設置（設為 true 啟用正式環境；不設或設為 false 則為模擬模式）
SJ_PRODUCTION=false

```

shioaji server 啟動時會自動讀取此檔，完成登入與憑證載入。

如果已經開好戶可以跳過下一章直接前往 [金鑰與憑證申請](../../tutor/prepare/token/) 取得 API Key 與憑證。
