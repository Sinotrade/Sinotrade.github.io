# 環境設定

## 系統需求

在開始之前，請確保你的系統符合以下需求：

- 作業系統：Windows、MacOS 或 Linux 之 64 位元版本
- Python 版本：3.8 以上
- 使用者需要具備永豐金證券帳戶，並取得 Shioaji API 權限。

## 安裝 Python 環境

首先，你需要在系統上安裝 Python，推薦使用 uv ，本篇教學範例將使用 uv 作為 Python 及專案環境管理工具，並在專案中使用 Shioaji API。

延伸筆記

[`uv`](https://docs.astral.sh/uv/) 是跨平台管理 python 環境及專案環境管理工具的最佳解決方案。

### 安裝 uv

指令

```
curl -LsSf https://astral.sh/uv/install.sh | sh

```

```
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

```

更多安裝與使用方式請參考 [uv 官方文件](https://docs.astral.sh/uv/)

## 創建專案環境

首先，先創建一個名為 `sj-trading` 的專案

```
uv init sj-trading --package --app --vcs git
cd sj-trading

```

創建出來的專案路徑如下

```
sj-trading
├── README.md
├── pyproject.toml
└── src
    └── sj_trading
        └── __init__.py

```

加入 shioaji 套件到專案中

```
uv add shioaji

```

接著打開 `pyproject.toml` 檔案將會看到以下內容

```
[project]
name = "sj-trading"
version = "0.1.0"
description = "Shioaji Trading"
readme = "README.md"
requires-python = ">=3.12"
dependencies = [
    "shioaji>=1.2.5",
]

[project.scripts]
hello = "sj_trading:hello"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

```

專案中有一個 `hello` 指令，代表我們已經成功可以執行 hello 指令

執行 hello 指令

```
uv run hello

```

輸出

```
Hello from sj-trading!

```

接著打開 `src/sj_trading/__init__.py` 檔案，將以下內容複製貼上

```
import shioaji as sj

def hello():
    get_shioaji_client()


def get_shioaji_client() -> sj.Shioaji:
    api =  sj.Shioaji()
    print("Shioaji API created")
    return api

```

執行指令

```
uv run hello

```

輸出

```
Shioaji API created

```

這邊最基本的環境安裝就完成可以開始使用了。

### 使用 Jupyter 環境（可選）

加入 ipykernel 到專案的開發依賴

```
uv add --dev ipykernel

```

將專案使用環境加入到 Jupyter 的 kernel

```
uv run ipython kernel install --user --name=sj-trading

```

啟動 Jupyter

```
uv run --with jupyter jupyter lab

```

在 jupyter 中創建 dev.ipynb 檔案，就可以選擇 `sj-trading` 的 kernel 來執行指令

剛剛我們寫好的 `hello` 指令就可以在這邊執行了

如果已經開好戶可以跳過下一章直接前往 [金鑰與憑證申請](../../tutor/prepare/token/) 取得 API Key 與憑證。
