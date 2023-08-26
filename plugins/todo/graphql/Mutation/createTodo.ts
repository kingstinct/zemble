import kv from '../../utils/kv'

import type { MutationResolvers } from '../schema.generated'

const createTodo: MutationResolvers['createTodo'] = (_, { title }, { pubsub, decodedToken }) => {
  const id = Math.random().toString(36).substring(7)
  const { userId } = decodedToken!
  const todo = { title, id, completed: false }
  kv.set(`${userId}_${id}`, { title, id, completed: false })

  pubsub.publish('todoCreated', todo)
  return todo
}

export default createTodo
