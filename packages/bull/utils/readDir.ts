import * as fs from 'node:fs'

export const readDir = (dir: string, withPrefix?: string): readonly string[] =>
  fs
    .readdirSync(dir)
    .filter((file) => (withPrefix ? file.startsWith(withPrefix) : true))

export default readDir
