# Shioaji

______________________________________________________________________

Shioaji is the most pythonic API for trading the Taiwan and global financial market. You can integrated your favorite Python packages such as NumPy, pandas, PyTorch or TensorFlow to build your trading model with the Shioaji API on cross-platform.

______________________________________________________________________

We are in early-release alpha. Expect some adventures and rough edges.

The key features are:

- Fast: High performance with c++ implement core and FPGA event broker.
- Easy: Designed to be easy to use and learn.
- Fast to code: With native python to integrate with large python ecosystem.
- Cross-Platform: The first one python trading API with Linux compatible in Taiwan.
- ✨ AI-Ready: First Taiwan trading API with [AI Coding Agent Skills](ai_assistant/) support. Let AI assistants help you code with Shioaji.

## Installation

### Binaries

simple using pip to install

```
pip install shioaji

```

update shioaji with

```
pip install -U shioaji

```

### uv

using uv to install

```
uv add shioaji 

```

install speed version

```
uv add shioaji --extra speed

```

### Docker Image

simple run with interactive mode in docker

```
docker run -it sinotrade/shioaji:latest

```

run with jupyter lab or notebook

```
docker run -p 8888:8888 sinotrade/shioaji:jupyter

```
