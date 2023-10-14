import { PluginWithMiddleware } from '@zemble/core'

import middleware from './middleware'

import type { SubschemaConfig } from '@graphql-tools/delegate'
import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { GraphQLFormattedError, GraphQLScalarType, GraphQLSchema } from 'graphql'
import type {
  YogaServerOptions, YogaInitialContext,
} from 'graphql-yoga'
import type { Context as HonoContext, Hono } from 'hono'
import type { RedisOptions } from 'ioredis'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Server extends Hono {
      readonly gqlRequest: <TQuery, TVars>(
        query: TypedDocumentNode<TQuery, TVars>,
        vars?: TVars,
        opts?: {readonly headers?: Record<string, string>}
      ) => Promise<{
        readonly data?: ResultOf<TypedDocumentNode<TQuery, TVars>>,
        readonly errors?: readonly GraphQLFormattedError[]
      }>

      readonly gqlRequestUntyped: <TRes, TVars = unknown>(
        query: string,
        vars?: TVars,
        opts?: {readonly headers?: Record<string, string>}
      ) => Promise<{
        readonly data?: TRes,
        readonly errors?: readonly GraphQLFormattedError[]
      }>
    }

    interface GlobalConfig {
      readonly skipGraphQL?: boolean
      readonly graphqlSchemaTransforms?: SubschemaConfig['transforms']
    }

    interface GlobalContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      pubsub: PubSubType
    }

    interface GraphQLContext extends YogaInitialContext, GlobalContext {
      readonly token: string
      readonly decodedToken: Zemble.TokenRegistry[keyof Zemble.TokenRegistry] & DecodedTokenBase
      readonly honoContext: HonoContext
    }

    type AuthContextWithToken<TContext, DirectiveArgs extends {
      readonly match?: Record<string, unknown>
      readonly includes?: Record<string, unknown>
      readonly skip?: boolean
    }> = DirectiveArgs['skip'] extends true
      ? Omit<TContext, 'decodedToken' | 'token'>
      : Omit<TContext, 'decodedToken'> & {
        readonly decodedToken: DirectiveArgs['match']
        & Record<
        keyof DirectiveArgs['includes'],
        ReadonlyArray<DirectiveArgs['includes'][keyof DirectiveArgs['includes']]>
        > & DecodedTokenBase & Zemble.TokenRegistry[keyof Zemble.TokenRegistry]
      }
  }
}

export interface GraphQLMiddlewareConfig extends Zemble.GlobalConfig {
  readonly yoga?: Omit<YogaServerOptions<Zemble.GraphQLContext, unknown>, 'schema'>
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
   * Redis config to use for pubsub
   */
  readonly redisOptions?: RedisOptions

  readonly extendSchema?: readonly GraphQLSchema[] | (() => Promise<readonly GraphQLSchema[]>)
  readonly scalars?: Record<string, GraphQLScalarType>
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
