import type { QueryResolvers } from '../schema.generated'

export const keysResolver: NonNullable<QueryResolvers['keys']> = async (
  _,
  { prefix },
  { kv },
) => {
  const keys = await kv(prefix).keys()

  return keys
}

export default keysResolver
