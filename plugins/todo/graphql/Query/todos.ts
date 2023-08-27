import '../../plugin'

import kv from '../../utils/kv'

import type { QueryResolvers } from '../schema.generated'

const todo: QueryResolvers['todos'] = (_, __, { decodedToken }) => {
  const { userId } = decodedToken!
  const todoIdWithUser = `${userId}_`
  const allTodos = Array.from(kv.entries())
  return allTodos.filter(([key, _]) => key.startsWith(todoIdWithUser)).map(([_, todo]) => todo)
}

export default todo
