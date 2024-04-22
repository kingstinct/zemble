import plugin from '../../plugin'

import type { MutationResolvers, Todo } from '../schema.generated'

export const updateTodoStatus: NonNullable<MutationResolvers['updateTodoStatus']> = async (_, {
  id, completed,
}, { pubsub, decodedToken }) => {
  const { userId } = decodedToken!
  const todoIdWithUser = `${userId}_${id}`
  const previous = await plugin.providers.kv<Todo>(userId).get(todoIdWithUser)

  if (previous) {
    const todo = { ...previous, completed }
    pubsub.publish('todoUpdated', todo)
    await plugin.providers.kv(userId).set(todoIdWithUser, todo)
    return todo
  }
  return null
}

export default updateTodoStatus
