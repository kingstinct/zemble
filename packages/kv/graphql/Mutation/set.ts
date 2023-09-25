import type { MutationResolvers } from '../schema.generated'

export const set: NonNullable<MutationResolvers['set']> = async (_, {
  key,
  prefix,
  value,
  expireAfterSeconds,
}, { kv }) => {
  await kv(prefix).set(key, value, expireAfterSeconds ?? undefined)
  return true
}

export default set
