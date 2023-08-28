import type { MutationResolvers } from '../schema.generated'

const createTodo: MutationResolvers['createTodo'] = async (_, { title }, { pubsub, decodedToken, kv }) => {
  if (decodedToken?.type === 'AnonymousAuth') {
    const id = Math.random().toString(36).substring(7)
    const { userId } = decodedToken
    const todo = { title, id, completed: false }
    await kv(userId).set(id, { title, id, completed: false })

    pubsub.publish('todoCreated', todo)
    return todo
  }

  throw new Error('Not authenticated')
}

export default createTodo
