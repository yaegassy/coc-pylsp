import {
  commands,
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  services,
  ServerOptions,
  window,
  workspace,
} from 'coc.nvim';

import fs from 'fs';

import { pylspInstall } from './installer';
import { existsPythonImportModule, getBuiltinToolPath, getCurrentPythonPath } from './tool';

export async function activate(context: ExtensionContext): Promise<void> {
  const extConfig = workspace.getConfiguration('pylsp');
  const enable = extConfig.enable;
  if (!enable) return;

  const extensionStoragePath = context.storagePath;
  if (!fs.existsSync(extensionStoragePath)) {
    fs.mkdirSync(extensionStoragePath, { recursive: true });
  }

  const { subscriptions } = context;
  const pythonCommand = getCurrentPythonPath(extConfig);

  // MEMO: Priority to detect pylsp
  //
  // 1. pylsp.commandPath setting
  // 2. Module in the current python3/python environment (e.g. venv)
  // 3. builtin pylsp
  let existsPylspModule = false;
  let pylspPath: string | undefined = extConfig.get('commandPath', '');
  if (pylspPath) {
    workspace.expand(pylspPath);
    if (!fs.existsSync(pylspPath)) {
      pylspPath = undefined;
    }
  }
  if (!pylspPath) {
    if (pythonCommand) {
      if (await existsPythonImportModule(pythonCommand.env, 'pylsp')) {
        pylspPath = 'dummy';
        existsPylspModule = true;
      }

      if (!existsPylspModule) {
        pylspPath = getBuiltinToolPath(context.storagePath, 'pylsp');
      }
    }
  }

  // Install "pylsp" if it does not exist.
  if (!pylspPath && !existsPylspModule) {
    if (pythonCommand) {
      await installWrapper(pythonCommand.real, context);
    } else {
      window.showErrorMessage('python3/python command not found');
    }
    pylspPath = getBuiltinToolPath(context.storagePath, 'pylsp');
  }

  // If "pylsp" does not exist completely, terminate the process.
  if (!pylspPath) {
    window.showErrorMessage('Exit because "pylsp" does not exist.');
    return;
  }

  context.subscriptions.push(
    commands.registerCommand('pylsp.installServer', async () => {
      if (client.serviceState !== 5) {
        await client.stop();
      }
      if (pythonCommand) {
        await installWrapper(pythonCommand.real, context);
      }
      client.start();
    })
  );

  const serverOptions: ServerOptions = {
    command: existsPylspModule ? 'pylsp' : pylspPath,
    args: ['-vv'],
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['python'],
    synchronize: {
      configurationSection: 'pylsp',
    },
    outputChannelName: 'pylsp',
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    initializationOptions: extConfig.initializationOptions || {},
  };

  const client = new LanguageClient('pylsp', 'Python lsp server', serverOptions, clientOptions);

  subscriptions.push(services.registLanguageClient(client));
}

async function installWrapper(pythonCommand: string, context: ExtensionContext) {
  const msg = 'Install "pylsp"?';
  context.workspaceState;

  let ret = 0;
  ret = await window.showQuickpick(['Yes', 'Cancel'], msg);
  if (ret === 0) {
    try {
      await pylspInstall(pythonCommand, context);
    } catch (e) {
      return;
    }
  } else {
    return;
  }
}
