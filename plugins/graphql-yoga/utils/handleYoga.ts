/* eslint-disable no-nested-ternary */
import { createYoga } from 'graphql-yoga'

import type { GraphQLSchemaWithContext, YogaServerOptions } from 'graphql-yoga'
import type { Context } from 'hono'

export default async (
  getSchema: () => Promise<GraphQLSchemaWithContext<Readapt.GraphQLContext>>,
  pubsub: Readapt.GraphQLContext['pubsub'],
  opts?: Omit<YogaServerOptions<Readapt.GraphQLContext, Record<string, any>>, 'schema'>,
) => {
  let yoga = createYoga({
    ...opts,
    schema: await getSchema(),
  })

  async function subscribe() {
    console.log('about to subscribe')
    const eventSource = pubsub.subscribe('reload-schema')

    // eslint-disable-next-line no-restricted-syntax
    for await (const value of eventSource) {
      console.log('Updating schema!!', value)
      yoga = createYoga({
        ...opts,
        schema: await getSchema(),
      })
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
      }
        : {
          'Content-Type': 'application/graphql-response+json',
        }))
  }
}
