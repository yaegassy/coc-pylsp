# coc-pylsp

[pylsp](https://github.com/python-lsp/python-lsp-server) (python-lsp-server) extension for [coc.nvim](https://github.com/neoclide/coc.nvim).

## What pylsp (python-lsp/python-lsp-server)

Currently, `pyls` (palantir/python-language-server) seems to be stagnant in maintenance.

<!-- markdownlint-disable-next-line -->
The `pylsp` (python-lsp/python-lsp-server) is a fork of `pyls` that has been tweaked and updated by `pyls` committers (mainly the Spider IDE team) to reflect "known issues that need to be updated". REF: <https://github.com/python-lsp/python-lsp-server/issues/4>

## Install

**CocInstall**:

> TODO

**vim-plug**:

```vim
Plug 'yaegassy/coc-pylsp', {'do': 'yarn install --frozen-lockfile'}
```

## Detect: pylsp (python-lsp-server)

coc-pylsp detects and starts pylsp.

**Priority to detect**:

1. pylsp.commandPath
1. current python3 environment (e.g. pylsp in venv)
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
- `pylsp.commandPath`: The custom path to the pylsp (Absolute path), default: `""`
- `pylsp.builtin.extrasArgs`: Setting extras_require for built-in installation, default: `["all"]`
- `pylsp.configurationSources`: List of configuration sources to use, valid options `["pycodestyle", "pyflakes"]`, default: `["pycodestyle"]`
- `pylsp.plugins.jedi.extra_paths`: Define extra paths for jedi.Script, default: `[]`
- `pylsp.plugins.jedi.env_vars`: Define environment variables for jedi.Script and Jedi.names, type: dictinary,  default: `null`
- `pylsp.plugins.jedi.environment`: Define environment for jedi.Script and Jedi.names, type: string, default: `null`
- `pylsp.plugins.jedi_completion.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.jedi_completion.include_params`: Auto-completes methods and classes with tabstops for each parameter, default: `true`
- `pylsp.plugins.jedi_completion.include_class_objects`: Adds class objects as a separate completion item, default: `true`
- `pylsp.plugins.jedi_completion.fuzzy`: Enable fuzzy when requesting autocomplete, default: `false`
- `pylsp.plugins.jedi_definition.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.jedi_definition.follow_imports`: The goto call will follow imports, default: `true`
- `pylsp.plugins.jedi_definition.follow_builtin_imports`: If follow_imports is True will decide if it follow builtin imports, default: `true`
- `pylsp.plugins.jedi_hover.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.jedi_references.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.jedi_signature_help.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.jedi_symbols.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.jedi_symbols.all_scopes`: If True lists the names of all scopes instead of only the module namespace, default: `true`
- `pylsp.plugins.mccabe.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.mccabe.threshold`: The minimum threshold that triggers warnings about cyclomatic complexity, type: number, default: `15`
- `pylsp.plugins.preload.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.preload.modules`: List of modules to import on startup, type: array[string], default: `null`
- `pylsp.plugins.pycodestyle.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.pycodestyle.exclude`: Exclude files or directories which match these patterns, type: array[string], default: `null`
- `pylsp.plugins.pycodestyle.filename`: When parsing directories, only check filenames matching these patterns, type: array[string], default: `null`
- `pylsp.plugins.pycodestyle.select`: Select errors and warnings, type: array[string], default: `null`
- `pylsp.plugins.pycodestyle.ignore`: Ignore errors and warnings, type: array[string], default: `null`
- `pylsp.plugins.pycodestyle.hangClosing`: Hang closing bracket instead of matching indentation of opening bracket's line, type: boolean, default: `null`
- `pylsp.plugins.pycodestyle.maxLineLength`: Set maximum allowed line length, type: number, default: `null`
- `pylsp.plugins.pydocstyle.enabled`: Enable or disable the plugin, default: `false`
- `pylsp.plugins.pydocstyle.convention`: Choose the basic list of checked errors by specifying an existing convention, valid options ["pep257", "numpy"], default: `null`
- `pylsp.plugins.pydocstyle.addIgnore`: Ignore errors and warnings in addition to the specified convention, type: array[string], default: `null`
- `pylsp.plugins.pydocstyle.addSelect`: Select errors and warnings in addition to the specified convention, type: array[string], default: `null`
- `pylsp.plugins.pydocstyle.ignore`: Ignore errors and warnings, type: array[string], default: `null`
- `pylsp.plugins.pydocstyle.select`: Select errors and warnings, type: array[string], default: `null`
- `pylsp.plugins.pydocstyle.match`: Check only files that exactly match the given regular expression; default is to match files that don't start with 'test_' but end with '.py', default: `(?!test_).*\\.py`
- `pylsp.plugins.pydocstyle.matchDir`: Search only dirs that exactly match the given regular expression; default is to match dirs which do not begin with a dot, default: `"[^\\.].*"`
- `pylsp.plugins.pyflakes.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.plugins.pylint.enabled`: Enable or disable the plugin, default: `false`
- `pylsp.plugins.pylint.args`: Arguments to pass to pylint, type: array[string], default: `null`
- `pylsp.plugins.pylint.executable`: Executable to run pylint with. Enabling this will run pylint on unsaved files via stdin. Can slow down workflow. Only works with python3, default: `null`
- `pylsp.plugins.rope_completion.enabled`: Enable or disable the plugin, default: `false`
- `pylsp.plugins.yapf.enabled`: Enable or disable the plugin, default: `true`
- `pylsp.rope.extensionModules`: Builtin and c-extension modules that are allowed to be imported and inspected by rope, default: `null`
- `pylsp.rope.ropeFolder`: The name of the folder in which rope stores project configurations and data.  Pass `null` for not using such a folder at all, type: array[string], default: `null`

## Commands

- `pylsp.installServer`: Install pylsp (builtin)
  - It will be installed in this path:
    - Mac/Linux: `~/.config/coc/extensions/coc-pylsp-data/pylsp/venv/bin/pylsp`
    - Windows: `~/AppData/Local/coc/extensions/coc-pylsp-data/pylsp/venv/bin/pylsp`

## Other python-related coc.nvim extensions

- [fannheyward/coc-pyright](https://github.com/fannheyward/coc-pyright)
  - coc-pyright is based on [Pyright](https://github.com/microsoft/pyright), static type checker for Python, which also provides LSP features such as complet suggestions, hover documents, goto definitions and so on
  - coc-pyright also ports some features from vscode-python, runs Python tools like flake8, mypy, pylint, black, autopep8, yapf, isort, etc...
  - I use it regularly too. (`@yaegassy`)
- [pappasam/coc-jedi](https://github.com/pappasam/coc-jedi)
  - coc-jedi is a wrapper of jedi-language-server, based on Jedi
- [iamcco/coc-diagnostic](https://github.com/iamcco/coc-diagnostic)
  - It can be easily integrated with linter(flake8, mypy, etc...) and formatter(black, autopep8, yapf, isort, etc..).
- [yaegassy/coc-pydocstring](https://github.com/yaegassy/coc-pydocstring)
  - Quickly generate docstrings for python.

## Thanks

- [python-lsp/python-lsp-server](https://github.com/python-lsp/python-lsp-server)

## License

MIT

---

> This extension is built with [create-coc-extension](https://github.com/fannheyward/create-coc-extension)
