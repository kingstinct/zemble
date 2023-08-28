import type { MutationResolvers } from '../schema.generated'

export const deleteResolver: NonNullable<MutationResolvers['delete']> = async (_, { prefix, key }, { kv }) => {
  await kv(prefix).delete(key)
  return true
}

export default deleteResolver
