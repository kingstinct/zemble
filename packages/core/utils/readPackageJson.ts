import fs from 'fs'
import { join } from 'node:path'

export const readPackageJson = (path = process.cwd()): { readonly name: string, readonly version: string } => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(join(path, 'package.json'), 'utf8'))

    if (!packageJson.name) {
      throw new Error(`[@zemble] Invalid package.json, missing "name", looked in: ${packageJson.name}`)
    }

    if (!packageJson.version) {
      throw new Error(`[@zemble] Invalid package.json, missing "version", looked in: ${packageJson.name}`)
    }

    return packageJson
  } catch (e) {
    throw new Error(`[@zemble] Invalid package.json, expected at path: ${path}`)
  }
}
