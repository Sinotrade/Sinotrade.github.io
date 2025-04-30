首先，我們延伸前面在環境建立章節使用 `uv` 建立的專案 `sj-trading` 來新增測試流程的部分。

這部分完整專案的程式碼可以參考 [sj-trading https://github.com/Sinotrade/sj-trading-demo](https://github.com/Sinotrade/sj-trading-demo)。

可以使用 `git` 將整個環境複製到本地就可以直接使用

下載專案

```
git clone https://github.com/Sinotrade/sj-trading-demo.git
cd sj-trading-demo

```

下面我們將一步一步的介紹如何新增測試流程。

### Shioaji 版本

獲取 Shioaji 版本資訊

新增版本資訊

在 `src/sj_trading/__init__.py` 新增

```
def show_version() -> str:
    print(f"Shioaji Version: {sj.__version__}")
    return sj.__version__

```

新增版本指令到專案

在 `pyproject.toml` 新增 `version` 的指令

```
[project.scripts]
version = "sj_trading:show_version"

```

執行 `uv run version` 就可以看到 Shioaji 的版本資訊

```
Shioaji Version: 1.2.0

```

### 現貨下單測試

新增下單測試檔案

在 `src/sj_trading` 新增檔案 `testing_flow.py`

新增以下內容

```
import shioaji as sj
from shioaji.constant import Action, StockPriceType, OrderType
import os

def testing_stock_ordering():
    # 測試環境登入
    api = sj.Shioaji(simulation=True)
    accounts = api.login(
        api_key=os.environ["API_KEY"],
        secret_key=os.environ["SECRET_KEY"],
    )
    # 顯示所有可用的帳戶
    print(f"Available accounts: {accounts}")
    api.activate_ca(
        ca_path=os.environ["CA_CERT_PATH"],
        ca_passwd=os.environ["CA_PASSWORD"],
    )

    # 準備下單的 Contract
    # 使用 2890 永豐金為例
    contract = api.Contracts.Stocks["2890"]
    print(f"Contract: {contract}")

    # 建立委託下單的 Order
    order = sj.order.StockOrder(
        action=Action.Buy, # 買進
        price=contract.reference, # 以平盤價買進
        quantity=1, # 下單數量
        price_type=StockPriceType.LMT, # 限價單
        order_type=OrderType.ROD, # 當日有效單
        account=api.stock_account, # 使用預設的帳戶
    )
    print(f"Order: {order}")

    # 送出委託單
    trade = api.place_order(contract=contract, order=order)
    print(f"Trade: {trade}")

    # 更新狀態
    api.update_status()
    print(f"Status: {trade.status}")

```

新增測試下單指令到專案

在 `pyproject.toml` 新增 `stock_testing` 的指令

```
[project.scripts]
stock_testing = "sj_trading.testing_flow:testing_stock_ordering"

```

執行 `uv run stock_testing` 就開始進行測試下單了

### 期貨下單測試

新增期貨下單測試

在 `src/sj_trading/testing_flow.py` 新增以下內容

```
from shioaji.constant import (
    FuturesPriceType,
    FuturesOCType,
)

def testing_futures_ordering():
    # 測試環境登入
    api = sj.Shioaji(simulation=True)
    accounts = api.login(
        api_key=os.environ["API_KEY"],
        secret_key=os.environ["SECRET_KEY"],
    )
    # 顯示所有可用的帳戶
    print(f"Available accounts: {accounts}")
    api.activate_ca(
        ca_path=os.environ["CA_CERT_PATH"],
        ca_passwd=os.environ["CA_PASSWORD"],
    )

    # 取得合約 使用台指期近月為例
    contract = api.Contracts.Futures["TXFR1"]
    print(f"Contract: {contract}")

    # 建立期貨委託下單的 Order
    order = sj.order.FuturesOrder(
        action=Action.Buy,  # 買進
        price=contract.reference,  # 以平盤價買進
        quantity=1,  # 下單數量
        price_type=FuturesPriceType.LMT,  # 限價單
        order_type=OrderType.ROD,  # 當日有效單
        octype=FuturesOCType.Auto,  # 自動選擇新平倉
        account=api.futopt_account,  # 使用預設的帳戶
    )
    print(f"Order: {order}")

    # 送出委託單
    trade = api.place_order(contract=contract, order=order)
    print(f"Trade: {trade}")

    # 更新狀態
    api.update_status()
    print(f"Status: {trade.status}")

```

新增期貨下單指令到專案

在 `pyproject.toml` 新增 `futures_testing` 的指令

```
[project.scripts]
futures_testing = "sj_trading.testing_flow:testing_futures_ordering"

```

執行 `uv run futures_testing` 就開始進行測試下單了
