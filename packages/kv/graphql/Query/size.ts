import type { QueryResolvers } from '../schema.generated'

export const sizeResolver: NonNullable<QueryResolvers['size']> = async (
  _,
  { prefix },
  { kv },
) => {
  const size = await kv(prefix).size()

  return size
}

export default sizeResolver
