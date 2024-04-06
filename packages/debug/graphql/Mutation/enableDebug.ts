import debug from 'debug'

import type { MutationResolvers } from '../schema.generated'

export const enableDebug: NonNullable<MutationResolvers['enableDebug']> = async (_parent, { namespaces }) => {
  const soonEnabled = namespaces ?? '*'
  debug.enable(soonEnabled)
  return soonEnabled
}
