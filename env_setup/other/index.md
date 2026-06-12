# Environment Setup

This page is for users using CLI or connecting via HTTP (JavaScript / Go / C++ / C# / Rust / Java, etc.). Python users please refer to the [Python User](../python/) page.

## System Requirements

- Operating System: 64-bit version of Windows, MacOS, or Linux
- User needs to have a SinoPac account and obtain Shioaji API permissions.

## Install shioaji Command

The `shioaji` command is required to start the HTTP server.

```
uv tool install shioaji

```

Linux / MacOS:

```
curl -fsSL https://raw.githubusercontent.com/sinotrade/shioaji/main/install.sh | sh

```

Windows (PowerShell):

```
irm https://raw.githubusercontent.com/sinotrade/shioaji/main/install.ps1 | iex

```

## Create .env

Create a `.env` file under the directory where you will run `shioaji server start`, with the following content:

```
# Required
SJ_API_KEY=YOUR_API_KEY
SJ_SEC_KEY=YOUR_SECRET_KEY

# CA activation (required for placing orders in production)
SJ_CA_PATH=your/ca/path/Sinopac.pfx
SJ_CA_PASSWD=YOUR_CA_PASSWORD

# Mode (set to true to enable production; unset or false means simulation)
SJ_PRODUCTION=false

```

When the shioaji server starts, it will automatically read this file to complete login and CA activation.

## Check Server Status

After the server is up, you can check the daemon and stream health at any time.

In

```
shioaji server status --streams

```

Out

```
running: true
pid: 38082
port: 8080
socket_path: "/Users/your_name/.shioaji/server-8080.sock"
healthy: true
simulation: false
stream_receivers: "Market data receivers are available for tick, bidask, quote, and order event data"
stream_status:
  active_connections: 0
  timestamp: 2026-06-12T05:48:05.561238+00:00
  status: healthy

```

Adding `--streams` additionally queries the stream diagnostics (`stream_receivers` and `stream_status`), which helps verify whether pushed data is being received.

Attributes

```
running (bool):           whether the daemon is running
pid (int):                process ID of the daemon
port (int):               HTTP service port
socket_path (str):        daemon control socket path
healthy (bool):           whether the daemon is healthy
simulation (bool):        whether the server is in simulation mode (corresponds to SJ_PRODUCTION in .env)
stream_receivers (str):   stream receiver description
active_connections (int): number of client connections currently attached to the SSE streams
                          (market data and order event streams both count); if you subscribed
                          but receive no data, first check whether this is 0

```

**Version and mode**

In

```
curl http://localhost:8080/api/v1/info

```

Out

```
{"name":"Shioaji API Server","version":"1.5.3","description":"SinoPac Shioaji Cross-Platform Trading API HTTP Adaptor","protocols":["HTTP"],"simulation":false}

```

Attributes

```
name (str):        service name
version (str):     server version
description (str): service description
protocols (list):  supported protocols
simulation (bool): whether the server is in simulation mode (corresponds to SJ_PRODUCTION in .env)

```

**Stream connection status**

In

```
curl http://localhost:8080/api/v1/stream/status

```

Out

```
{"active_connections":0,"timestamp":"2026-06-12T05:53:13.517649+00:00","status":"healthy"}

```

Attributes

```
active_connections (int): number of client connections currently attached to the SSE streams
                          (market data and order event streams both count); if you subscribed
                          but receive no data, first check whether this is 0
timestamp (str):          query time
status (str):             stream service status

```

If you have already opened an account, you can skip the next chapter and go to [Token & Certificate](../../tutor/prepare/token/) to get the API Key and certificate.
