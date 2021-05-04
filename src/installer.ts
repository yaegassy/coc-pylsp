import { ExtensionContext, window, workspace } from 'coc.nvim';

import path from 'path';

import rimraf from 'rimraf';
import child_process from 'child_process';
import util from 'util';

import { PYLSP_VERSION } from './constant';

const exec = util.promisify(child_process.exec);

export async function pylspInstall(pythonCommand: string, context: ExtensionContext): Promise<void> {
  const pathVenv = path.join(context.storagePath, 'pylsp', 'venv');

  let pathVenvPython = path.join(context.storagePath, 'pylsp', 'venv', 'bin', 'python');
  if (process.platform === 'win32') {
    pathVenvPython = path.join(context.storagePath, 'pylsp', 'venv', 'Scripts', 'python');
  }

  const statusItem = window.createStatusBarItem(0, { progress: true });
  statusItem.text = `Install pylsp...`;
  statusItem.show();

  const extensionConfig = workspace.getConfiguration('pylsp');
  const extrasArgs = extensionConfig.get('builtin.extrasArgs', []);

  let installCmd: string;
  if (extrasArgs.length >= 1) {
    const installEtrasArgs = extrasArgs.join(',');
    installCmd =
      `${pythonCommand} -m venv ${pathVenv} && ` +
      `${pathVenvPython} -m pip install -U pip python-lsp-server[${installEtrasArgs}]==${PYLSP_VERSION}`;
  } else {
    installCmd =
      `${pythonCommand} -m venv ${pathVenv} && ` +
      `${pathVenvPython} install -U pip python-lsp-server==${PYLSP_VERSION}`;
  }

  rimraf.sync(pathVenv);
  try {
    window.showMessage(`Install pylsp...`);
    await exec(installCmd);
    statusItem.hide();
    window.showMessage(`pylsp: installed!`);
  } catch (error) {
    statusItem.hide();
    window.showErrorMessage(`pylsp: install failed. | ${error}`);
    throw new Error();
  }
}
