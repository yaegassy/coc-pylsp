import { ExtensionContext, window, workspace } from 'coc.nvim';

import path from 'path';

import { rimrafSync } from 'rimraf';
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
  const enableInstallPylspRope = extConfig.get<boolean>('builtin.enableInstallPylspRope', false);
  const enableInstallPythonLspRuff = extConfig.get<boolean>('builtin.enableInstallPythonLspRuff', false);

  const pylspMypyVersion = extConfig.get<string>('builtin.pylspMypyVersion', '');
  const pylsIsortVersion = extConfig.get<string>('builtin.pylsIsortVersion', '');
  const pythonLspBlackVersion = extConfig.get<string>('builtin.pythonLspBlackVersion', '');
  const pylspRopeVersion = extConfig.get<string>('builtin.pylspRopeVersion', '');
  const pythonLspRuffVersion = extConfig.get<string>('builtin.pythonLspRuffVersion', '');

  let installCmd: string;
  if (extrasArgs.length >= 1) {
    const installEtrasArgs = extrasArgs.join(',');
    installCmd =
      `"${pythonCommand}" -m venv ${pathVenv} && ` +
      `${pathVenvPython} -m pip install -U pip python-lsp-server[${installEtrasArgs}]==${PYLSP_VERSION}`;
  } else {
    installCmd =
      `"${pythonCommand}" -m venv ${pathVenv} && ` +
      `${pathVenvPython} install -U pip python-lsp-server==${PYLSP_VERSION}`;
  }

  if (enableInstallPylspMypy) {
    const installPylspMypyStr = installToolVersionStr('pylsp-mypy', pylspMypyVersion);
    installCmd = installCmd.concat(' ', installPylspMypyStr);
  }
  if (enableInstallPylsIsort) {
    const installPylsIsortStr = installToolVersionStr('pyls-isort', pylsIsortVersion);
    installCmd = installCmd.concat(' ', installPylsIsortStr);
  }
  if (enableInstallPythonLspBlack) {
    const installPythonLspBlackStr = installToolVersionStr('python-lsp-black', pythonLspBlackVersion);
    installCmd = installCmd.concat(' ', installPythonLspBlackStr);
  }
  if (enableInstallPylspRope) {
    const installPylspRopeStr = installToolVersionStr('pylsp-rope', pylspRopeVersion);
    installCmd = installCmd.concat(' ', installPylspRopeStr);
  }
  if (enableInstallPythonLspRuff) {
    const installPythonLspRuff = installToolVersionStr('python-lsp-ruff', pythonLspRuffVersion);
    installCmd = installCmd.concat(' ', installPythonLspRuff);
  }

  rimrafSync(pathVenv);
  try {
    window.showInformationMessage(`Install pylsp and related tools...`);
    await exec(installCmd);
    statusItem.hide();
    window.showInformationMessage(`pylsp and related tools: installed!`);
  } catch (error) {
    statusItem.hide();
    window.showErrorMessage(`pylsp and related tools: install failed. | ${error}`);
    throw new Error();
  }
}

function installToolVersionStr(name: string, version?: string): string {
  let installStr: string;

  if (version) {
    installStr = `${name}==${version}`;
  } else {
    installStr = `${name}`;
  }

  return installStr;
}
