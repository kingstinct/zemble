import {join} from "node:path";
import fs from "fs";

export const readPackageJson = (path = process.cwd()) => {
  const packageJson = JSON.parse(fs.readFileSync(join(path, 'package.json'), 'utf8'));
  return packageJson
}