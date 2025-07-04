import debug from 'debug'

import type { MutationResolvers } from '../schema.generated'

// todo [>=0.1]: this doesnt apply the change to all server nodes, how to do this?
export const enableDebug: NonNullable<
  MutationResolvers['enableDebug']
> = async (_parent, { namespaces }) => {
  const soonEnabled = namespaces ?? '*'
  debug.enable(soonEnabled)
  return soonEnabled
}
