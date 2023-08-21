import { GraphQLSchemaWithContext, createYoga } from 'graphql-yoga';
import { Context } from 'hono'

export default (schema: GraphQLSchemaWithContext<{}>) => {
  const yoga = createYoga({
    schema,
  })

  return async (c: Context) => {
    const res = await yoga.handle(c.req.raw, {})
    return c.newResponse(res.body, res.status, {
      'Content-Type': 'application/json',
    })
  }
} 