/* eslint-disable no-nested-ternary */
import { createYoga } from 'graphql-yoga'

import type { GraphQLSchemaWithContext, YogaServerOptions } from 'graphql-yoga'
import type { Context } from 'hono'

export default (
  schema: GraphQLSchemaWithContext<Readapt.GraphQLContext>,
  opts?: Omit<YogaServerOptions<Readapt.GraphQLContext, {}>, 'schema'>,
) => {
  const yoga = createYoga({
    ...opts,
    schema,
  })

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
