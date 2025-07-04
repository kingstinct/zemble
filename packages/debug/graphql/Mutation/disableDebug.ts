import debug from 'debug'

import type { MutationResolvers } from '../schema.generated'

export const disableDebug: NonNullable<
  MutationResolvers['disableDebug']
> = async () => {
  debug.disable()
  return false
}
