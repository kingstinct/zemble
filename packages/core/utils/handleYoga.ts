import { GraphQLSchemaWithContext, createYoga } from 'graphql-yoga';
import { Context } from 'hono'

export default (schema: GraphQLSchemaWithContext<{}>) => {
  const yoga = createYoga({
    schema,
    graphiql: true,
    graphqlEndpoint: '/graphql',
  })

  return async (c: Context) => {
    const res = await yoga.handle(c.req.raw, {})
    console.log('c.req.headers.get)?', c.req.headers.get('Accept'))
    console.log('inclooodes', c.req.headers.get('Accept')?.includes('text/html'))
    return c.newResponse(res.body, res.status, c.req.headers.get('Accept')?.includes('text/html') 
      ? {
        'Content-Type': 'text/html',
     }
      : {
           'Content-Type': 'application/json',
        })
  }
} 