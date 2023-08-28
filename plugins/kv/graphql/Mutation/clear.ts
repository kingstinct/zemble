import { kv } from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

export const clear: NonNullable<MutationResolvers['clear']> = async (_, { prefix }) => {
  await kv(prefix).clear()
  return true
}

export default clear
