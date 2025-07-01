import type { QueryResolvers } from '../schema.generated'

export const has: NonNullable<QueryResolvers['has']> = async (_parent, { prefix, key }, { kv }) => kv(prefix).has(key)

export default has
