In this api, we use solace as mesh broker. This event mean the status for your client with solace connection situation. If you have no experience with networking, please skip this part, In defalut, we help you reconnect solace broker 50 times without any setting. Best way is keep your network connection alive.

In

```
@api.quote.on_event
def event_callback(resp_code: int, event_code: int, info: str, event: str):
    print(f'Event code: {event_code} | Event: {event}')

```

Out

```
Event code: 16 | Event: Subscribe or Unsubscribe ok

```

Like the quote callback, your can also set event cllback with two way.

In

```
api.quote.set_event_callback?

```

Out

```
Signature: api.quote.set_event_callback(func:Callable[[int, int, str, str], NoneType]) -> None
Docstring: <no docstring>
Type:      method

```

### Event Code

| Event Code | Event Code Enumerator | Description | | --- | --- | --- | | 0 | SOLCLIENT_SESSION_EVENT_UP_NOTICE | The Session is established. | | 1 | SOLCLIENT_SESSION_EVENT_DOWN_ERROR | The Session was established and then went down. | | 2 | SOLCLIENT_SESSION_EVENT_CONNECT_FAILED_ERROR | The Session attempted to connect but was unsuccessful. | | 3 | SOLCLIENT_SESSION_EVENT_REJECTED_MSG_ERROR | The appliance rejected a published message. | | 4 | SOLCLIENT_SESSION_EVENT_SUBSCRIPTION_ERROR | The appliance rejected a subscription (add or remove). | | 5 | SOLCLIENT_SESSION_EVENT_RX_MSG_TOO_BIG_ERROR | The API discarded a received message that exceeded the Session buffer size. | | 6 | SOLCLIENT_SESSION_EVENT_ACKNOWLEDGEMENT | The oldest transmitted Persistent/Non-Persistent message that has been acknowledged. | | 7 | SOLCLIENT_SESSION_EVENT_ASSURED_PUBLISHING_UP | Deprecated -- see notes in solClient_session_startAssuredPublishing.The AD Handshake (that is, Guaranteed Delivery handshake) has completed for the publisher and Guaranteed messages can be sent. | | 8 | SOLCLIENT_SESSION_EVENT_ASSURED_CONNECT_FAILED | Deprecated -- see notes in solClient_session_startAssuredPublishing.The appliance rejected the AD Handshake to start Guaranteed publishing. Use SOLCLIENT_SESSION_EVENT_ASSURED_DELIVERY_DOWN instead. | | 8 | SOLCLIENT_SESSION_EVENT_ASSURED_DELIVERY_DOWN | Guaranteed Delivery publishing is not available.The guaranteed delivery capability on the session has been disabled by some action on the appliance. | | 9 | SOLCLIENT_SESSION_EVENT_TE_UNSUBSCRIBE_ERROR | The Topic Endpoint unsubscribe command failed. | | 9 | SOLCLIENT_SESSION_EVENT_DTE_UNSUBSCRIBE_ERROR | Deprecated name; SOLCLIENT_SESSION_EVENT_TE_UNSUBSCRIBE_ERROR is preferred. | | 10 | SOLCLIENT_SESSION_EVENT_TE_UNSUBSCRIBE_OK | The Topic Endpoint unsubscribe completed. | | 10 | SOLCLIENT_SESSION_EVENT_DTE_UNSUBSCRIBE_OK | Deprecated name; SOLCLIENT_SESSION_EVENT_TE_UNSUBSCRIBE_OK is preferred. | | 11 | SOLCLIENT_SESSION_EVENT_CAN_SEND | The send is no longer blocked. | | 12 | SOLCLIENT_SESSION_EVENT_RECONNECTING_NOTICE | The Session has gone down, and an automatic reconnect attempt is in progress. | | 13 | SOLCLIENT_SESSION_EVENT_RECONNECTED_NOTICE | The automatic reconnect of the Session was successful, and the Session was established again. | | 14 | SOLCLIENT_SESSION_EVENT_PROVISION_ERROR | The endpoint create/delete command failed. | | 15 | SOLCLIENT_SESSION_EVENT_PROVISION_OK | The endpoint create/delete command completed. | | 16 | SOLCLIENT_SESSION_EVENT_SUBSCRIPTION_OK | The subscribe or unsubscribe operation has succeeded. | | 17 | SOLCLIENT_SESSION_EVENT_VIRTUAL_ROUTER_NAME_CHANGED | The appliance's Virtual Router Name changed during a reconnect operation.This could render existing queues or temporary topics invalid. | | 18 | SOLCLIENT_SESSION_EVENT_MODIFYPROP_OK | The session property modification completed. | | 19 | SOLCLIENT_SESSION_EVENT_MODIFYPROP_FAIL | The session property modification failed. | | 20 | SOLCLIENT_SESSION_EVENT_REPUBLISH_UNACKED_MESSAGES | After successfully reconnecting a disconnected session, the SDK received an unknown publisher flow name response when reconnecting the GD publisher flow. |
