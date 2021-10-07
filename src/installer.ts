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
  statusItem.text = `Install pylsp and related tools...`;
  statusItem.show();

  const extConfig = workspace.getConfiguration('pylsp');
  const extrasArgs = extConfig.get('builtin.installExtrasArgs', []);
  const enableInstallPylspMypy = extConfig.get<boolean>('builtin.enableInstallPylspMypy', false);
  const enableInstallPylsIsort = extConfig.get<boolean>('builtin.enableInstallPylsIsort', false);
  const enableInstallPythonLspBlack = extConfig.get<boolean>('builtin.enableInstallPythonLspBlack', false);

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

  if (enableInstallPylspMypy) {
    installCmd = installCmd.concat(' ', 'pylsp-mypy');
  }
  if (enableInstallPylsIsort) {
    installCmd = installCmd.concat(' ', 'pyls-isort');
  }
  if (enableInstallPythonLspBlack) {
    installCmd = installCmd.concat(' ', 'python-lsp-black');
  }

  rimraf.sync(pathVenv);
  try {
    window.showMessage(`Install pylsp and related tools...`);
    await exec(installCmd);
    statusItem.hide();
    window.showMessage(`pylsp and related tools: installed!`);
  } catch (error) {
    statusItem.hide();
    window.showErrorMessage(`pylsp and related tools: install failed. | ${error}`);
    throw new Error();
  }
}
