import { GraphQLError } from 'graphql'

import type { QueryResolvers, Todo } from '../schema.generated'

const todo: QueryResolvers['todos'] = async (_, __, { decodedToken, kv }) => {
  if (decodedToken?.type === 'AnonymousAuth') {
    const { userId } = decodedToken!
    const allTodos = await kv<Todo>(userId).values()

    return allTodos
  }
  throw new GraphQLError('Needs to be user')
}

export default todo
