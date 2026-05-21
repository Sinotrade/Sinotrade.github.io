Login requires a SinoPac Securities account. If you don't have one yet, see [Open Account](../prepare/open_account/).

## Login

API Key

Shioaji uses API Key as the login method. See [Token & Certificate](../prepare/token/) to apply.

In

```
import shioaji as sj
api = sj.Shioaji(simulation=False)  # whether to enter simulation mode
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY"
)

```

Out

```
# Connection to Solace market data server established
Response Code: 0 | Event Code: 0 | Info: host '<IP>:80', hostname '<IP>:80' IP <IP>:80 (host 1 of 1) (host connection attempt 1 of 1) (total connection attempt 1 of 2) | Event: Session up

# Account list returned after login
[FutureAccount(person_id='', broker_id='', account_id='', signed=true, username=''),
 IntlAccount(person_id='', broker_id='', account_id='', signed=false, username=''),
 StockAccount(person_id='', broker_id='', account_id='', signed=true, username='')]

```

Login Arguments

```
api_key (str): API Key
secret_key (str): Secret Key
fetch_contract (bool): whether to load contracts from cache or server (Default: True)
contracts_timeout (int): fetch contract timeout (Default: 0 ms)
contracts_cb (typing.Callable): fetch contract callback (Default: None)
subscribe_trade (bool): whether to subscribe Order/Deal event callback (Default: True)
receive_window (int): valid duration for login execution. (Default: 30,000 ms)

```

Note

If you receive **Sign data is timeout**, login exceeded the effective execution time. Possible causes:

- System time differs too much from server time → calibrate system time
- Login execution exceeds `receive_window` → increase `receive_window` (Default: 30,000 ms)

**Fetch Contracts Callback**

Use `contracts_cb` to monitor contract fetch progress:

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    contracts_cb=lambda security_type: print(f"{repr(security_type)} fetch done.")
)

```

Out

```
[
    FutureAccount(person_id='', broker_id='', account_id='', signed=True, username=''),
    StockAccount(person_id='', broker_id='', account_id='', signed=True, username='')
]
<SecurityType.Index: 'IND'> fetch done.
<SecurityType.Future: 'FUT'> fetch done.
<SecurityType.Option: 'OPT'> fetch done.
<SecurityType.Stock: 'STK'> fetch done.

```

In

```
# .env (in the working directory) should contain:
SJ_API_KEY=YOUR_API_KEY                # edit it
SJ_SEC_KEY=YOUR_SECRET_KEY             # edit it
SJ_PRODUCTION=true                     # whether to enter production mode

# Start server (auto-reads .env and logs in)
shioaji server start

```

Out

```
# Reads API key and settings from .env
Loaded environment variables from .env file
INFO shioaji::cli::server: Starting Shioaji API Server...

# First login (no cached token)
INFO shioaji::api::api_v1::auth::token_login: No cached token available, performing new login
INFO shioaji::api::api_v1::auth::token_login: Stored new token in slot 1

