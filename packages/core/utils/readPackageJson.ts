import fs from 'fs'
import { join } from 'node:path'

export const readPackageJson = (path = process.cwd()) => {
  try {
    const packageJson = JSON.parse(fs.readFileSync(join(path, 'package.json'), 'utf8')) as { readonly name: string, readonly version: string }

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
