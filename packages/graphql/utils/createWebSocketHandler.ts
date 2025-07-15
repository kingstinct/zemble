import { makeHandler } from 'graphql-ws/use/bun'

import type { GraphQLSchemaWithContext, YogaServerInstance } from 'graphql-yoga'

export const createWebsocketHandler = (
  schema: GraphQLSchemaWithContext<Zemble.GraphQLContext>,
  yoga: YogaServerInstance<Zemble.GraphQLContext, Record<string, any>>,
) => {
  const websocketHandler = makeHandler({
    schema,
    execute: (args: any) => args.rootValue.execute(args),
    subscribe: (args: any) => args.rootValue.subscribe(args),
    onSubscribe: async (ctx, _, payload) => {
      const { schema, execute, subscribe, contextFactory, parse, validate } =
        yoga.getEnveloped({
          ...ctx,
          req: ctx.extra['request'],
          socket: ctx.extra.socket,
          params: payload,
        })

      const args = {
        schema,
        operationName: payload.operationName,
        document: parse(payload.query),
        variableValues: payload.variables,
        contextValue: await contextFactory({ wsContext: ctx }),
        rootValue: {
          execute,
          subscribe,
        },
      }

      const errors = validate(args.schema, args.document)
      if (errors.length) return errors

      return args
    },
  })

  return websocketHandler
}

export default createWebsocketHandler
