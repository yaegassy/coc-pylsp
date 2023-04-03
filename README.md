# coc-pylsp

[pylsp](https://github.com/python-lsp/python-lsp-server) (python-lsp-server) extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

<img width="780" alt="coc-pylsp-demo" src="https://user-images.githubusercontent.com/188642/115177162-97e3d300-a109-11eb-94dd-a6a7989b4a06.gif">

## Install

**CocInstall**:

```vim
:CocInstall @yaegassy/coc-pylsp
```

**vim-plug**:

```vim
Plug 'yaegassy/coc-pylsp', {'do': 'yarn install --frozen-lockfile'}
```

## Detect: pylsp (python-lsp-server)

coc-pylsp detects and starts pylsp.

**Priority to detect**:

1. pylsp.commandPath
1. current python3/python environment (e.g. pylsp in venv)
1. builtin pylsp (Installation commands are also provided)

## Bult-in install (pylsp and 3rd party plugins)

`coc-pylsp` allows you to create an extension-only "venv" and install "pylsp (python-lsp-server)" and "related tools" (e.g. pylsp-mypy).

By default, it is installed with `pip install python-lsp-server[all]`. (extras_require).

<!-- markdownlint-disable-next-line -->
If you want to change "extras_require", please change the `pylsp.builtin.installExtrasArgs` setting

**example**:

- Example1: `"pylsp.builtin.installExtrasArgs": []`
  - `pip install python-lsp-server`
- Example2: `"pylsp.builtin.installExtrasArgs": ["all"]`:
  - `pip install 'python-lsp-server[all]'`
- Example3: `"pylsp.builtin.installExtrasArgs": ["yapf", "flake8"]`:
  - `pip install 'python-lsp-server[yapf,flake8]'`

---

It also supports the installation of "3rd Party Plugins".

- 3rd Party Plugins currently supported
  - [pylsp-mypy](https://github.com/Richardk2n/pylsp-mypy)
  - [pyls-isort](https://github.com/paradoxxxzero/pyls-isort)
  - [python-lsp-black](https://github.com/python-lsp/python-lsp-black)
  - [pylsp-rope](https://github.com/python-rope/pylsp-rope)
  - [python-lsp-ruff](https://github.com/python-lsp/python-lsp-ruff)

By default, the installation of 3rd Party Plugins is "disabled".

To "enable" it, change each setting in `coc-settings.json`.

```jsonc
{
  // snip...
  "pylsp.builtin.enableInstallPylspMypy": true,
  "pylsp.builtin.enableInstallPylsIsort": true,
  "pylsp.builtin.enableInstallPythonLspBlack": true,
  "pylsp.builtin.enableInstallPylspRope": true,
  "pylsp.builtin.enableInstallPythonLspRuff": true,
  // snip...
}
```

It is also possible to specify the version of the third party tool to be installed

```jsonc
{
  // snip...
  "pylsp.builtin.pylspMypyVersion": "0.5.2",
  "pylsp.builtin.pylsIsortVersion": "0.2.2",
  "pylsp.builtin.pythonLspBlackVersion": "1.0.1",
  "pylsp.builtin.pylspRopeVersion": "0.1.10",
  "pylsp.builtin.pythonLspRuffVersion": "1.0.5",
  // snip...
}
```

**python-lsp-black tips**:

If you have `yapf` or `autopep8` installed, you may experience unexpected results.

Change the `pylsp.builtin.installExtrasArgs` setting to suit your needs so that `yapf` and `autopep8` are not installed

```jsonc
{
  // ...snip
  "pylsp.builtin.installExtrasArgs": [
    "flake8",
    "mccabe",
    "pycodestyle",
    "pydocstyle",
    "pyflakes",
    "pylint",
    "rope"
  ],
  "pylsp.builtin.enableInstallPythonLspBlack": true,
  /// ...snip
```

---

<!-- markdownlint-disable-next-line -->
The first time you use coc-pylsp, if pylsp is not detected, you will be prompted to do a built-in installation.

You can also run the installation command manually.

```vim
:CocCommand pylsp.builtin.install
```

## Use tcp mode

To use the tcp mode, set `pylsp.connectionMode` to `'tcp'`. Also, pylsp needs to be started in tcp mode separately.

**coc-settings.json**:

```json
{
  "pylsp.connectionMode": "tcp"
}
```

**How to start pylsp in tcp mode**:

```sh
# By default, host is 127.0.0.1 and port 2087 is set
pylsp --tcp
# Or specify any host (--host) and port (--port)
pylsp --tcp --host 127.0.0.1 --port 2087
```

## Configuration options

- `pylsp.enable`: Enable coc-pylsp extension, default: `true`
- `pylsp.trace.server`: Traces the communication between coc.nvim and the Python LSP Server, default: `"off"`
- `pylsp.commandPath`: Custom path to the pylsp command. `~` and `$HOME`, etc. can also be used. If not set, pylsp detected by the current python environment or extension venv's pylsp used will be used, default: `""`
- `pylsp.connectionMode`: Controls the communication method to pylsp, valid option `["stdio", "tcp"]`, default: `stdio`
- `pylsp.tcpHost`: Specifies the host name to connect pylsp. This setting only works with connectionMode is 'tcp', default: `"127.0.0.1"`
- `pylsp.tcpPort`: Specifies the port to connect pylsp. This setting only works with connectionMode is 'tcp', default: `2087`
- `pylsp.disableProgressNotifications`: Disable the initialization and workdone progress notifications, default: `true`
- `pylsp.builtin.pythonPath`: Python 3.x path (Absolute path) to be used for built-in install, default: `""`
- `pylsp.builtin.installExtrasArgs`: Setting extras_require for built-in installation, default: `["all"]`
- `pylsp.builtin.enableInstallPylspMypy`: Enable/Disable built-in install of `pylsp-mypy`, default: `false`
- `pylsp.builtin.enableInstallPylsIsort`: Enable/Disable built-in install of `pyls-isort`, default: `false`
- `pylsp.builtin.enableInstallPythonLspBlack`: Enable/Disable built-in install of `python-lsp-black`, default: `false`
- `pylsp.builtin.enableInstallPylspRope`: Enable/Disable built-in install of `pylsp-rope`, default: `false`
- `pylsp.builtin.enableInstallPythonLspRuff`: Enable/Disable built-in install of pylsp-lsp-ruff, default: `true`
- `pylsp.builtin.pylspMypyVersion`: Version of pylsp-mypy for built-in install, e.g. "0.5.2", default: `""`
- `pylsp.builtin.pylsIsortVersion`: Version of pyls-isort for built-in install, e.g. "0.2.2", default: `""`
- `pylsp.builtin.pythonLspBlackVersion`: Version of python-lsp-black for built-in install, e.g. "1.0.1" default: `""`
- `pylsp.builtin.pylspRopeVersion`: Version of pylsp-rope for built-in install, default: `""`
- `pylsp.builtin.pythonLspRuffVersion`: Version of python-lsp-ruff for built-in install, default: `""`

For other settings, Check the "configuration" section of [package.json](/package.json).

## Commands

- `pylsp.builtin.install`: Install python lsp server and related tools
  - pylsp will be installed in this path.
    - Mac/Linux: `~/.config/coc/extensions/@yaegassy/coc-pylsp-data/pylsp/venv/bin/pylsp`
    - Windows: `~/AppData/Local/coc/extensions/@yaegassy/coc-pylsp-data/pylsp/venv/Scripts/pylsp.exe`
  - 3rd Party Plugins will also be installed in the same `venv`

## Thanks

- [python-lsp/python-lsp-server](https://github.com/python-lsp/python-lsp-server)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
