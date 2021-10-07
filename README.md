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

## Bult-in install

coc-pylsp allows you to create an extension-only "venv" and install "pylsp (python-lsp-server)".

By default, it is installed with `pip install python-lsp-server[all]`. (extras_require).

<!-- markdownlint-disable-next-line -->
If you want to change "extras_require", please change the `pylsp.builtin.extrasArgs` setting

**example**:

- Example1: `"pylsp.builtin.extrasArgs": []`
  - `pip install python-lsp-server`
- Example2: `"pylsp.builtin.extrasArgs": ["all"]`:
  - `pip install 'python-lsp-server[all]'`
- Example3: `"pylsp.builtin.extrasArgs": ["yapf", "flake8"]`:
  - `pip install 'python-lsp-server[yapf,flake8]'`

---

<!-- markdownlint-disable-next-line -->
The first time you use coc-pylsp, if pylsp is not detected, you will be prompted to do a built-in installation.

You can also run the installation command manually.

```vim
:CocComannd pylsp.installServer
```

## Configuration options

- `pylsp.enable`: Enable coc-pylsp extension, default: `true`
- `pylsp.commandPath`: Custom path to the pylsp command. `~` and `$HOME`, etc. can also be used. If not set, pylsp detected by the current python environment or extension venv's pylsp used will be used, default: `""`
- `pylsp.pylsp.builtin.pythonPath`: Python 3.x path (Absolute path) to be used for built-in install, default: `""`
- `pylsp.builtin.extrasArgs`: Setting extras_require for built-in installation, default: `["all"]`

For other settings, Check the "configuration" section of [package.json](/package.json).

## Commands

- `pylsp.installServer`: Install pylsp (builtin)
  - It will be installed in this path:
    - Mac/Linux: `~/.config/coc/extensions/@yaegassy/coc-pylsp-data/pylsp/venv/bin/pylsp`
    - Windows: `~/AppData/Local/coc/extensions/@yaegassy/coc-pylsp-data/pylsp/venv/Scripts/pylsp.exe`

## Thanks

- [python-lsp/python-lsp-server](https://github.com/python-lsp/python-lsp-server)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
