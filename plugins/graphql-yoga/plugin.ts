import { PluginWithMiddleware } from '@readapt/core'

import middleware from './middleware'

import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { GraphQLFormattedError } from 'graphql'
import type {
  YogaServerOptions, YogaInitialContext, PubSub,
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
      readonly token?: string
      readonly decodedToken?: DecodedToken
      readonly honoContext: HonoContext
    }
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
}

const defaultConfig = {
  yoga: {
    graphqlEndpoint: '/graphql',
  },
  redisUrl: process.env.REDIS_URL,
} satisfies GraphQLMiddlewareConfig

export default new PluginWithMiddleware<GraphQLMiddlewareConfig>(__dirname, middleware, { defaultConfig })
