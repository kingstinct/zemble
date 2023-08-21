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

const app = new Hono()

const nodeModules = path.join(process.cwd(), 'node_modules');

async function loadPlugin(pluginPath: string, graphQLSchemas: GraphQLSchemaWithContext<{}>[]) {
  const routePath = path.join(pluginPath, '/routes')
  const graphqlPath = path.join(pluginPath, '/graphql')

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
  })

  app.use('/graphql', handleYoga(mergedSchema))

  serve(app, (info) => console.log(info))
}

start()
