/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */
import { mergeSchemas } from '@graphql-tools/schema'
import fs from 'fs'
import { print } from 'graphql/language/printer'
import path from 'path'

import createPubSub from './createPubSub'
import createPluginSchema from './utils/createPluginSchema'
import handleYoga from './utils/handleYoga'

import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { Middleware } from '@readapt/core/types'
import type { GraphQLFormattedError } from 'graphql'
import type {
  YogaServerOptions, YogaInitialContext, GraphQLSchemaWithContext, PubSub,
} from 'graphql-yoga'
import type { Hono } from 'hono'
import type { RedisOptions } from 'ioredis'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
    interface Server extends Hono {
      readonly gqlRequest: <TQuery, TVars>(
        query: TypedDocumentNode<TQuery, TVars>,
        vars: TVars
      ) => Promise<{
        readonly data?: ResultOf<TypedDocumentNode<TQuery, TVars>>,
        readonly errors?: readonly GraphQLFormattedError[]
      }>
    }

    interface GlobalConfig {
      readonly skipGraphQL?: boolean
    }

    interface PubSubTopics {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      readonly [key: string]: any
    }

    interface PubSubType extends PubSub<PubSubTopics>{

    }

    interface Context {
      // eslint-disable-next-line functional/prefer-readonly-type
      pubsub: PubSubType
    }

    interface GraphQLContext extends YogaInitialContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      pubsub: PubSubType
    }
  }
}

const processPluginSchema = async (pluginPath: string) => {
  const graphqlPath = path.join(pluginPath, '/graphql')
  const hasGraphQL = fs.existsSync(graphqlPath)
  if (hasGraphQL) {
    return [await createPluginSchema(graphqlPath)]
  }
  return []
}

type GraphQLMiddlewareConfig = {
  readonly yoga?: Omit<YogaServerOptions<Readapt.GraphQLContext, {}>, 'schema'>
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
   * Redis config to use for pubsub
   */
  readonly redisOptions?: RedisOptions
}

async function gqlRequest<TQuery, TVars>(
  app: Readapt.Server,
  query: TypedDocumentNode<TQuery, TVars>,
  variables: TVars,
) {
  const res = await app.request(new Request('http://localhost/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: print(query),
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }))

  return res.json() as unknown as {
    readonly data?: ResultOf<TQuery>,
    readonly errors: readonly GraphQLFormattedError[]
  }
}

const defaults = {
  yoga: {
    graphqlEndpoint: '/graphql',
  },
  redisUrl: process.env.REDIS_URL,
} satisfies GraphQLMiddlewareConfig

export const middleware: Middleware<GraphQLMiddlewareConfig> = (c) => async (
  { app, context, plugins },
) => {
  const config = { ...defaults, ...c, yoga: { ...defaults.yoga, ...c?.yoga } }

  const selfSchemas = await processPluginSchema(process.cwd())

  const pluginsToAdd = plugins.filter(({ config }) => !config.skipGraphQL)

  // eslint-disable-next-line @typescript-eslint/await-thenable
  const graphQLSchemas = await pluginsToAdd.reduce(async (
    prev,
    { pluginPath },
  ) => {
    // eslint-disable-next-line functional/prefer-readonly-type
    const toReturn: GraphQLSchemaWithContext<Readapt.GraphQLContext>[] = [
      ...await prev,
      ...await processPluginSchema(pluginPath),
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

  const pubsub = createPubSub(
    config.redisUrl,
    config.redisOptions,
  )

  // @ts-expect-error sdfgsdfg
  app.gqlRequest = async (query, vars) => {
    const response = await gqlRequest(app, query, vars)
    return response
  }

  context.pubsub = pubsub

  app.use(config?.yoga?.graphqlEndpoint, handleYoga(
    mergedSchema,
    {
      ...config.yoga,
      context: async (initialContext) => {
        const contextWithPubSub = {
          ...initialContext,
          pubsub,
        }

        // eslint-disable-next-line no-nested-ternary
        return config.yoga?.context
          ? (typeof config.yoga.context === 'function'
            ? config.yoga.context(contextWithPubSub)
            : { ...contextWithPubSub, ...(await config.yoga.context) })
          : contextWithPubSub
      },
    },
  ))
}

export default middleware
