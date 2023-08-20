import { MiddlewareHandler } from 'hono';
import * as fs from 'node:fs'
import * as path from 'node:path'

export const readDir = (dir: string): string[] => {
  return fs.readdirSync(dir)
}

export default readDir