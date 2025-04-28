After version 1.0, we will use Token as our login method. Please follow the steps below to apply and use.

### Apply The API Key

1. Go to the [API management](https://www.sinotrade.com.tw/newweb/PythonAPIKey/) page in the personal service.

1. Click Add API KEY.

1. Use your mobile phone or email to do two-factor authentication, and the API KEY can only be established if the verification is successful.

1. You can set expiration time, permission, which account can be used, whether it can be used in the production environment and allowed IP list of the key.

   Permission Description

   - Market / Data : Whether to use the market / data related API
   - Account : Whether to use the account related API
   - Trading : Whether to use the trading related API
   - Production Environment : Whether to use in the production environment

   Attention

   It is recommended to limit the use of IP, which can improve the security of the KEY.

1. If you add successfully, you will get the API Key and Secret Key.

   Attention

   - Please keep your key properly and do not disclose it to anyone to avoid property loss.
   - The Secret Key is only obtained when the establishment is successful, and there is no way to obtain it after that, please make sure to save it.

### Download Certificate

1. Click the Download Certificate button
1. Download the certificate and place it into the folder that the API can read

## Confirm The API Key And Certificate

Continue with the previous project `sj-trading`, add `.env` file in the project folder, and add the following content

`.env`

```
API_KEY=<API Key>
SECRET_KEY=<Secret Key>
CA_CERT_PATH=<CA Certificate Path>
CA_PASSWORD=<CA Certificate Password>

```

the project folder structure should be like this

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

Add the `python-dotenv` package to load the key and certificate into environment variables

```
uv add python-dotenv

```

Add the following content into `src/sj_trading/__init__.py`

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

Add the `main` command into `pyproject.toml`

```
[project.scripts]
main = "sj_trading"

```

Run the `main` command

```
uv run main

```

If you see `login and activate ca success`, it means you have successfully logged in to the simulation environment.

Next, if you have not yet completed the API usage signature, please proceed to the next chapter to complete the signature and pass the audit for the API.
