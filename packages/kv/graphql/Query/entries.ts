import type { QueryResolvers } from '../schema.generated'

export const entriesResolver: NonNullable<QueryResolvers['entries']> = async (_, { prefix }, { kv }) => {
  const entries = await kv(prefix).entries()

  return entries
}

export default entriesResolver
