/* eslint-disable no-nested-ternary */

import type { GraphQLSchemaWithContext, YogaServerOptions } from 'graphql-yoga'
import { createYoga } from 'graphql-yoga'
import type { Context } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'
import createWebsocketHandler from './createWebSocketHandler'

export default async (
  getSchema: () => Promise<GraphQLSchemaWithContext<Zemble.GraphQLContext>>,
  pubsub: Zemble.GraphQLContext['pubsub'],
  app: Pick<Zemble.App, 'websocketHandler'>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  opts?: Omit<YogaServerOptions<Zemble.GraphQLContext, Record<string, any>>, 'schema'>,
) => {
  let schema = await getSchema()
  let yoga = createYoga({
    ...opts,
    schema,
  })

  async function subscribe() {
    const eventSource = pubsub.subscribe('reload-schema')

    // eslint-disable-next-line no-restricted-syntax
    for await (const _ of eventSource) {
      schema = await getSchema()
      yoga = createYoga({
        ...opts,
        schema,
      })

      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      app.websocketHandler = createWebsocketHandler(schema, yoga)
    }
  }

  // eslint-disable-next-line functional/immutable-data, no-param-reassign
  app.websocketHandler = createWebsocketHandler(schema, yoga)

  void subscribe()

  return async (c: Context) => {
    const res = await yoga.handle(c.req.raw, {
      honoContext: c,
    })

    const headers = Array.from(res.headers.keys()).reduce(
      (acc, key) => {
        const value = res.headers.get(key)
        // eslint-disable-next-line unicorn/prefer-ternary
        if (key === 'content-type') {
          // only copy content-type - for whatever reason, copying all headers breaks the response
          // eslint-disable-next-line functional/immutable-data
          acc[key] = value!
        }

        return acc
      },
      {
        'content-type': 'text/html', // default to html, for playground to load
      } as Record<string, string>,
    )

    return c.newResponse(res.body, res.status as StatusCode, headers)
  }
}
