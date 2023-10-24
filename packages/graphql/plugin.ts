import { useEngine } from '@envelop/core'
import { PluginWithMiddleware } from '@zemble/core'
import * as GraphQLJS from 'graphql'

import middleware from './middleware'

import type { SubschemaConfig } from '@graphql-tools/delegate'
import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { GraphQLFormattedError, GraphQLScalarType, GraphQLSchema } from 'graphql'
import type {
  YogaServerOptions, YogaInitialContext,
} from 'graphql-yoga'
import type { RedisOptions } from 'ioredis'
import type { SofaConfig } from 'sofa-api/sofa'

interface GraphQLMiddlewareGlobalConfig {
  readonly graphqlSchemaTransforms?: SubschemaConfig['transforms']
  readonly disable?: boolean
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface App {
      readonly gqlRequest: <TQuery, TVars>(
        query: TypedDocumentNode<TQuery, TVars>,
        vars?: TVars,
        opts?: {readonly headers?: Record<string, string>, readonly silenceErrors?: boolean}
      ) => Promise<{
        readonly data?: ResultOf<TypedDocumentNode<TQuery, TVars>>,
        readonly errors?: readonly GraphQLFormattedError[]
      }>

      readonly gqlRequestUntyped: <TRes, TVars = unknown>(
        query: string,
        vars?: TVars,
        opts?: {readonly headers?: Record<string, string>, readonly silenceErrors?: boolean}
      ) => Promise<{
        readonly data?: TRes,
        readonly errors?: readonly GraphQLFormattedError[]
      }>
    }

    interface MiddlewareConfig {
      readonly ['@zemble/graphql']?: GraphQLMiddlewareGlobalConfig
    }

    interface GlobalContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      pubsub: PubSubType
    }

    interface GraphQLContext extends YogaInitialContext, GlobalContext {
      readonly token: string | undefined
      readonly decodedToken: Zemble.TokenRegistry[keyof Zemble.TokenRegistry] | undefined
      readonly honoContext: RouteContext
    }

    interface HonoBindings extends Record<string, unknown> {
      // eslint-disable-next-line functional/prefer-readonly-type
      pubsub: PubSubType
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
  readonly sofa?: Omit<SofaConfig, 'schema'>
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
  readonly outputMergedSchemaPath?: string
}

const defaultConfig = {
  yoga: {
    graphqlEndpoint: '/graphql',
    // eslint-disable-next-line react-hooks/rules-of-hooks
    plugins: [useEngine(GraphQLJS)],
    maskedErrors: {
      isDev: process.env.NODE_ENV === 'development',
    },
  },
  middleware: {
    '@zemble/graphql': {
      // by default we disable our own GraphQL queries when not in development or test
      disable: process.env.NODE_ENV ? !['development', 'test'].includes(process.env.NODE_ENV) : true,
    },
  },
  redisUrl: process.env.REDIS_URL,
} satisfies GraphQLMiddlewareConfig

export default new PluginWithMiddleware<GraphQLMiddlewareConfig>(
  __dirname,
  middleware,
  { defaultConfig },
)
