import type { QueryResolvers } from '../schema.generated'

export const valuesResolver: NonNullable<QueryResolvers['values']> = async (
  _,
  { prefix },
  { kv },
) => {
  const values = await kv(prefix).values()

  return values
}

export default valuesResolver
