import { useEngine, useLogger } from '@envelop/core'
import { Plugin, type IStandardLogger } from '@zemble/core'
import debug from 'debug'
import * as GraphQLJS from 'graphql'
import { GraphQLSchema, type GraphQLFormattedError } from 'graphql'
import { GraphQLJSON } from 'graphql-scalars'

import middleware from './middleware'

import type { SubschemaConfig } from '@graphql-tools/delegate'
import type { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core'
import type { Context } from 'graphql-ws'
import type {
  YogaServerOptions, YogaInitialContext, GraphQLParams,
} from 'graphql-yoga'
import type { RedisOptions } from 'ioredis'

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
      readonly logger: IStandardLogger
    }

    interface GraphQlWsContext extends Context<{readonly authorization: string}>, GlobalContext {
      readonly logger: IStandardLogger
      readonly params: GraphQLParams
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
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
   * Redis config to use for pubsub
   */
  readonly redisOptions?: RedisOptions

  readonly extendSchema?: readonly GraphQLSchema[] | (() => Promise<readonly GraphQLSchema[]>)
  // readonly scalars?: Record<string, GraphQLScalarType>
  readonly outputMergedSchemaPath?: string | false

  readonly subscriptionTransport?: 'sse' | 'ws'
}

const logFn = (eventName: string, ...args: readonly unknown[]) => {
  plugin.providers.logger.debug(eventName, ...args)
}

const createEnvironmentSchema = () => {
  const authDirective = new GraphQLJS.GraphQLDirective({
    locations: [GraphQLJS.DirectiveLocation.FIELD_DEFINITION],
    name: 'auth',
    args: {
      includes: {
        type: GraphQLJSON,
      },
      match: {
        type: GraphQLJSON,
      },
      or: {
        type: new GraphQLJS.GraphQLList(
          new GraphQLJS.GraphQLInputObjectType({
            name: 'AuthOr',
            fields: {
              includes: {
                type: GraphQLJSON,
              },
              match: {
                type: GraphQLJSON,
              },
            },
          }),
        ),
      },
      skip: {
        type: GraphQLJS.GraphQLBoolean,
      },
    },
  })
  const schema = new GraphQLSchema({
    directives: [authDirective],
    query: new GraphQLJS.GraphQLObjectType({
      name: 'Query',
      fields: {
        env: {
          type: GraphQLJSON,
          resolve: () => process.env,
        },
      },
    }),
    mutation: new GraphQLJS.GraphQLObjectType({
      name: 'Mutation',
      fields: {
        debugMode: {
          type: GraphQLJS.GraphQLBoolean,
          astNode: {
            kind: GraphQLJS.Kind.FIELD_DEFINITION,
            name: {
              kind: GraphQLJS.Kind.NAME,
              value: 'debugMode',
            },
            type: {
              kind: GraphQLJS.Kind.NON_NULL_TYPE,
              type: {
                kind: GraphQLJS.Kind.NAMED_TYPE,
                name: {
                  kind: GraphQLJS.Kind.NAME,
                  value: 'Boolean',
                },
              },
            },
            directives: [
              {
                kind: GraphQLJS.Kind.DIRECTIVE,
                name: {
                  kind: GraphQLJS.Kind.NAME,
                  value: 'auth',
                },
                arguments: [
                  {
                    kind: GraphQLJS.Kind.ARGUMENT,
                    name: {
                      kind: GraphQLJS.Kind.NAME,
                      value: 'includes',
                    },
                    value: {
                      kind: GraphQLJS.Kind.OBJECT,
                      fields: [
                        {
                          kind: GraphQLJS.Kind.OBJECT_FIELD,
                          name: {
                            kind: GraphQLJS.Kind.NAME,
                            value: 'role',
                          },
                          value: {
                            kind: GraphQLJS.Kind.STRING,
                            value: 'admin',
                          },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
          args: {
            namespaces: { type: GraphQLJS.GraphQLString },
          },
          // auth directive here:
          resolve: (_, { namespaces }) => {
            if (namespaces) {
              debug.enable(namespaces)
            } else {
              debug.disable()
            }

            return !!namespaces
          },
        },
        updateEnv: {
          type: GraphQLJS.GraphQLString,
          args: {
            key: { type: new GraphQLJS.GraphQLNonNull(GraphQLJS.GraphQLString) },
            value: { type: new GraphQLJS.GraphQLNonNull(GraphQLJS.GraphQLString) },
          },
          resolve: (_, { key, value }) => {
            // eslint-disable-next-line functional/immutable-data
            process.env[key] = value
            return value
          },
        },
        removeEnv: {
          type: GraphQLJS.GraphQLBoolean,
          args: {
            key: { type: new GraphQLJS.GraphQLNonNull(GraphQLJS.GraphQLString) },
          },
          resolve: (_, { key }) => {
            // eslint-disable-next-line functional/immutable-data
            delete process.env[key]
            return true
          },
        },
      },
    }),
  })
  return schema
}

const defaultConfig = {
  yoga: {
    graphqlEndpoint: '/graphql',
    plugins: [
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEngine(GraphQLJS),
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLogger({
        logFn,
      }),
    ],
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
  outputMergedSchemaPath: './app.generated.graphql',
  subscriptionTransport: 'sse',
  // extendSchema: async () => [createEnvironmentSchema()],
} satisfies GraphQLMiddlewareConfig

const plugin = new Plugin<GraphQLMiddlewareConfig>(
  import.meta.dir,
  { defaultConfig, middleware },
)

export default plugin
