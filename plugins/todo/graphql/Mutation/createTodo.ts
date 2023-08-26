import { decodeToken } from 'readapt-plugin-anonymous-auth/utils/typedToken'

import kv from '../../utils/kv'

import type { MutationResolvers } from '../schema.generated'

const createTodo: MutationResolvers['createTodo'] = (_, { title, token }, { pubsub }) => {
  const id = Math.random().toString(36).substring(7)
  const { userId } = decodeToken(token)
  const todo = { title, id, completed: false }
  kv.set(`${userId}_${id}`, { title, id, completed: false })

  pubsub.publish('todoCreated', todo)
  return todo
}

export default createTodo
