import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

export const clear: NonNullable<MutationResolvers['clear']> = async (_, { prefix }) => {
  await plugin.providers.kv(prefix).clear()
  return true
}

export default clear
