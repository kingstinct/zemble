/* eslint-disable no-nested-ternary */
import { createYoga } from 'graphql-yoga'

import type { GraphQLSchemaWithContext, YogaServerOptions } from 'graphql-yoga'
import type { Context } from 'hono'

export default async (
  getSchema: () => Promise<GraphQLSchemaWithContext<Zemble.GraphQLContext>>,
  pubsub: Zemble.GraphQLContext['pubsub'],
  logger: Zemble.GraphQLContext['logger'],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts?: Omit<YogaServerOptions<Zemble.GraphQLContext, Record<string, any>>, 'schema'>,
) => {
  let yoga = createYoga({
    ...opts,
    schema: await getSchema(),
  })

  async function subscribe() {
    const eventSource = pubsub.subscribe('reload-schema')

    // eslint-disable-next-line no-restricted-syntax
    for await (const _ of eventSource) {
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

    const headers = Array.from(res.headers.keys()).reduce((acc, key) => {
      const value = res.headers.get(key)
      // eslint-disable-next-line unicorn/prefer-ternary
      if (key === 'content-type') {
        // only copy content-type - for whatever reason, copying all headers breaks the response
        // eslint-disable-next-line functional/immutable-data
        acc[key] = value!
      }

      return acc
    }, {
      'content-type': 'text/html', // default to html, for playground to load
    } as Record<string, string>)

    return c.newResponse(res.body, res.status, headers)
  }
}
