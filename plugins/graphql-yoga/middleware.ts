
import { YogaServerOptions, YogaInitialContext } from 'graphql-yoga';
import { mergeSchemas } from '@graphql-tools/schema'
import { GraphQLSchemaWithContext, PubSub } from 'graphql-yoga'
import { GraphQLFormattedError } from 'graphql'

import createPluginSchema from './utils/createPluginSchema'
import handleYoga from './utils/handleYoga'
import type { RedisOptions } from 'ioredis'

import { Middleware } from '@readapt/core/types'
import fs from 'fs'
import path from 'path'
import createPubSub from './createPubSub';

declare global {
  namespace Readapt {
    interface Server extends Hono {
      gqlRequest: <TQuery, TVars>(
        query: TypedDocumentNode<TQuery, TVars>, 
        vars: TVars
      ) => Promise<{
        data?: ResultOf<TypedDocumentNode<TQuery, TVars>>,
        errors?: GraphQLFormattedError[]
      }>
    }

    interface GlobalConfig {
      skipGraphQL?: boolean
    }

    interface PubSubTopics {
      [key: string]: any
    }

    interface PubSubType extends PubSub<PubSubTopics>{

    }

    interface Context {
      pubsub: PubSubType
    }

    interface GraphQLContext extends YogaInitialContext {
      pubsub: PubSubType
    }
  }
}

const processPluginSchema = async  (pluginPath: string) => {
  const graphqlPath = path.join(pluginPath, '/graphql')
  const hasGraphQL = fs.existsSync(graphqlPath)
  if (hasGraphQL) {
    return [await createPluginSchema(graphqlPath)]
  }
  return []
}

type GraphQLMiddlewareConfig = {
  yoga?: Omit<YogaServerOptions<Readapt.GraphQLContext, {}>, 'schema'>
  /**
   * The url of the redis instance to use for pubsub
   */
  redisUrl?: string
  /**
   * Redis config to use for pubsub
   */
  redisOptions?: RedisOptions
}

import { print } from 'graphql/language/printer'
import { TypedDocumentNode, ResultOf } from '@graphql-typed-document-node/core';
import { Hono } from 'hono';
import { graphql } from './gql';

async function gqlRequest<TQuery, TVars>(
  app: Readapt.Server, 
  query: TypedDocumentNode<TQuery, TVars>, 
  variables: TVars
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
    data?: ResultOf<TQuery>, 
    errors: GraphQLFormattedError[]
  }
}

const defaults = {
  yoga: {
    graphqlEndpoint: '/graphql',
  },
  redisUrl: process.env.REDIS_URL,
} satisfies GraphQLMiddlewareConfig

export const middleware: Middleware<GraphQLMiddlewareConfig> = (c) => async (
{  app, context, plugins }
) => {
  const config = { ...defaults, ...c, yoga: { ...defaults.yoga, ...c?.yoga }}
  
  const selfSchemas = await processPluginSchema(process.cwd())

  const pluginsToAdd = plugins.filter(({ config }) => !config.skipGraphQL)

  const graphQLSchemas = await pluginsToAdd.reduce(async (
    prev, 
    { pluginPath }
  ) => {
    const toReturn: GraphQLSchemaWithContext<Readapt.GraphQLContext>[] = [
      ...await prev,
      ...await processPluginSchema(pluginPath)
    ]

    return toReturn
  }, Promise.resolve(selfSchemas))

  const mergedSchema = mergeSchemas({
    schemas: graphQLSchemas,
    resolverValidationOptions: {
      requireResolversForArgs: 'warn',
    }
  })

  const pubsub = createPubSub(
    config.redisUrl,
    config.redisOptions
  )

  // @ts-ignore
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
          pubsub
        }

        return config.yoga?.context ? 
          (typeof config.yoga.context === 'function' 
            ? config.yoga.context(contextWithPubSub) 
            : {...contextWithPubSub, ...(await config.yoga.context)} )
          : contextWithPubSub
      }}
  ))
}

export default middleware