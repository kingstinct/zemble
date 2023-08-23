import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import * as fs from 'node:fs'
import * as path from 'node:path'
import readDir from './utils/readDir'
import { mergeSchemas } from '@graphql-tools/schema'
import handleYoga from './utils/handleYoga'
import { GraphQLSchemaWithContext } from 'graphql-yoga'
import { cors } from 'hono/cors'
import initializePlugin from './utils/initializePlugin'

const app = new Hono()
app.use('*', cors())

const nodeModules = path.join(process.cwd(), 'node_modules');

export type Middleware = {
  setup: (app: Hono) => (Promise<void> | void),
} 

const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));

const start = async () => {
  app.get('/', (c) => c.text('Hello ReAdapt! Serving ' + packageJson.name))

  const plugins = readDir(nodeModules, 'readapt-plugin-')

  const selfSchemas = await initializePlugin({ pluginPath: process.cwd(), app })

  const graphQLSchemas = await plugins.reduce(async (
    prev, 
    pluginName: string
  ) => {
    const toReturn: GraphQLSchemaWithContext<{}>[] = [
      ...await prev,
      ...await initializePlugin({ pluginPath: path.join(nodeModules, pluginName), app })
    ]
    return toReturn
  }, Promise.resolve(selfSchemas))

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
