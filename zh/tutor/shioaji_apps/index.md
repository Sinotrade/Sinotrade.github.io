# 自訂應用

自訂應用（Custom Apps）讓你用任何前端框架（React、Vue、Svelte⋯）打造自己的交易介面——行情看板、下單面板或內部工作台——透過本機 `shioaji server` 的 HTTP API 與 SSE 串流取得資料與交易能力。開發完成後 build 上傳，server 會直接在 `/apps/<name>/` 提供服務，不需要另外架設網頁伺服器。

**開發階段**——前端跑在自己的 dev server，API 請求由 proxy 轉給 shioaji server：

```
瀏覽器 ──▶ 前端 dev server (:5173) ── proxy /api ──▶ shioaji server (:8080)

```

**部署階段**——build 上傳後，前端頁面和 API 都由 shioaji server 提供：

```
瀏覽器 ──▶ shioaji server (:8080)
            ├─ /apps/my-app/    你的前端頁面
            ├─ /api/v1          行情、下單、帳務 API
            └─ /api/v1/stream   SSE 即時串流

```

## 建立專案

使用 [`@sinotrade/create-shioaji-app`](https://www.npmjs.com/package/@sinotrade/create-shioaji-app) 模板建立新專案（需要 Node.js 18+）：

```
npm create @sinotrade/shioaji-app@latest

```

依提示輸入專案名稱即可建立。也可以直接指定名稱、接受預設選項：

```
npm create @sinotrade/shioaji-app@latest my-app -- -y

```

### 模板內容

建立出來的專案可以直接運作：dev server 已將 `/api` proxy 到 `http://localhost:8080`，並內建三個串接範例——server 健康狀態徽章、商品檔查詢、歷史 tick 查詢。

```
my-app/
├── public/            靜態資源
├── src/
│   ├── components/    UI 元件（健康徽章、商品卡片、tick 表格、主題切換）
│   ├── hooks/         React hooks
│   ├── lib/           API 呼叫、型別定義、工具函式
│   ├── App.tsx        頁面組合——從這裡開始改
│   ├── main.tsx       React 進入點
│   └── theme.css.ts   主題 tokens（深淺色）
├── index.html
├── vite.config.ts     dev proxy 與 base path 設定
└── package.json

```

技術棧為 React 19 + TypeScript + Vite 8，樣式使用 Vanilla Extract（零執行期 CSS-in-JS），含深淺色主題切換。

## 開發

先啟動 shioaji server（開發與測試建議使用[模擬模式](../simulation/)）：

```
shioaji server start

```

再啟動前端 dev server（模板已將 `/api` proxy 到 `http://localhost:8080`，不需額外設定）：

```
pnpm dev

```

開發時常用的入口：

| 入口 | 說明 | | --- | --- | | `http://127.0.0.1:8080/docs` | OpenAPI 文件，所有 HTTP 端點的請求與回應格式 | | `http://127.0.0.1:8080/api/v1` | HTTP API（行情、下單、帳務） | | `http://127.0.0.1:8080/api/v1/stream/*` | SSE 即時串流（行情、委託回報） |

各功能的請求格式與範例請見對應章節：[行情訂閱](../market_data/streaming/stocks/)、[下單](../order/Stock/)、[帳務](../accounting/account_balance/)。

## 部署到 shioaji server

App 開發完成後，分三步部署。

### Step 1：以 `/apps/<name>/` 為 base path 打包

上傳後 App 會掛在 `/apps/<name>/` 底下，build 時需要把資源路徑指過去（模板的 `vite.config.ts` 已支援 `VITE_BASE` 環境變數）：

In

```
VITE_BASE=/apps/my-app/ pnpm build

```

Out

```
vite v8.0.16 building client environment for production...
✓ 40 modules transformed.
dist/index.html                   0.52 kB │ gzip:  0.30 kB
dist/assets/index-D5gZ3quM.css    4.57 kB │ gzip:  1.14 kB
dist/assets/index-CSAkhLhy.js   197.57 kB │ gzip: 62.29 kB
✓ built in 504ms

```

### Step 2：上傳

In

```
shioaji apps upload --name my-app --dir dist

```

Out

```
name: "my-app"
files[4]: "my-app/index.html","my-app/shioaji-logo.png","my-app/assets/index-CSAkhLhy.js","my-app/assets/index-D5gZ3quM.css"

```

`--dir` 會遞迴上傳整個目錄並保留子目錄結構（如上方的 `assets/`）。也可以改用 `--file` 上傳個別檔案（可重複指定，與 `--dir` 互斥）。

In

```
curl -X POST http://127.0.0.1:8080/api/v1/apps/my-app \
  -F "files=@dist/index.html" \
  -F "files=@dist/assets/index-CSAkhLhy.js;filename=assets/index-CSAkhLhy.js" \
  -F "files=@dist/assets/index-D5gZ3quM.css;filename=assets/index-D5gZ3quM.css"

```

Out

```
{"name":"my-app","files":["my-app/index.html","my-app/assets/index-CSAkhLhy.js","my-app/assets/index-D5gZ3quM.css"]}

```

1. 開啟 `http://127.0.0.1:8080/`
1. 找到 **Custom Apps** 卡片
1. 以 **Folder** 模式選擇 build 出來的 `dist` 資料夾（或切換 **File** 模式選個別檔案）
1. 輸入 App 名稱後按 **Upload**

限制與行為

- 單一 App 上傳總大小上限 **50MB**（multipart 上傳）
- 上傳檔案的相對路徑會被保留，App 以 `index.html` 為進入點
- `/apps/` 為公開路徑，瀏覽器存取不需認證

### Step 3：開啟

```
http://127.0.0.1:8080/apps/my-app/

```

## 管理已上傳的 Apps

In - 列出

```
shioaji apps list

```

Out

```
apps[1]: "my-app"

```

In - 刪除

```
shioaji apps delete --name my-app

```

Out

```
deleted: "my-app"

```

In - 列出

```
curl http://127.0.0.1:8080/api/v1/apps

```

Out

```
{"apps":["my-app"]}

```

In - 刪除

```
curl -X DELETE http://127.0.0.1:8080/api/v1/apps/my-app

```

Out

```
{"deleted":"my-app"}

```

## 安全提醒

正式環境會送出真實委託

前端 App 透過 HTTP API 可以直接下單。開發與測試請使用[模擬模式](../simulation/)，並在 UI 中明確顯示目前環境（可由 `GET /api/v1/info` 的 `simulation` 欄位判斷）。

- 不要把 API Key、Secret Key 或憑證放進前端程式碼或 repo——登入由 shioaji server 的 `.env` 處理，前端不需要碰金鑰
- 下單操作要有確認步驟或鎖定機制，避免誤觸
- SSE 斷線重連後，記得重新訂閱需要的行情

## 範例專案：shioaji-pro-app

[shioaji-pro-app](https://github.com/Sinotrade/shioaji-pro-app) 這個範例示範了用本頁介紹的 HTTP API 與 SSE，能完成一個怎樣的交易介面：

- 即時 K 線：`data/kbars` 取歷史，`stream/data` SSE 即時更新
- 委託回報：`auth/subscribe_trade` 訂閱後接 `stream/data/order_event`
- 點圖下單／拖曳改價：`order/place_order`、`order/update_price`

免責聲明

- 本專案為開源範例，**並非 Shioaji 官方產品**。
- 軟體依「現狀」（AS IS）提供，不附任何明示或默示之保證；可能存在錯誤、延遲或非預期行為，下單與自動化功能可能因程式缺陷、網路中斷或行情延遲而失效，使用前請先於模擬環境充分測試。
- 本軟體不構成任何投資建議，所有交易決策與損失由使用者自行承擔；專案作者、貢獻者與永豐金證券對任何損害概不負責。市場有風險，交易請謹慎。
