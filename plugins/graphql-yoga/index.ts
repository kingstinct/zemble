
import { YogaServerOptions } from 'graphql-yoga';
import { Hono } from 'hono'
import { mergeSchemas } from '@graphql-tools/schema'
import { GraphQLSchemaWithContext } from 'graphql-yoga'

import createPluginSchema from './utils/createPluginSchema'
import handleYoga from './utils/handleYoga'

import { PluginConfig } from '@readapt/core/types'
import fs from 'fs'
import path from 'path'

declare global {
  namespace Readapt {
    interface Config {
      skipGraphQL?: boolean
    }
  }
}

const processPluginSchema = async  (pluginPath: string) => {
  const graphqlPath = path.join(pluginPath, '/graphql')
  const hasGraphQL = fs.existsSync(graphqlPath)
  if (hasGraphQL) {
    return [await createPluginSchema(graphqlPath)]
  }
  return []
}

type GraphQLPluginConfig = Omit<YogaServerOptions<{}, {}>, 'schema'>

const initializeGraphQL = async (plugins: PluginConfig<{}>[], app: Hono, config: GraphQLPluginConfig) => {
  const selfSchemas = await processPluginSchema(process.cwd())

  const pluginsToAdd = plugins.filter(({ config }) => !config.skipGraphQL)

  const graphQLSchemas = await pluginsToAdd.reduce(async (
    prev, 
    { pluginPath }
  ) => {
    const toReturn: GraphQLSchemaWithContext<{}>[] = [
      ...await prev,
      ...await processPluginSchema(pluginPath)
    ]
    return toReturn
  }, Promise.resolve(selfSchemas))

  const mergedSchema = mergeSchemas({
    schemas: graphQLSchemas,
    resolverValidationOptions: {
      requireResolversForArgs: 'warn',
    }
  })

  app.use(config.graphqlEndpoint, handleYoga(mergedSchema, config))
}

const defaults = {
  graphqlEndpoint: '/graphql',
  skipGraphQL: true // the graphql routes defined are not really useful in most cases
} satisfies GraphQLPluginConfig & Readapt.Config

export default new PluginConfig<GraphQLPluginConfig, typeof defaults>(__dirname, {
  defaultConfig: defaults,
  middleware: initializeGraphQL,
})