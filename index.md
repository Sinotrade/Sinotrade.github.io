# Shioaji

______________________________________________________________________

Shioaji is the trading API provided by SinoPac Securities — a complete and beginner-friendly platform for accessing the Taiwan financial market.

As a **cross-language, cross-platform** trading platform, you can use the Python native binding `import shioaji as sj`, or any HTTP-capable language (JavaScript/TypeScript, Go, C/C++, C#, Rust, Java/Kotlin) to build your own trading models and trade stocks, futures, options, and combos.

Intuitive interface, exceptional performance — whether you're new to trading or a seasoned trader looking for a more powerful platform, Shioaji has you covered. [Sign up for free and start trading.](https://sinotrade.github.io/tutor/prepare/open_account)

______________________________________________________________________

Features:

- Cross-language, cross-platform: three interfaces — Python, HTTP API, and CLI — any HTTP-capable language can trade.
- Performance: Rust core delivers microsecond-level market data processing.
- ✨ The first Taiwan trading API to support AI Coding Agent skills.

## Installation

### Python Package

```
# uv (recommended)
uv add shioaji

# pip
pip install shioaji

```

### CLI Tool

```
uv tool install shioaji
shioaji --help

```

### Standalone Installer

**Linux / macOS:**

```
# Stable
curl -fsSL https://raw.githubusercontent.com/sinotrade/shioaji/main/install.sh | sh

# Prerelease
curl -fsSL https://raw.githubusercontent.com/sinotrade/shioaji/main/install.sh | CHANNEL=prerelease sh

```

**Windows (PowerShell):**

```
# Stable
irm https://raw.githubusercontent.com/sinotrade/shioaji/main/install.ps1 | iex

# Prerelease
$env:CHANNEL="prerelease"; irm https://raw.githubusercontent.com/sinotrade/shioaji/main/install.ps1 | iex

```
