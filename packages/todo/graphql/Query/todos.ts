import { GraphQLError } from 'graphql'

import plugin from '../../plugin'

import type { QueryResolvers, Todo } from '../schema.generated'

const todo: QueryResolvers['todos'] = async (_, __, { decodedToken }) => {
  if (decodedToken?.type === 'AnonymousAuth') {
    const { userId } = decodedToken!
    const allTodos = await plugin.providers.kv<Todo>(userId).values()

    return allTodos
  }
  throw new GraphQLError('Needs to be user')
}

export default todo
