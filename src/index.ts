import {
  commands,
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  services,
  workspace,
  window,
  WorkspaceConfiguration,
} from 'coc.nvim';

import fs from 'fs';
import path from 'path';

import child_process from 'child_process';
import util from 'util';

import which from 'which';

import { pylspInstall } from './installer';

const exec = util.promisify(child_process.exec);

export async function activate(context: ExtensionContext): Promise<void> {
  const { subscriptions } = context;
  const extensionConfig = workspace.getConfiguration('pylsp');
  const enable = extensionConfig.enable;
  if (!enable) return;

  const extensionStoragePath = context.storagePath;
  if (!fs.existsSync(extensionStoragePath)) {
    fs.mkdirSync(extensionStoragePath);
  }

  // MEMO: Priority to detect pylsp
  //
  // 1. pylsp.commandPath setting
  // 2. Module in the current python3 environment (e.g. venv)
  // 3. builtin pylsp
  let isModule = false;
  let pylspPath = extensionConfig.get('commandPath', '');
  if (!pylspPath) {
    // MEMO: require, await
    if (await existsEnvPylsp(getPythonPath(extensionConfig))) {
      pylspPath = 'dummy';
      isModule = true;
    } else if (
      fs.existsSync(path.join(context.storagePath, 'pylsp', 'venv', 'Scripts', 'pylsp.exe')) ||
      fs.existsSync(path.join(context.storagePath, 'pylsp', 'venv', 'bin', 'pylsp'))
    ) {
      if (process.platform === 'win32') {
        pylspPath = path.join(context.storagePath, 'pylsp', 'venv', 'Scripts', 'pylsp.exe');
      } else {
        pylspPath = path.join(context.storagePath, 'pylsp', 'venv', 'bin', 'pylsp');
      }
    }
  }

  const pythonCommand = getPythonPath(extensionConfig);

  // Install "pylsp" if it does not exist.
  if (!pylspPath) {
    if (pythonCommand) {
      await installWrapper(pythonCommand, context);
    } else {
      window.showErrorMessage('python3/python command not found');
    }

    if (process.platform === 'win32') {
      pylspPath = path.join(context.storagePath, 'pylsp', 'venv', 'Scripts', 'pylsp.exe');
    } else {
      pylspPath = path.join(context.storagePath, 'pylsp', 'venv', 'bin', 'pylsp');
    }
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
      await installWrapper(pythonCommand, context);
      client.start();
    })
  );

  let command = pylspPath;
  if (isModule) {
    command = 'pylsp';
  }

  const serverOptions: ServerOptions = {
    command,
    args: ['-vv'],
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['python'],
    synchronize: {
      configurationSection: 'pylsp',
    },
    outputChannelName: 'pylsp',
    revealOutputChannelOn: RevealOutputChannelOn.Never,
    initializationOptions: extensionConfig.initializationOptions || {},
  };

  const client = new LanguageClient('pylsp', 'Python language server', serverOptions, clientOptions);

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

async function existsEnvPylsp(pythonPath: string): Promise<boolean> {
  const checkCmd = `${pythonPath} -m pylsp -h`;
  try {
    await exec(checkCmd);
    return true;
  } catch (error) {
    return false;
  }
}

function getPythonPath(config: WorkspaceConfiguration): string {
  let pythonPath = config.get<string>('builtin.pythonPath', '');
  if (pythonPath) {
    return pythonPath;
  }

  try {
    which.sync('python3');
    pythonPath = 'python3';
    return pythonPath;
  } catch (e) {
    // noop
  }

  try {
    which.sync('python');
    pythonPath = 'python';
    return pythonPath;
  } catch (e) {
    // noop
  }

  return pythonPath;
}
