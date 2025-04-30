登入必須擁有永豐金帳戶。若你還沒有擁永豐金帳戶，可詳見[開戶](../prepare/open_account/)。

## 登入

Token login

在1.0版本之後，我們將使用Token作為我們的登入方式，申請KEY可參見[文件](../prepare/token/)。當版本小於1.0，我們使用帳號密碼作為我們登入的方法。

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

- If you cannot find `signed` in your accounts, please sign the [document](../prepare/terms/) first.
- 如果在帳號清單中找不到 `signed`，請至[服務條款](../prepare/terms/)了解使用API服務所需要步驟。

Login Arguments

```
api_key (str): API金鑰
secret_key (str): 密鑰
fetch_contract (bool): 是否從快取中讀取商品檔或從伺服器下載商品檔 (預設值: True)
contracts_timeout (int): 獲取商品檔 timeout (預設值: 0 ms)
contracts_cb (typing.Callable): 獲取商品檔 callback (預設值: None)
subscribe_trade (bool): 是否訂閱委託/成交回報 (預設值: True)
receive_window (int): 登入動作有效執行時間 (預設值: 30,000 毫秒)

```

```
person_id (str): 身分證字號
passwd (str): 密碼
hashed (bool): 密碼是否已經被hashed (預設值: False)
fetch_contract (bool): 是否從快取中讀取商品檔或從伺服器下載商品檔 (預設值: True)
contracts_timeout (int): 獲取商品檔 timeout (預設值: 0 ms)
contracts_cb (typing.Callable): 獲取商品檔 callback (預設值: None)
subscribe_trade (bool): 是否訂閱委託/成交回報 (預設值: True)

```

注意

當版本大於1.0時，可能在登入時收到**Sign data is timeout**，這表示登入超過有效執行時間。可能是您的電腦時間與伺服器時間相差過大，需校準電腦的時間。或者登入執行時間超過有效時間，可將`receive_window`調高。

### 獲取商品檔Callback

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

### 訂閱委託/成交回報

我們提供2個方式讓您可以調整訂閱委託/成交回報。首先是於 `login` 的參數 `subscribe_trade`，預設值為 `True`，會自動為您訂閱所有帳號的委託/成交回報。

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

另一個方式是，對特定帳號使用API `subscribe_trade` 及 `unsubscribe_trade`，即可訂閱或取消訂閱訂閱委託/成交回報。

subscribe trade

```
api.subscribe_trade(account)

```

unsubscribe trade

```
api.unsubscribe_trade(account)

```

## 帳號

### 帳號列表

In:

```
accounts = api.list_accounts()
accounts

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

- 若`signed`在帳號列表中未出現，如同 ACCOUNT_ID_2 及 ACCOUNT_ID_3 ，代表該帳號尚未簽署或者尚未完成在測試模式中的測試報告。可參見[服務條款](../prepare/terms/)。

### 預設帳號

In

```
# 期貨預設帳號
print(api.futopt_account)

```

Out

```
FutureAccount(person_id='PERSON_ID_1', broker_id='BROKER_ID_1', account_id='ACCOUNT_ID_1', signed=True, username='USERNAME_1')

```

設定預設帳號

In

```
# 預設的期貨帳號從 ACCOUNT_ID_1轉換成 ACCOUNT_ID_2
api.set_default_account(accounts[1])
print(api.futopt_account)

```

Out

```
FutureAccount(person_id='PERSON_ID_2', broker_id='BROKER_ID_2', account_id='ACCOUNT_ID_2', username='USERNAME_2')

```

下單Order物件中需要指定帳號。更多資訊請參考[現貨](./order/Stock.zh_TW.md)和[期權](./order/FutureOption.zh_TW.md)下單。

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

## 登出

登出功能將關閉客戶端及服務端之間的連接。為了提供優質的服務，我們從2021/08/06開始將[限制](./limit.zh_TW.md)連線數。在不使用的時候終止程式是一個良好的習慣。

```
api.logout()
# True

```
