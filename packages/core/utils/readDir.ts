import { MiddlewareHandler } from 'hono';
import * as fs from 'node:fs'
import * as path from 'node:path'

export const readDir = (dir: string, withPrefix?: string): string[] => {
  return fs.readdirSync(dir).filter((file) => {
    return withPrefix ? file.startsWith(withPrefix) : true
  })
}

export default readDir