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

## 檢查伺服器狀態

伺服器啟動後，可隨時檢查 daemon 與串流的健康狀態。

In

```
shioaji server status --streams

```

Out

```
running: true
pid: 38082
port: 8080
socket_path: "/Users/your_name/.shioaji/server-8080.sock"
healthy: true
simulation: false
stream_receivers: "Market data receivers are available for tick, bidask, quote, and order event data"
stream_status:
  active_connections: 0
  timestamp: 2026-06-12T05:48:05.561238+00:00
  status: healthy

```

加上 `--streams` 會額外查詢串流診斷資訊（`stream_receivers` 與 `stream_status`），可用來確認推播接收狀況。

屬性

```
running (bool):           daemon 是否在執行中
pid (int):                daemon 的 process ID
port (int):               HTTP 服務埠
socket_path (str):        daemon 控制 socket 路徑
healthy (bool):           daemon 是否健康
simulation (bool):        是否為模擬模式（對應 .env 的 SJ_PRODUCTION）
stream_receivers (str):   串流接收器說明
active_connections (int): 目前掛在 SSE 串流上的 client 連線數（行情與委託回報串流皆計入）；
                          訂閱了卻收不到推播時，先檢查這裡是否為 0

```

**版本與模式**

In

```
curl http://localhost:8080/api/v1/info

```

Out

```
{"name":"Shioaji API Server","version":"1.5.3","description":"SinoPac Shioaji Cross-Platform Trading API HTTP Adaptor","protocols":["HTTP"],"simulation":false}

```

屬性

```
name (str):        服務名稱
version (str):     伺服器版本
description (str): 服務說明
protocols (list):  支援的協定
simulation (bool): 是否為模擬模式（對應 .env 的 SJ_PRODUCTION）

```

**串流連線狀態**

In

```
curl http://localhost:8080/api/v1/stream/status

```

Out

```
{"active_connections":0,"timestamp":"2026-06-12T05:53:13.517649+00:00","status":"healthy"}

```

屬性

```
active_connections (int): 目前掛在 SSE 串流上的 client 連線數（行情與委託回報串流皆計入）；
                          訂閱了卻收不到推播時，先檢查這裡是否為 0
timestamp (str):          查詢當下時間
status (str):             串流服務狀態

```

如果已經開好戶可以跳過下一章直接前往 [金鑰與憑證申請](../../tutor/prepare/token/) 取得 API Key 與憑證。
