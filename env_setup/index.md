# Environment Setup

In this section, we will introduce how to setup the python environment with [`uv`](https://docs.astral.sh/uv/) for using Shioaji API. `uv` is the best solution for managing python environment on cross-platform.

### System Requirements

Before starting, please ensure your system meets the following requirements:

- Operating System: 64-bit version of Windows, MacOS, or Linux
- Python Version: 3.8 or later
- User needs to have a Sinopac account and obtain Shioaji API permissions.

## Install Python Environment

First, you need to install Python on your system. We recommend using `uv` as the Python environment and project environment management tool. And we will use `uv` to install Shioaji API in the project.

note

[`uv`](https://docs.astral.sh/uv/) is the best solution for managing python environment on cross-platform.

### Install uv

script

```
curl -LsSf https://astral.sh/uv/install.sh | sh

```

```
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

```

More information about installation and usage can be found at [uv official document](https://docs.astral.sh/uv/)

## Create Project Environment

First, create a project named `sj-trading`

```
uv init sj-trading --package --app --vcs git
cd sj-trading

```

The project structure will be like this:

```
sj-trading
├── README.md
├── pyproject.toml
└── src
    └── sj_trading
        └── __init__.py

```

add Shioaji API to the project

```
uv add shioaji

```

Open `pyproject.toml` file and you will see the following content

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

the `hello` command is the entry point of the project.

execute hello command

```
uv run hello

```

output

```
Hello from sj-trading!

```

open `src/sj_trading/__init__.py` file and copy the following content

```
import shioaji as sj

def hello():
    get_shioaji_client()


def get_shioaji_client() -> sj.Shioaji:
    api =  sj.Shioaji()
    print("Shioaji API created")
    return api

```

execute command

```
uv run hello

```

output

```
Shioaji API created

```

This is the most basic environment setup and you can start using Shioaji API now.

### Use Jupyter Environment

Add ipykernel to the project development dependencies

```
uv add --dev ipykernel

```

Add the project environment to the Jupyter kernel

```
uv run ipython kernel install --user --name=sj-trading

```

Start Jupyter

```
uv run --with jupyter jupyter lab

```

Open `dev.ipynb` file in Jupyter and select `sj-trading` kernel to execute the command

The `hello` command we wrote earlier can be executed in this way

If you have already opened an account, you can skip the next chapter and go to [Token & Certificate](../tutor/prepare/token/) to get the API Key and certificate.
