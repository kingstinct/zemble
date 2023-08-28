import type { QueryResolvers } from '../schema.generated'

export const get: NonNullable<QueryResolvers['get']> = (
  _parent,
  { prefix, key },
  { kv },
) => kv(prefix).get(key)

export default get
