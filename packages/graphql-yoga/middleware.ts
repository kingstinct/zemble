/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { mergeSchemas } from '@graphql-tools/schema'
import fs from 'fs'
import { print } from 'graphql/language/printer'
import path from 'path'

import createPubSub from './createPubSub'
import createPluginSchema from './utils/createPluginSchema'
import handleYoga from './utils/handleYoga'

import type { GraphQLMiddlewareConfig } from './plugin'
import type { Subschema } from '@graphql-tools/delegate'
import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { Plugin } from '@readapt/core'
import type { Middleware } from '@readapt/core/types'
import type { GraphQLFormattedError, GraphQLScalarType } from 'graphql'
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
        graphqlDir, transforms, scalars, skipGraphQLValidation: !!skipGraphQLValidation,
      }),
    ]
  }
  return []
}

async function gqlRequestUntyped<TRes, TVars>(
  app: Readapt.Server,
  query: string,
  variables: TVars,
  options?: {readonly headers?: Record<string, string>},
) {
  const res = await app.fetch(new Request('http://localhost/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }))

  const resJson = res.json() as unknown as {
    readonly data?: TRes,
    readonly errors: readonly GraphQLFormattedError[]
  }

  if (resJson.errors) {
    console.error(resJson.errors)
  }

  return resJson
}

async function gqlRequest<TQuery, TVars>(
  app: Readapt.Server,
  query: TypedDocumentNode<TQuery, TVars>,
  variables: TVars,
  options: {readonly headers?: Record<string, string>} = {},
) {
  const req = new Request('http://localhost/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const res = await app.fetch(req)

  const resJson = res.json() as unknown as {
    readonly data?: ResultOf<TQuery>,
    readonly errors: readonly GraphQLFormattedError[]
  }

  if (resJson.errors) {
    console.error(resJson.errors)
  }

  return resJson
}

const buildMergedSchema = async (
  plugins: readonly Plugin[],
  config: GraphQLMiddlewareConfig,
) => {
  const isPlugin = plugins.some(({ pluginPath }) => pluginPath === process.cwd())
  const selfSchemas: readonly GraphQLSchemaWithContext<Readapt.GraphQLContext>[] = [
    // don't load if we're already a plugin
    ...!isPlugin ? await processPluginSchema(process.cwd(), { transforms: [], scalars: config.scalars || {}, skipGraphQLValidation: false }) : [],
    // eslint-disable-next-line no-nested-ternary
    ...(config.extendSchema
      ? (typeof config.extendSchema === 'function'
        ? await config.extendSchema()
        : config.extendSchema)
      : []),
  ]

  const pluginsToAdd = plugins.filter(({ config }) => !config.skipGraphQL)

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const graphQLSchemas = await pluginsToAdd.reduce(async (
    prev,
    { pluginPath, config: { graphqlSchemaTransforms } },
  ) => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const toReturn: GraphQLSchemaWithContext<Readapt.GraphQLContext>[] = [
      ...await prev,
      ...await processPluginSchema(pluginPath, {
        transforms: graphqlSchemaTransforms ?? [],
        scalars: config.scalars || {},
        skipGraphQLValidation: true, // skip validation so we don't need to provide root queries for plugins where it doesn't make sense
      }),
    ]

    return toReturn
  }, Promise.resolve(selfSchemas))

  const mergedSchema = mergeSchemas({
    // eslint-disable-next-line functional/prefer-readonly-type
    schemas: graphQLSchemas as unknown as GraphQLSchemaWithContext<Readapt.GraphQLContext>[],
    resolverValidationOptions: {
      requireResolversForArgs: 'warn',
    },
  })

  return mergedSchema
}

export const middleware: Middleware<GraphQLMiddlewareConfig> = (config) => (
  { app, context, plugins },
) => {
  const pubsub = createPubSub(
    config.redisUrl,
    config.redisOptions,
  )

  // @ts-expect-error sdfgsdfg
  app.gqlRequest = async (query, vars, opts) => {
    const response = await gqlRequest(app, query, vars, opts)

    return response
  }

  // @ts-expect-error sdfgsdfg
  app.gqlRequestUntyped = async (untypedQuery: string, vars, opts) => {
    const response = await gqlRequestUntyped(app, untypedQuery, vars, opts)
    return response
  }

  context.pubsub = pubsub

  const globalContext = context

  app.use(config!.yoga!.graphqlEndpoint!, async (context) => {
    const handler = await handleYoga(
      async () => buildMergedSchema(plugins, config),
      pubsub,
      globalContext.logger,
      {
        ...config.yoga,
        graphiql: async (req, context) => {
          const resolved = (typeof config.yoga?.graphiql === 'function'
            ? await config.yoga?.graphiql?.(req, context)
            : (config.yoga?.graphiql ?? {}))
          return ({
            credentials: 'include',
            ...typeof resolved === 'boolean' ? {} : resolved,
          })
        },
        // eslint-disable-next-line no-nested-ternary
        context: () => (config.yoga?.context
          ? (typeof config.yoga.context === 'function'
            ? config.yoga.context(globalContext)
            : { ...globalContext, ...(config.yoga.context) })
          : globalContext)
        ,
      },
    )
    return handler(context)
  })
}

export default middleware
