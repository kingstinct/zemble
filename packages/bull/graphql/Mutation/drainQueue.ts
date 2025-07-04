import { GraphQLError } from 'graphql'

import { getQueueByName } from '../../utils/setupQueues'

import type { MutationResolvers } from '../schema.generated'

export const drainQueue: NonNullable<MutationResolvers['drainQueue']> = async (
  _,
  { queue },
) => {
  const q = getQueueByName(queue)

  if (!q) {
    throw new GraphQLError(`Queue ${queue} not found`)
  }

  await q.drain()

  return true
}

export default drainQueue
