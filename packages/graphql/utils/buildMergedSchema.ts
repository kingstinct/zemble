/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { mergeSchemas } from '@graphql-tools/schema'

import createPluginSchema, { type PluginSchema } from './createPluginSchema'

import type { GraphQLMiddlewareConfig } from '../plugin'
import type {
  GraphQLSchemaWithContext,
} from 'graphql-yoga'

export const buildMergedSchema = async (
  { plugins, appPlugin }: Pick<Zemble.App, 'plugins' | 'appPlugin'>,
  config: GraphQLMiddlewareConfig,
) => {
  const selfSchemas: readonly GraphQLSchemaWithContext<Zemble.GraphQLContext>[] = [
    // don't load if we're already a plugin
    ...(appPlugin
      ? (await createPluginSchema(appPlugin)).map((p) => p.schema)
      : []),
    // eslint-disable-next-line no-nested-ternary
    ...(config.extendSchema
      ? (typeof config.extendSchema === 'function'
        ? await config.extendSchema()
        : config.extendSchema
      )
      : []),
  ]

  const pluginsToAdd = plugins.filter(({
    config,
  }) => !config.middleware?.['@zemble/graphql']?.disable)

  const pluginSchemas = await pluginsToAdd.reduce(async (
    prev,
    plugin,
  ) => {
    const toReturn = [
      ...await prev,
      ...await createPluginSchema(plugin),
    ]

    return toReturn
  }, Promise.resolve([] as readonly PluginSchema[]))

  const graphQLSchemas = await pluginsToAdd.reduce(async (
    prev,
    plugin,
  ) => {
    const toReturn: readonly GraphQLSchemaWithContext<Zemble.GraphQLContext>[] = [
      ...await prev,
      ...(await createPluginSchema(plugin)).map((p) => p.schema),
    ]

    return toReturn
  }, Promise.resolve(selfSchemas))

  const mergedSchema = mergeSchemas({
    // eslint-disable-next-line functional/prefer-readonly-type
    schemas: graphQLSchemas as unknown as GraphQLSchemaWithContext<Zemble.GraphQLContext>[],
    resolvers: pluginSchemas.map((p) => p.resolvers),
    resolverValidationOptions: {
      // requireResolversForArgs: 'warn',
    },
  })

  return mergedSchema
}

export default buildMergedSchema
