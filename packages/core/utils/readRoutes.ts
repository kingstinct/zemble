import * as fs from 'node:fs'
import * as path from 'node:path'

import type { MiddlewareHandler } from 'hono'

export const readRoutes = async (rootDir: string, prefix = ''): Promise<Record<string, MiddlewareHandler>> => fs.readdirSync(path.join(rootDir, prefix)).reduce(async (prev, filename) => {
  const route = path.join(rootDir, prefix, filename)

  const tat = fs.statSync(route)

  if (tat.isDirectory()) {
    const newRoutes = await readRoutes(rootDir, path.join(prefix, filename))
    return { ...await prev, ...newRoutes }
  }

  const fileNameWithoutExtension = filename.substring(0, filename.length - 3)
  try {
    const item = await import(route)
    const newRoutes = { ...await prev, [path.join(prefix, fileNameWithoutExtension)]: item.default }

    return newRoutes
  } catch (error) {
    console.log(error)

    return prev
  }
}, Promise.resolve({} as Record<string, MiddlewareHandler>))

export default readRoutes
