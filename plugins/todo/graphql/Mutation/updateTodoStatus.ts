import { decodeToken } from 'readapt-plugin-anonymous-auth/utils/typedToken'

import kv from '../../utils/kv'

import type { MutationResolvers, Todo } from '../schema.generated'

const updateTodoStatus: MutationResolvers['updateTodoStatus'] = (_, { id, completed, token }, { pubsub }) => {
  const { userId } = decodeToken(token)
  const todoIdWithUser = `${userId}_${id}`
  const previous = kv.get(todoIdWithUser) as Todo

  if (previous) {
    const todo = { ...previous, completed }
    pubsub.publish('todoUpdated', todo)
    kv.set(todoIdWithUser, todo)
    return todo
  }
  return null
}

export default updateTodoStatus
