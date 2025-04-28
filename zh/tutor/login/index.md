Login must have a SinoPac Securities account. If you do not have a SinoPac Securities account yet. See the [document](../prepare/open_account/) for details.

## Login

Token login

After version 1.0, we are using token as our `login` method. You can be found in [Token](../prepare/token/). Before version 1.0, using person id and password.

In

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    api_key="YOUR_API_KEY", 
    secret_key="YOUR_SECRET_KEY"
)

```

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    person_id="YOUR_PERSON_ID", 
    passwd="YOUR_PASSWORD",
)

```

Out

```
[FutureAccount(person_id='', broker_id='', account_id='', signed=True, username=''),
StockAccount(person_id='', broker_id='', account_id='', signed=True, username='')]

```

- If you cannot find `signed` in your accounts, please refer to [terms of service](../prepare/terms/) first.

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

```
person_id (str): person_id
passwd (str): password
hashed (bool): whether password has been hashed (Default: False)
fetch_contract (bool): whether to load contracts from cache or server (Default: True)
contracts_timeout (int): fetch contract timeout (Default: 0 ms)
contracts_cb (typing.Callable): fetch contract callback (Default: None)
subscribe_trade (bool): whether to subscribe Order/Deal event callback (Default: True)

```

Warning

When the version is greater than 1.0, you may receive **Sign data is timeout** when login. That is, login has exceeded the effective execution time. It may be that the time difference between your computer and server is too large, you need to calibrate your computer time. Or login execution time exceeds valid time, you can increase `receive_window`.

### Fetch Contracts Callback

You can use `contracts_cb` as print to check contract download status.

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

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    person_id="YOUR_PERSON_ID", 
    passwd="YOUR_PASSWORD", 
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

### Subscribe Trade

There are 2 options that you can adjust whether to subscribe trade (Order/Deal Event Callback).\
The first is `subscribe_trade` in login aruguments. Default value of `subscribe_trade` is `True`, and it will automatically subscribe trade from all accounts. You don't need to make any adjustments, if you would like to receive Order/Deal Events.

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

```
import shioaji as sj
api = sj.Shioaji()
api.login(
    person_id="YOUR_PERSON_ID", 
    passwd="YOUR_PASSWORD", 
    subscribe_trade=True
)

```

The second one is to manually use the API `subscribe_trade` and `unsubscribe_trade` for specific account.

subscribe trade

```
api.subscribe_trade(account)

```

unsubscribe trade

```
api.unsubscribe_trade(account)

```

## Account

### List Accounts

In:

```
accounts = api.list_accounts()

```

Out

```
# print(accounts)
[
    FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1'), 
    FutureAccount(person_id='PERSON_ID_2', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', username='USERNAME_2'), 
    StockAccount(person_id='PERSON_ID_3', broker_id='BROKER_ID_3', account_id='ACCOUNT_ID_3', username='USERNAME_3'), 
    StockAccount(person_id='PERSON_ID_4', broker_id='BROKER_ID_4', account_id='ACCOUNT_ID_4', signed=True, username='USERNAME_4')
]

```

- If `signed` does not appear in the account list, like ACCOUNT_ID_2 and ACCOUNT_ID_3, it means that the account has not signed or completed the test report in the simulation mode. Please refer to [Terms of service](../prepare/terms/).

### Default Account

In

```
# Futures default account
print(api.futopt_account)

```

Out

```
FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1')

```

Set default account

In

```
# Default futures account switch to ACCOUNT_ID_2 from ACCOUNT_ID_1. 
api.set_default_account(accounts[1])
print(api.futopt_account)

```

Out

```
FutureAccount(person_id='PERSON_ID_2', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', username='USERNAME_2')

```

In Order object, you need to specify which account you want to place order. For more information about Order, please refer to [Stock Order](../order/Stock/) and [Futures Order](../order/FutureOption/).

```
order = api.Order(
    price=12, 
    quantity=1, 
    action=sj.constant.Action.Buy, 
    price_type=sj.constant.StockPriceType.LMT, 
    order_type=sj.constant.OrderType.ROD, 
    order_lot=sj.constant.StockOrderLot.Common, 
    account=api.stock_account
)

```

## Logout

Logout funciton will close the connection between the client and the server.\
In order to provide high quality services, starting from 2021/08/06, we've limit the [number of connections used](../limit/). It's a good practice to logout or to terminate the program when it is not in use.

logout

```
api.logout()
# True

```
