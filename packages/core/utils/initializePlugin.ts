import { Hono } from 'hono'
import * as fs from 'node:fs'
import * as path from 'node:path'
import readRoutes from '../utils/readRoutes'

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
  app 
} : { 
  pluginPath: string;
  app: Hono 
}) {
  const routePath = path.join(pluginPath, '/routes')
  initializeRoutes(routePath, app)
}


export default initializePlugin