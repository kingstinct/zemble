import * as fs from 'node:fs'
import * as path from 'node:path'

import readRoutes from './readRoutes'

import type { Hono } from 'hono'

const initializeRoutes = async (routePath: string, app: Hono) => {
  const hasRoutes = fs.existsSync(routePath)

  if (hasRoutes) {
    const filesWithContent = await readRoutes(routePath)

    Object.keys(filesWithContent).forEach((filename) => {
      app.use(filename, filesWithContent[filename])
    })
  }
}

export async function initializePlugin(
  {
    pluginPath,
    app,
  }: {
    readonly pluginPath: string;
    readonly app: Hono
  },
) {
  const routePath = path.join(pluginPath, '/routes')
  await initializeRoutes(routePath, app)
}

export default initializePlugin
