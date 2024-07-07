import { createDefaultExecutor } from '@graphql-tools/delegate'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'
import { addResolversToSchema } from '@graphql-tools/schema'
import { defaultCreateProxyingResolver, wrapSchema } from '@graphql-tools/wrap'
import fs from 'node:fs'
import path, { join } from 'node:path'

import readResolvers from './readResolvers'

import type { IResolvers } from '@graphql-tools/utils'
import type { Plugin } from '@zemble/core'
import type { GraphQLSchema } from 'graphql'

export type PluginSchema = {
  readonly schema: GraphQLSchema
  readonly schemaWithoutResolvers: GraphQLSchema
  readonly resolvers: IResolvers<unknown, unknown, Record<string, unknown>, unknown>

}

export const createPluginSchema = async (plugin: Plugin): Promise<readonly PluginSchema[]> => {
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
    types,
    scalars,
    typesOnRootLevel,
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

  const schemaWithoutResolvers: GraphQLSchema | null = await loadSchema(graphqlGlob, {
    loaders: [new GraphQLFileLoader()],
  }).catch((e) => {
    if (e instanceof Error && e.message.includes('Unable to find any GraphQL type definitions for the following pointers')) {
      // this happens if there is no schema - which happens and is most often valid
      plugin.providers.logger.debug(`Error loading schema in ${graphqlGlob}:\n${e.message}`)
      return null
    }
    throw e
  })

  if (!schemaWithoutResolvers) {
    return []
  }

  const resolvers: IResolvers<unknown, unknown, Record<string, unknown>, unknown> = {
    ...(Object.keys(Query).length > 0 ? { Query } : {}),
    ...(Object.keys(Mutation).length > 0 ? { Mutation } : {}),
    ...(Object.keys(Subscription).length > 0 ? { Subscription } : {}),
    ...types,
    ...scalars,
    ...typesOnRootLevel,
  }

  const internalSchema = addResolversToSchema({
    schema: schemaWithoutResolvers,
    resolvers,
  })

  // todo [>1]: fix wrapping to work with aliases, something is missing here
  const schema = transforms.length > 0 ? wrapSchema({
    schema: internalSchema,
    executor: createDefaultExecutor(internalSchema),
    createProxyingResolver: defaultCreateProxyingResolver,
    transforms,
  }) : internalSchema

  return [{ schema, schemaWithoutResolvers, resolvers }]
}

export default createPluginSchema
