import { WorkspaceConfiguration } from 'coc.nvim';

import child_process from 'child_process';
import util from 'util';

import fs from 'fs';
import path from 'path';
import which from 'which';

const exec = util.promisify(child_process.exec);

type PythonPaths = {
  env: string;
  real: string;
};

export function getCurrentPythonPath(config: WorkspaceConfiguration): PythonPaths | undefined {
  let pythonPaths: PythonPaths | undefined;

  let pythonPath = config.get<string>('python.interpreterPath', '');
  if (pythonPath) {
    pythonPaths = {
      env: pythonPath,
      real: fs.realpathSync(pythonPath),
    };
    return pythonPaths;
  }

  try {
    pythonPath = which.sync('python3');
    pythonPaths = {
      env: pythonPath,
      real: fs.realpathSync(pythonPath),
    };
    return pythonPaths;
  } catch (e) {
    // noop
  }

  try {
    pythonPath = which.sync('python');
    pythonPaths = {
      env: pythonPath,
      real: fs.realpathSync(pythonPath),
    };
    return pythonPaths;
  } catch (e) {
    // noop
  }

  return pythonPaths;
}

export async function existsPythonImportModule(pythonPath: string, moduleName: string): Promise<boolean> {
  const checkCmd = `${pythonPath} -c "import ${moduleName}"`;
  try {
    await exec(checkCmd);
    return true;
  } catch (error) {
    return false;
  }
}

export function getBuiltinToolPath(extensionStoragePath: string, toolName: string): string {
  let toolPath = '';

  //
  // pylsp
  //
  if (toolName === 'pylsp') {
    if (
      fs.existsSync(path.join(extensionStoragePath, 'pylsp', 'venv', 'Scripts', 'pylsp.exe')) ||
      fs.existsSync(path.join(extensionStoragePath, 'pylsp', 'venv', 'bin', 'pylsp'))
    ) {
      if (process.platform === 'win32') {
        toolPath = path.join(extensionStoragePath, 'pylsp', 'venv', 'Scripts', 'pylsp.exe');
      } else {
        toolPath = path.join(extensionStoragePath, 'pylsp', 'venv', 'bin', 'pylsp');
      }
    }
  }

  return toolPath;
}
