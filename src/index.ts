import {
  commands,
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  RevealOutputChannelOn,
  ServerOptions,
  services,
  ServiceStat,
  window,
  workspace,
} from 'coc.nvim';

import fs from 'fs';
import net from 'net';
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
  const connectionMode = extConfig.get<string>('connectionMode', 'stdio');
  const tcpHost = extConfig.get<string>('tcpHost', '127.0.0.1');
  const tcpPort = extConfig.get<number>('tcpPort', 2087);

  // MEMO: Priority to detect pylsp
  //
  // 1. pylsp.commandPath setting
  // 2. Module in the current python3/python environment (e.g. venv)
  // 3. builtin pylsp
  let existsPylspModule = false;
  let pylspPath: string | undefined = extConfig.get('commandPath', '');

  if (connectionMode === 'stdio') {
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
  }

  // old command. It is kept for compatibility,
  // but will be removed in the future.
  context.subscriptions.push(
    commands.registerCommand('pylsp.installServer', async () => {
      if (client.serviceState !== ServiceStat.Stopped) {
        await client.stop();
      }
      if (pythonCommand) {
        await installWrapper(pythonCommand.real, context);
      }
      client.start();
    })
  );

  context.subscriptions.push(
    commands.registerCommand('pylsp.builtin.install', async () => {
      if (client.serviceState !== ServiceStat.Stopped) {
        await client.stop();
      }
      if (pythonCommand) {
        await installWrapper(pythonCommand.real, context);
      }
      client.start();
    })
  );

  let serverOptions: ServerOptions;
  if (connectionMode === 'tcp') {
    serverOptions = useLanguageServerOverTCP(tcpHost, tcpPort);
  } else {
    const lsCommand = existsPylspModule ? 'pylsp' : pylspPath;
    serverOptions = useLanguageServerOverStdio(lsCommand);
  }

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

function useLanguageServerOverTCP(host: string, port: number): ServerOptions {
  return () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve, reject) => {
      const clientSocket = new net.Socket();
      clientSocket.connect(port, host, () => {
        resolve({
          reader: clientSocket,
          writer: clientSocket,
        });
      });
    });
  };
}

function useLanguageServerOverStdio(lsCommand: string): ServerOptions {
  return {
    command: lsCommand,
    args: ['-vv'],
  };
}

async function installWrapper(pythonCommand: string, context: ExtensionContext) {
  const msg = 'Install pylsp and related tools...?';
  const ret = await window.showPrompt(msg);
  if (ret) {
    try {
      await pylspInstall(pythonCommand, context);
    } catch (e) {
      return;
    }
  } else {
    return;
  }
}
