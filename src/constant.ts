import fs from 'fs';
import path from 'path';
import toml from 'toml';

type PyprojectToml = {
  tool: {
    poetry: {
      dependencies: {
        [name: string]: string;
      };
    };
  };
};

function getPackageVersion(name: string) {
  const rootDir = path.resolve(path.dirname(__filename), '..');
  const filePath = path.join(rootDir, 'pyproject.toml');
  const fileStr = fs.readFileSync(filePath);
  const data: PyprojectToml = toml.parse(fileStr.toString());
  const version = data.tool.poetry.dependencies[name];

  return version;
}

export const PYLSP_VERSION = getPackageVersion('python-lsp-server');
