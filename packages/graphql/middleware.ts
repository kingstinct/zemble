import * as fs from 'node:fs'
import * as path from 'node:path'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import type { Plugin } from '@zemble/core'
import type { Middleware } from '@zemble/core/types'
import type { GraphQLSchema } from 'graphql'
import { timing } from 'hono/timing'
import createPubSub from './createPubSub'
import type { GraphQLMiddlewareConfig } from './plugin'
import buildMergedSchema from './utils/buildMergedSchema'
import gqlRequest from './utils/gqlRequest'
import gqlRequestUntyped from './utils/gqlRequestUntyped'
import handleYoga from './utils/handleYoga'

export const absoluteOrRelativeToCwd = (pathTo: string) => {
  if (path.isAbsolute(pathTo)) {
    return pathTo
  }

  return path.join(process.cwd(), pathTo)
}

export const absoluteOrRelativeTo = (pathTo: string, relativeTo: string) => {
  if (path.isAbsolute(pathTo)) {
    return pathTo
  }

  return path.join(relativeTo, pathTo)
}

export const printMergedSchema = async (
  mergedSchema: GraphQLSchema,
  outputMergedSchemaPath: string,
) => {
  if (outputMergedSchemaPath) {
    const resolvedPath = absoluteOrRelativeToCwd(outputMergedSchemaPath)

    await fs.promises.writeFile(
      resolvedPath,
      `${printSchemaWithDirectives(mergedSchema)}\n`,
    )
  }
}

export const middleware: Middleware<GraphQLMiddlewareConfig, Plugin> = async ({
  config,
  app,
  context,
  logger,
}) => {
  const pubsub = await createPubSub(config.redisUrl, {
    logger,
    redis: config.redisOptions,
  })

  const { hono } = app

  hono.use(timing())

  hono.use('*', async (ctx, done) => {
    ctx.env.pubsub = pubsub
    await done()
  })

  if (process.env.NODE_ENV === 'test') {
    // @ts-expect-error fix later
    app.gqlRequest = async (query, vars, opts) => {
      const response = await gqlRequest(app, query, vars, opts)

      return response
    }

    // @ts-expect-error fix later
    app.gqlRequestUntyped = async (untypedQuery: string, vars, opts) => {
      const response = await gqlRequestUntyped(app, untypedQuery, vars, opts)
      return response
    }
  }

  context.pubsub = pubsub

  const getGlobalContext = () => {
    if (config.yoga?.context) {
      const ctx =
        typeof config.yoga.context === 'function'
          ? config.yoga.context(context)
          : { ...context, ...(config.yoga.context as object) }
      ctx.pubsub = pubsub
      return ctx
    }
    context.pubsub = pubsub

    return context
  }

  const handlerPromise = handleYoga(
    async () => {
      const mergedSchema = await buildMergedSchema(app, config)

      if (config.outputMergedSchemaPath) {
        void printMergedSchema(mergedSchema, config.outputMergedSchemaPath)
      }

      return mergedSchema
    },
    pubsub,
    app,
    {
      ...config.yoga,
      graphiql: async (req, context) => {
        const resolved =
          typeof config.yoga?.graphiql === 'function'
            ? await config.yoga?.graphiql?.(req, context)
            : (config.yoga?.graphiql ?? {})
        return {
          credentials: 'include',
          subscriptionsProtocol:
            config.subscriptionTransport === 'ws' ? 'WS' : 'SSE',
          ...(typeof resolved === 'boolean' ? {} : resolved),
        }
      },
      context: getGlobalContext(),
    },
  )

  // if (config.sofa) {
  //   const { useSofa } = await import('sofa-api')

  //   const urlPath = config.sofa.basePath ?? '/api'

  //   const enveloped = envelop({
  //     plugins: config.yoga?.plugins ?? [],
  //   })

  //   hono.all(
  //     path.join('/', urlPath, '/*'),
  //     async (ctx) => {
  //       const mergedSchema = await buildMergedSchema(plugins, config)
  //       const res = await useSofa({
  //         basePath: path.join('/', urlPath),
  //         schema: mergedSchema,
  //         subscribe: async (args) => enveloped(args.contextValue ?? {}).subscribe(args),
  //         execute: async (args) => enveloped(args.contextValue ?? {}).execute(args),
  //         context: getGlobalContext(),
  //         ...config.sofa,
  //         openAPI: {
  //           endpoint: '/openapi.json',
  //           ...(config.sofa?.openAPI ?? {}),
  //         },
  //         swaggerUI: {
  //           endpoint: '/docs',
  //           ...(config.sofa?.swaggerUI ?? {}),
  //         },
  //       })(ctx.req.raw)
  //       return ctx.body(res.body, res.status, res.headers.toJSON())
  //     },
  //   )
  // }

  hono.use(config!.yoga!.graphqlEndpoint!, async (ctx) => {
    const handler = await handlerPromise

    return handler(ctx)
  })

  await handlerPromise
}

export default middleware
