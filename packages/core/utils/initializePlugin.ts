import { Hono } from 'hono'
import * as fs from 'node:fs'
import * as path from 'node:path'
import readRoutes from '../utils/readRoutes'
import readDir from '../utils/readDir'
import createPluginSchema from '../utils/createPluginSchema'
import setupQueues from '../utils/setupQueues'

export type Middleware = {
  setup: (app: Hono) => (Promise<void> | void),
}

const initializeRoutes = async (routePath: string, app: Hono) => {
  const hasRoutes = fs.existsSync(routePath)

  if (hasRoutes) {
    const filesWithContent = await readRoutes(routePath)

    Object.keys(filesWithContent).forEach((filename) => {
      app.use(filename, filesWithContent[filename])
    })
  }
}

const initializeMiddleware = async (middlewarePath: string, app: Hono) => {
  const hasMiddleware = fs.existsSync(middlewarePath)

  if (hasMiddleware) {
    const filenames = readDir(middlewarePath)

    filenames.forEach(async (filename) => {
      const middleware = (await import(path.join(middlewarePath, filename))).default as Middleware
      await middleware.setup(app)
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

  const middlewarePath = path.join(pluginPath, '/middleware')
  initializeMiddleware(middlewarePath, app)

  setupQueues(pluginPath)

  const graphqlPath = path.join(pluginPath, '/graphql')
  const hasGraphQL = fs.existsSync(graphqlPath)
  if (hasGraphQL) {
    return [await createPluginSchema(graphqlPath)]
  }
  return []
}


export default initializePlugin