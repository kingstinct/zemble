import { GraphQLError } from 'graphql'

import { getQueueByName } from '../../utils/setupQueues'

import type { MutationResolvers } from '../schema.generated'

export const removeJob: NonNullable<MutationResolvers['removeJob']> = async (
  _,
  { queue, jobId },
) => {
  const q = getQueueByName(queue)

  if (!q) {
    throw new GraphQLError(`Queue ${queue} not found`)
  }

  const success = await q.remove(jobId)

  return success === 1
}

export default removeJob
