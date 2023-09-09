import { PluginWithMiddleware } from '@readapt/core'

import middleware from './middleware'

import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { GraphQLFormattedError, GraphQLSchema } from 'graphql'
import type {
  YogaServerOptions, YogaInitialContext,
} from 'graphql-yoga'
import type { Context as HonoContext, Hono } from 'hono'
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

    interface GlobalContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      pubsub: PubSubType
    }

    interface GraphQLContext extends YogaInitialContext, GlobalContext {
      readonly token: string
      readonly decodedToken: Readapt.TokenRegistry[keyof Readapt.TokenRegistry] & DecodedTokenBase
      readonly honoContext: HonoContext
    }

    type NoAuth<T> = Omit<T, 'token' | 'decodedToken'>
  }
}

export interface GraphQLMiddlewareConfig extends Readapt.GlobalConfig {
  readonly yoga?: Omit<YogaServerOptions<Readapt.GraphQLContext, unknown>, 'schema'>
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
   * Redis config to use for pubsub
   */
  readonly redisOptions?: RedisOptions

  readonly extendSchema?: readonly GraphQLSchema[] | (() => Promise<readonly GraphQLSchema[]>)
}

const defaultConfig = {
  yoga: {
    graphqlEndpoint: '/graphql',
    maskedErrors: {
      isDev: process.env.NODE_ENV === 'development',
    },
  },
  redisUrl: process.env.REDIS_URL,
} satisfies GraphQLMiddlewareConfig

export default new PluginWithMiddleware<GraphQLMiddlewareConfig>(
  __dirname,
  middleware,
  { defaultConfig },
)
