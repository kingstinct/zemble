/* eslint-disable no-nested-ternary */
import { createYoga } from 'graphql-yoga'

import type { GraphQLSchemaWithContext, YogaServerOptions } from 'graphql-yoga'
import type { Context } from 'hono'

export default async (
  getSchema: () => Promise<GraphQLSchemaWithContext<Readapt.GraphQLContext>>,
  pubsub: Readapt.GraphQLContext['pubsub'],
  logger: Readapt.GraphQLContext['logger'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts?: Omit<YogaServerOptions<Readapt.GraphQLContext, Record<string, any>>, 'schema'>,
) => {
  let yoga = createYoga({
    ...opts,
    schema: await getSchema(),
  })

  async function subscribe() {
    const eventSource = pubsub.subscribe('reload-schema')

    // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars
    for await (const _ of eventSource) {
      logger.time('Updating schema...')
      yoga = createYoga({
        ...opts,
        schema: await getSchema(),
      })
      logger.timeEnd('Updating schema...')
    }
  }

  void subscribe()

  return async (c: Context) => {
    const res = await yoga.handle(c.req.raw, {
      honoContext: c,
    })

    return c.newResponse(res.body, res.status, c.req.headers.get('Accept')?.includes('text/html')
      ? {
        'Content-Type': 'text/html',
      } : (c.req.headers.get('Accept')?.includes('text/event-stream') ? {
        'Content-Type': 'text/event-stream',
      // eslint-disable-next-line unicorn/no-nested-ternary
      } : c.req.headers.get('Accept')?.includes('multipart/mixed') ? {
        'Content-Type': 'multipart/mixed',
      }
        : {
          'Content-Type': 'application/graphql-response+json',
        }))
  }
}
