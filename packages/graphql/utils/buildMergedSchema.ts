/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { mergeSchemas } from '@graphql-tools/schema'
import { type GraphQLScalarType } from 'graphql'
import fs from 'node:fs'
import path from 'node:path'

import createPluginSchema from './createPluginSchema'

import type { GraphQLMiddlewareConfig } from '../plugin'
import type { Subschema } from '@graphql-tools/delegate'
import type { Plugin } from '@zemble/core'
import type {
  GraphQLSchemaWithContext,
} from 'graphql-yoga'

const processPluginSchema = async (pluginPath: string, {
  transforms,
  scalars,
  skipGraphQLValidation,
}: { readonly transforms: Subschema['transforms'], readonly scalars: Record<string, GraphQLScalarType>, readonly skipGraphQLValidation?: boolean }) => {
  const graphqlDir = path.join(pluginPath, '/graphql')
  const hasGraphQL = fs.existsSync(graphqlDir)
  if (hasGraphQL) {
    return [
      await createPluginSchema({
        graphqlDir,
        transforms,
        scalars,
        skipGraphQLValidation: !!skipGraphQLValidation,
      }),
    ]
  }
  return []
}

export const buildMergedSchema = async (
  plugins: readonly Plugin[],
  config: GraphQLMiddlewareConfig,
) => {
  const isPlugin = plugins.some(({ pluginPath }) => pluginPath === process.cwd())
  const selfSchemas: readonly GraphQLSchemaWithContext<Zemble.GraphQLContext>[] = [
    // don't load if we're already a plugin
    ...!isPlugin
      ? await processPluginSchema(process.cwd(), { transforms: [], scalars: config.scalars || {}, skipGraphQLValidation: false })
      : [],
    // eslint-disable-next-line no-nested-ternary
    ...(config.extendSchema
      ? (typeof config.extendSchema === 'function'
        ? await config.extendSchema()
        : config.extendSchema
      )
      : []),
  ]

  const pluginsToAdd = plugins.filter(({ config }) => !config.middleware?.['@zemble/graphql']?.disable)

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const graphQLSchemas = await pluginsToAdd.reduce(async (
    prev,
    { pluginPath, config: traversedPluginConfig },
  ) => {
    const graphqlSchemaTransforms = traversedPluginConfig.middleware?.['@zemble/graphql']?.graphqlSchemaTransforms
    // eslint-disable-next-line functional/prefer-readonly-type
    const toReturn: GraphQLSchemaWithContext<Zemble.GraphQLContext>[] = [
      ...await prev,
      ...await processPluginSchema(pluginPath, {
        transforms: graphqlSchemaTransforms ?? [],
        scalars: config.scalars || {},
        // skipGraphQLValidation: true, // skip validation so we don't need to provide root queries for plugins where it doesn't make sense
      }),
    ]

    return toReturn
  }, Promise.resolve(selfSchemas))

  const mergedSchema = mergeSchemas({
    // eslint-disable-next-line functional/prefer-readonly-type
    schemas: graphQLSchemas as unknown as GraphQLSchemaWithContext<Zemble.GraphQLContext>[],
    resolverValidationOptions: {
      // requireResolversForArgs: 'warn',
    },
  })

  return mergedSchema
}

export default buildMergedSchema
