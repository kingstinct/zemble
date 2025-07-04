import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

export const createTodo: NonNullable<MutationResolvers['createTodo']> = async (
  _,
  { title },
  { pubsub, decodedToken },
) => {
  const id = Math.random().toString(36).substring(7)
  const { sub } = decodedToken!
  const todo = { title, id, completed: false }
  await plugin.providers.kv(sub).set(id, { title, id, completed: false })

  pubsub.publish('todoCreated', todo)
  return todo
}

export default createTodo
