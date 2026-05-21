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

If you have already opened an account, you can skip the next chapter and go to [Token & Certificate](../../tutor/prepare/token/) to get the API Key and certificate.
