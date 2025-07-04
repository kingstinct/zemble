import { GraphQLError } from 'graphql'

import { getQueueByName } from '../../utils/setupQueues'

import type { MutationResolvers } from '../schema.generated'

export const cleanQueue: NonNullable<MutationResolvers['cleanQueue']> = async (
  _,
  { queue, limit, grace, type },
) => {
  const q = getQueueByName(queue)

  if (!q) {
    throw new GraphQLError(`Queue ${queue} not found`)
  }

  const res = await q.clean(grace, limit, type ?? undefined)

  return res
}

export default cleanQueue