# Contract fetch progress
INFO shioaji::api::api_v1::contracts::api: Fetched 127 IND contracts (1 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 42787 STK contracts (9 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 2489 FUT contracts (1 pages)
INFO shioaji::api::api_v1::contracts::api: Fetched 8653 OPT contracts (2 pages)
INFO shioaji::server: Loaded 54056 contracts

# CA certificate loaded
INFO shioaji::server: CA certificate activated successfully

# Authentication successful, login complete
INFO shioaji::cli::server: Successfully authenticated with Shioaji API

# HTTP server up, ready to accept requests
INFO shioaji::cli::server: 🚀 Shioaji API Server is running on http://127.0.0.1:8080
INFO salvo_core::server: listening [HTTP/1.1] on http://127.0.0.1:8080

```

Login Arguments

```
SJ_API_KEY      API Key (required)
SJ_SEC_KEY      Secret Key (required)
SJ_PRODUCTION   whether to enter production mode (Default: false)

```

Note

If you receive **Sign data is timeout**, login exceeded the effective execution time. Please calibrate system time.

### Subscribe Trade

There are 2 options to adjust trade subscription (Order/Deal Event Callback). The first is the `subscribe_trade` argument of `login`. Its default value is `True`, which auto-subscribes trade events from all accounts.

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY",
    secret_key="YOUR_SECRET_KEY",
    subscribe_trade=True
)

```

The second option is to call `subscribe_trade` / `unsubscribe_trade` on a specific account to subscribe or unsubscribe.

subscribe trade

```
api.subscribe_trade(account)

```

unsubscribe trade

```
api.unsubscribe_trade(account)

```

Use HTTP

Shioaji 1.5.x CLI doesn't provide a `subscribe-trade` subcommand. Use HTTP instead.

The server doesn't auto-subscribe on startup; subscribe per account.

subscribe trade

```
curl -X POST http://localhost:8080/api/v1/auth/subscribe_trade \
  -H "Content-Type: application/json" \
  -d '{"broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

unsubscribe trade

```
curl -X POST http://localhost:8080/api/v1/auth/unsubscribe_trade \
  -H "Content-Type: application/json" \
  -d '{"broker_id": "YOUR_BROKER_ID", "account_id": "YOUR_ACCOUNT_ID"}'

```

## Account

Accounts are classified by `account_type`:

- `S`: Stock account (`StockAccount`)
- `F`: Futures account (`FutureAccount`)
- `H`: International (sub-brokerage) account — not yet supported for API trading in shioaji.

#### List Accounts

In

```
accounts = api.list_accounts()
accounts

```

Out

```
[
    FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1'),
    IntlAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', signed=False, username='USERNAME_1'),
    StockAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_3', signed=True, username='USERNAME_1')
]

```

- If `signed` does not appear in the account list (e.g. `ACCOUNT_ID_2`), the account has not been signed or has not completed the test report in simulation mode. Please refer to [API Signing and Test](../prepare/terms/).

#### Default Account

In

```
print(api.stock_account)
print(api.futopt_account)

```

Out

```
StockAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_3', signed=True, username='USERNAME_1')
FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1')

```

#### Set Default Account

In

```
# Switch the default futures account from ACCOUNT_ID_1 to ACCOUNT_ID_2
api.set_default_account(accounts[1])
print(api.futopt_account)

```

Out

```
FutureAccount(person_id='PERSON_ID_2', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', username='USERNAME_2')

```

**List Accounts**

In

```
shioaji auth accounts

```

Out

```
[3]{account_type,person_id,broker_id,account_id,signed,username}:
  F,PERSON_ID_1,BROKER_ID_1,"ACCOUNT_ID_1",true,USERNAME_1
  H,PERSON_ID_1,BROKER_ID_2,"ACCOUNT_ID_2",false,USERNAME_1
  S,PERSON_ID_1,BROKER_ID_2,"ACCOUNT_ID_3",true,USERNAME_1

```

- If `signed` does not appear in the account list, the account has not been signed or has not completed the test report in simulation mode. Please refer to [API Signing and Test](../prepare/terms/).

**Default Account**

The server picks the first stock / futures account as the default on startup. If `--account` is not given on order placement, the default is used; to use a specific account, pass `--account BROKER-ACCOUNT`.

**List Accounts**

In

```
curl http://localhost:8080/api/v1/auth/accounts

```

Out

```
[{"account_type":"F","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_1","account_id":"ACCOUNT_ID_1","signed":true,"username":"USERNAME_1"},{"account_type":"H","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_2","account_id":"ACCOUNT_ID_2","signed":false,"username":"USERNAME_1"},{"account_type":"S","person_id":"PERSON_ID_1","broker_id":"BROKER_ID_2","account_id":"ACCOUNT_ID_3","signed":true,"username":"USERNAME_1"}]

```

- If `signed` does not appear in the account list, the account has not been signed or has not completed the test report in simulation mode. Please refer to [API Signing and Test](../prepare/terms/).

**Default Account**

The server picks the first stock / futures account as the default on startup. If the order request `account` omits `broker_id` / `account_id`, the default is used; to use a specific account, include `broker_id` + `account_id`.

## Logout

Logout closes the connection between the client and the server. To provide quality service, we [limit the number of connections](../limit/) since 2021/08/06. It is good practice to terminate the program when not in use.

In

```
api.logout()

```

Out

```
True

```

Stop the daemon started by `shioaji server start`:

```
shioaji server stop

```
