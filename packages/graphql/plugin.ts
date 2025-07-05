import { useEngine, useLogger } from '@envelop/core'
import type { SubschemaConfig } from '@graphql-tools/delegate'
import type {
  ResultOf,
  TypedDocumentNode,
} from '@graphql-typed-document-node/core'
import { type IStandardLogger, Plugin, type TokenContents } from '@zemble/core'
import type { GraphQLSchema } from 'graphql'
import * as GraphQLJS from 'graphql'
import type { Context } from 'graphql-ws'
import type {
  GraphQLParams,
  YogaInitialContext,
  YogaServerOptions,
} from 'graphql-yoga'
import type { RedisOptions } from 'ioredis'
import type { JWTPayload } from 'jose'
import middleware from './middleware'
import { useServerTiming } from './utils/useServerTiming'

interface GraphQLMiddlewareGlobalConfig {
  readonly graphqlSchemaTransforms?: SubschemaConfig['transforms']
  readonly disable?: boolean
}

declare global {
  namespace Zemble {
    interface App {
      readonly gqlRequest: <TQuery, TVars>(
        query: TypedDocumentNode<TQuery, TVars>,
        vars?: TVars,
        opts?: {
          readonly headers?: Record<string, string>
          readonly silenceErrors?: boolean
        },
      ) => Promise<{
        readonly data?: ResultOf<TypedDocumentNode<TQuery, TVars>>
        readonly errors?: readonly GraphQLJS.GraphQLFormattedError[]
      }>

      readonly gqlRequestUntyped: <TRes, TVars = unknown>(
        query: string,
        vars?: TVars,
        opts?: {
          readonly headers?: Record<string, string>
          readonly silenceErrors?: boolean
        },
      ) => Promise<{
        readonly data?: TRes
        readonly errors?: readonly GraphQLJS.GraphQLFormattedError[]
      }>
    }

    interface MiddlewareConfig {
      readonly ['@zemble/graphql']?: GraphQLMiddlewareGlobalConfig
    }

    interface GlobalContext {
      pubsub: PubSubType
    }

    interface GraphQLContext extends YogaInitialContext, GlobalContext {
      readonly token: string | undefined
      readonly decodedToken: TokenContents | undefined
      readonly honoContext: RouteContext
      readonly logger: IStandardLogger
    }

    interface GraphQlWsContext
      extends Context<{ readonly authorization: string }>,
        GlobalContext {
      readonly logger: IStandardLogger
      readonly params: GraphQLParams
    }

    interface HonoBindings extends Record<string, unknown> {
      pubsub: PubSubType
    }

    type AuthContextWithToken<
      TContext,
      DirectiveArgs extends {
        readonly match?: Record<string, unknown>
        readonly includes?: Record<string, unknown>
        readonly skip?: boolean
      } = { readonly match: undefined },
    > = DirectiveArgs['skip'] extends true
      ? Omit<TContext, 'decodedToken' | 'token'>
      : Omit<TContext, 'decodedToken'> & {
          readonly decodedToken: DirectiveArgs['match'] &
            Record<
              keyof DirectiveArgs['includes'],
              ReadonlyArray<
                DirectiveArgs['includes'][keyof DirectiveArgs['includes']]
              >
            > &
            TokenContents &
            JWTPayload
        }
  }
}

export interface GraphQLMiddlewareConfig extends Zemble.GlobalConfig {
  readonly yoga?: Omit<
    YogaServerOptions<Zemble.GraphQLContext, unknown>,
    'schema'
  >
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
   * Redis config to use for pubsub
   */
  readonly redisOptions?: RedisOptions

  readonly extendSchema?:
    | readonly GraphQLSchema[]
    | (() => Promise<readonly GraphQLSchema[]>)
  // readonly scalars?: Record<string, GraphQLScalarType>
  readonly outputMergedSchemaPath?: string | false

  readonly subscriptionTransport?: 'sse' | 'ws'

  readonly enableServerTiming?: boolean
}

const logFn = (eventName: string, ...args: readonly unknown[]) => {
  // Use console debug for now - this will be replaced after plugin initialization
  console.debug(eventName, ...args)
}

const defaultConfig = {
  yoga: {
    graphqlEndpoint: '/graphql',
    plugins: [
      useEngine(GraphQLJS),
      useLogger({
        logFn,
      }),
      useServerTiming(),
    ],
    maskedErrors: {
      isDev: process.env.NODE_ENV === 'development',
    },
  },
  middleware: {
    '@zemble/graphql': {
      // by default we disable our own GraphQL queries when not in development or test
      disable: process.env.NODE_ENV
        ? !['development', 'test'].includes(process.env.NODE_ENV)
        : true,
    },
  },
  redisUrl: process.env['REDIS_URL'],
  outputMergedSchemaPath: './app.generated.graphql',
  subscriptionTransport: 'sse',
  enableServerTiming: process.env.NODE_ENV === 'development',
  // extendSchema: async () => [createEnvironmentSchema()],
} satisfies GraphQLMiddlewareConfig

const plugin = new Plugin<GraphQLMiddlewareConfig>(import.meta.dir, {
  defaultConfig,
  middleware,
})

export default plugin
