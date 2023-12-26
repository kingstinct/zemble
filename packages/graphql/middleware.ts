/* eslint-disable no-param-reassign */
/* eslint-disable functional/immutable-data */

import { printSchemaWithDirectives } from '@graphql-tools/utils'
import * as fs from 'node:fs'
import * as path from 'node:path'

import createPubSub from './createPubSub'
import buildMergedSchema from './utils/buildMergedSchema'
import gqlRequest from './utils/gqlRequest'
import gqlRequestUntyped from './utils/gqlRequestUntyped'
import handleYoga from './utils/handleYoga'

import type { GraphQLMiddlewareConfig } from './plugin'
import type { Plugin } from '@zemble/core'
import type { Middleware } from '@zemble/core/types'

export const middleware: Middleware<GraphQLMiddlewareConfig, Plugin> = async (
  {
    config, app, context, plugins,
  },
) => {
  const pubsub = await createPubSub(
    config.redisUrl,
    config.redisOptions,
  )

  const { hono } = app

  hono.use('*', async (ctx, done) => {
    ctx.env.pubsub = pubsub
    await done()
  })

  if (process.env.NODE_ENV === 'test') {
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
  }

  context.pubsub = pubsub

  const getGlobalContext = () => {
    if (config.yoga?.context) {
      const ctx = typeof config.yoga.context === 'function'
        ? config.yoga.context(context)
        : { ...context, ...(config.yoga.context as object) }
      ctx.pubsub = pubsub
      return ctx
    }
    // eslint-disable-next-line no-unused-expressions
    context.pubsub = pubsub

    return context
  }

  const handlerPromise = handleYoga(
    async () => {
      const mergedSchema = await buildMergedSchema(plugins, config)

      if (config.outputMergedSchemaPath) {
        const resolvedPath = path.isAbsolute(config.outputMergedSchemaPath)
          ? config.outputMergedSchemaPath
          : path.join(process.cwd(), config.outputMergedSchemaPath)

        void fs.promises.writeFile(resolvedPath, `${printSchemaWithDirectives(mergedSchema)}\n`)
      }

      return mergedSchema
    },
    pubsub,
    context.logger,
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
      context: getGlobalContext(),
    },
  )

  // if (config.sofa) {
  //   // eslint-disable-next-line import/no-extraneous-dependencies
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
}

export default middleware
