import { createDefaultExecutor } from '@graphql-tools/delegate'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { mergeResolvers } from '@graphql-tools/merge'
import { addResolversToSchema } from '@graphql-tools/schema'
import { defaultCreateProxyingResolver, wrapSchema } from '@graphql-tools/wrap'
import fs from 'node:fs'
import path, { join } from 'node:path'

import readResolvers from './readResolvers'

import type { Plugin } from '@zemble/core'

export const createPluginSchema = async (plugin: Plugin) => {
  const graphqlDir = path.join(plugin.pluginPath, '/graphql')

  const hasGraphQL = fs.existsSync(graphqlDir)
  if (!hasGraphQL) {
    return []
  }

  const middlewareConfig = plugin.config.middleware?.['@zemble/graphql']
  const transforms = middlewareConfig?.graphqlSchemaTransforms || []

  const [
    Query,
    Mutation,
    Subscription,
    ...TypesAndScalars
  ] = await Promise.all([
    readResolvers(join(graphqlDir, '/Query'), plugin.providers.logger, plugin.isPluginRunLocally),
    readResolvers(join(graphqlDir, '/Mutation'), plugin.providers.logger, plugin.isPluginRunLocally),
    readResolvers(join(graphqlDir, '/Subscription'), plugin.providers.logger, plugin.isPluginRunLocally),
    readResolvers(join(graphqlDir, '/Type'), plugin.providers.logger, plugin.isPluginRunLocally),
    readResolvers(join(graphqlDir, '/Scalar'), plugin.providers.logger, plugin.isPluginRunLocally),
    readResolvers(join(graphqlDir), plugin.providers.logger, plugin.isPluginRunLocally),
  ])

  const graphqlGlob = plugin.isPluginRunLocally
    ? join(graphqlDir, './**/*.graphql')
    : join(graphqlDir, './**/!(*.local).graphql')

  const schemaWithoutResolvers = await loadSchema(graphqlGlob, {
    loaders: [new GraphQLFileLoader()],
    assumeValid: false,
  }).catch(() => null)

  if (!schemaWithoutResolvers) {
    return []
  }

  const internalSchema = addResolversToSchema({
    schema: schemaWithoutResolvers,
    resolvers: mergeResolvers([
      Object.keys(Query).length > 0 ? { Query } : {},
      Object.keys(Mutation).length > 0 ? { Mutation } : {},
      Object.keys(Subscription).length > 0 ? { Subscription } : {},
      ...TypesAndScalars,
    ]),
  })

  // todo [>1]: fix wrapping to work with aliases, something is missing here
  const schema = transforms.length > 0 ? wrapSchema({
    schema: internalSchema,
    executor: createDefaultExecutor(internalSchema),
    createProxyingResolver: defaultCreateProxyingResolver,
    transforms,
  }) : internalSchema

  return [schema]
}

export default createPluginSchema
