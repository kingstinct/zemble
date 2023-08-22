import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as fs from 'node:fs'
import * as path from 'node:path'
import readRoutes from './utils/readRoutes'
import readDir from './utils/readDir'
import createPluginSchema from './utils/createPluginSchema'
import { mergeSchemas } from '@graphql-tools/schema'
import handleYoga from './utils/handleYoga'
import { GraphQLSchemaWithContext } from 'graphql-yoga'
import { cors } from 'hono/cors'
import setupQueues from './utils/setupQueues'

const app = new Hono()
app.use('*', cors())

const nodeModules = path.join(process.cwd(), 'node_modules');

export type Middleware = {
  setup: (app: Hono) => (Promise<void> | void),
} 

async function loadPlugin(pluginPath: string, graphQLSchemas: GraphQLSchemaWithContext<{}>[]) {
  const routePath = path.join(pluginPath, '/routes')
  const middlewarePath = path.join(pluginPath, '/middleware')
  const graphqlPath = path.join(pluginPath, '/graphql')
  const queuePath = path.join(pluginPath, '/queues')

  const hasGraphQL = fs.existsSync(graphqlPath)

  if (hasGraphQL) {
    graphQLSchemas = [...graphQLSchemas, await createPluginSchema(graphqlPath)]
  }

  const hasRoutes = fs.existsSync(routePath)

  if (hasRoutes) {
    const filesWithContent = await readRoutes(routePath)

    Object.keys(filesWithContent).forEach((filename) => {
      app.use(filename, filesWithContent[filename])
    })
  }

  const hasMiddleware = fs.existsSync(middlewarePath)

  if (hasMiddleware) {
    const filenames = readDir(middlewarePath)

    filenames.forEach(async (filename) => {
      const middleware = (await import(path.join(middlewarePath, filename))).default as Middleware
      await middleware.setup(app)
    })
  }

  setupQueues(pluginPath)

  return graphQLSchemas
}

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

const start = async () => {
  app.get('/', (c) => c.text('Hello ReAdapt! Serving ' + packageJson.name))

  const plugins = readDir(nodeModules, 'readapt-plugin-')
  let graphQLSchemas: GraphQLSchemaWithContext<{}>[] = []
  if(packageJson.name.startsWith('readapt-plugin-')) {
    graphQLSchemas = await loadPlugin(process.cwd(), graphQLSchemas)
  }
  await plugins.reduce(async (prev: Promise<void>, pluginName: string) => {
    await prev;
    graphQLSchemas = await loadPlugin(path.join(nodeModules,pluginName), graphQLSchemas)
  }, Promise.resolve(undefined))

  const mergedSchema = mergeSchemas({
    schemas: graphQLSchemas,
    resolverValidationOptions: {
      requireResolversForArgs: 'warn',
    }
  })

  app.use('/graphql', handleYoga(mergedSchema))

  serve(app, (info) => console.log(info))
}

start()
