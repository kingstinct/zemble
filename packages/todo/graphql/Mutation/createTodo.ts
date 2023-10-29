import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const createTodo: MutationResolvers['createTodo'] = async (_, { title }, { pubsub, decodedToken }) => {
  const id = Math.random().toString(36).substring(7)
  const { userId } = decodedToken!
  const todo = { title, id, completed: false }
  await plugin.providers.kv(userId).set(id, { title, id, completed: false })

  pubsub.publish('todoCreated', todo)
  return todo
}

export default createTodo
