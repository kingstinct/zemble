import { GraphQLError } from 'graphql'

import { getQueueByName } from '../../utils/setupQueues'

import type { MutationResolvers } from '../schema.generated'

export const removeRepeatableJob: NonNullable<
  MutationResolvers['removeRepeatableJob']
> = async (_, { queue, repeatJobKey }) => {
  const q = getQueueByName(queue)

  if (!q) {
    throw new GraphQLError(`Queue ${queue} not found`)
  }

  const job = await q.removeRepeatableByKey(repeatJobKey)

  return job
}

export default removeRepeatableJob
