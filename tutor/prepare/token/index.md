Shioaji uses API Key as the login method. Please follow the steps below to apply.

## API Key

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

## Certificate

### Download Certificate

1. Go to the [API management](https://www.sinotrade.com.tw/newweb/PythonAPIKey/) page and click the Download Certificate button.

1. Download the certificate and place it into the folder that the API can read.

1. Go to [SinoTrade](https://www.sinotrade.com.tw/CSCenter/CSCenter_13_3) and download eleader.

1. Log in to eleader.

1. From the account info menu, select (3303) account info settings.

1. Click "Step Instructions".

1. Follow the certificate operation steps.

### Confirm The API Key And Certificate

Create a `.env` file at your Python project root (next to `pyproject.toml`) with the following content:

```
SJ_API_KEY=<API Key from above>
SJ_SEC_KEY=<Secret Key from above>
SJ_CA_PATH=<CA Certificate Path>
SJ_CA_PASSWD=<CA Certificate Password>

```

The project folder structure should be like this:

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

Add the `python-dotenv` package to load the key and certificate into environment variables:

```
uv add python-dotenv

```

Add the following content into `src/your_package/__init__.py`:

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

Add the `main` command into `pyproject.toml`:

```
[project.scripts]
main = "your_package:main"

```

Run the `main` command:

```
uv run main

```

If you see `login and activate ca success`, it means you have successfully logged in to the simulation environment.

Create a `.env` file under the directory where you will run `shioaji server start`, with the following content:

```
SJ_API_KEY=<API Key from above>
SJ_SEC_KEY=<Secret Key from above>
SJ_CA_PATH=<CA Certificate Path>
SJ_CA_PASSWD=<CA Certificate Password>

```

Start the server; it will automatically read `.env` to complete login and CA activation:

```
shioaji server start

```

Check status:

```
shioaji server check

```

On success, it will display the simulation mode and the logged-in account information.

### Activate CA

You must activate your CA before placing orders. If you only use simulation mode, you can skip this section.

Call `api.activate_ca()` to load and activate the CA:

```
result = api.activate_ca(
    ca_path="/path/to/your/Sinopac.pfx",
    ca_passwd="YOUR_CA_PASSWORD",
    person_id="YOUR_PERSON_ID",
)
print(result)
# True

```

Windows Path

On Windows, replace path backslashes `\` with forward slashes `/` or double backslashes `\\`.

Check CA expiry time:

```
api.get_ca_expiretime("YOUR_PERSON_ID")

```

`shioaji server start` automatically reads `SJ_CA_PATH` and `SJ_CA_PASSWD` from `.env` to activate the CA; no extra call is needed.

Check CA expiry time with the CLI:

```
shioaji auth ca-expiretime --person-id YOUR_PERSON_ID

```

Response:

```
person_id: YOUR_PERSON_ID
expire_time: 2026-09-13T15:59:59

```

Or via HTTP:

```
curl "http://localhost:8080/api/v1/auth/ca_expiretime?person_id=YOUR_PERSON_ID"

```

Response:

```
{"person_id":"YOUR_PERSON_ID","expire_time":"2026-09-13T15:59:59"}

```

Next, if you have not yet completed the API usage signature, please proceed to the next chapter to complete the signature and pass the audit for the API.
