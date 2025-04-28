First, we extend the project `sj-trading` created using `uv` in the environment creation chapter to add the testing flow part.

The complete project code can be referred to [sj-trading https://github.com/Sinotrade/sj-trading-demo](https://github.com/Sinotrade/sj-trading-demo).

You can use `git` to clone the entire environment to your local machine and use it directly.

Download Project

```
git clone https://github.com/Sinotrade/sj-trading-demo.git
cd sj-trading-demo

```

Next, we will step by step introduce how to add the testing flow.

### Shioaji Version

Get Shioaji version information

Add Version Information

Add the following content to `src/sj_trading/__init__.py`

```
def show_version() -> str:
    print(f"Shioaji Version: {sj.__version__}")
    return sj.__version__

```

Add `version` Command to Project

Add `version` command to `pyproject.toml`

```
[project.scripts]
version = "sj_trading:show_version"

```

Execute `uv run version` to see the Shioaji version information

```
Shioaji Version: 1.2.0

```

### Stock Testing

Add Stock Testing File

Add file `testing_flow.py` to `src/sj_trading`

Add the following content

```
import shioaji as sj
from shioaji.constant import Action, StockPriceType, OrderType
import os

def testing_stock_ordering():
    # Login to the testing environment
    api = sj.Shioaji(simulation=True)
    accounts = api.login(
        api_key=os.environ["API_KEY"],
        secret_key=os.environ["SECRET_KEY"],
    )
    # Show all available accounts
    print(f"Available accounts: {accounts}")
    api.activate_ca(
        ca_path=os.environ["CA_CERT_PATH"],
        ca_passwd=os.environ["CA_PASSWORD"],
    )

    # Prepare the Contract for Ordering
    # Use 2890 Fubon Financial as an example
    contract = api.Contracts.Stocks["2890"]
    print(f"Contract: {contract}")

    # Create an Order for Ordering
    order = sj.order.StockOrder(
        action=Action.Buy, # Buy
        price=contract.reference, # Buy at the reference price
        quantity=1, # Order quantity
        price_type=StockPriceType.LMT, # Limit price order
        order_type=OrderType.ROD, # Effective for the day
        account=api.stock_account, # Use the default account
    )
    print(f"Order: {order}")

    # Send the order
    trade = api.place_order(contract=contract, order=order)
    print(f"Trade: {trade}")

    # Update the status
    api.update_status()
    print(f"Status: {trade.status}")

```

Add `stock_testing` Command to Project

Add `stock_testing` command to `pyproject.toml`

```
[project.scripts]
stock_testing = "sj_trading.testing_flow:testing_stock_ordering"

```

Execute `uv run stock_testing` to start testing stock ordering

### Futures Testing

Add Futures Testing Content

Add the following content to `src/sj_trading/testing_flow.py`

```
from shioaji.constant import (
    FuturesPriceType,
    FuturesOCType,
)

def testing_futures_ordering():
    # Login to the testing environment
    api = sj.Shioaji(simulation=True)
    accounts = api.login(
        api_key=os.environ["API_KEY"],
        secret_key=os.environ["SECRET_KEY"],
    )
    # Show all available accounts
    print(f"Available accounts: {accounts}")
    api.activate_ca(
        ca_path=os.environ["CA_CERT_PATH"],
        ca_passwd=os.environ["CA_PASSWORD"],
    )

    # Get the contract for ordering
    # Use TXFR1 as an example
    contract = api.Contracts.Futures["TXFR1"]
    print(f"Contract: {contract}")

    # Create an Order for Ordering
    order = sj.order.FuturesOrder(
        action=Action.Buy,  # Buy
        price=contract.reference,  # Buy at the reference price
        quantity=1,  # Order quantity
        price_type=FuturesPriceType.LMT,  # Limit price order
        order_type=OrderType.ROD,  # Effective for the day
        octype=FuturesOCType.Auto,  # Auto select new close
        account=api.futopt_account,  # Use the default account
    )
    print(f"Order: {order}")

    # Send the order
    trade = api.place_order(contract=contract, order=order)
    print(f"Trade: {trade}")

    # Update the status
    api.update_status()
    print(f"Status: {trade.status}")

```

Add `futures_testing` Command to Project

Add `futures_testing` command to `pyproject.toml`

```
[project.scripts]
futures_testing = "sj_trading.testing_flow:testing_futures_ordering"

```

Execute `uv run futures_testing` to start testing futures ordering
