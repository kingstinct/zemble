import { GraphQLError } from 'graphql'

import { getQueueByName } from '../../utils/setupQueues'

import type { MutationResolvers } from '../schema.generated'

export const addRepeatableJob: NonNullable<MutationResolvers['addRepeatableJob']> = async (_, {
  queue, data, repeatJobKey, pattern,
}) => {
  const q = getQueueByName(queue)

  if (!q) {
    throw new GraphQLError(`Queue ${queue} not found`)
  }

  const job = await q.add(queue, data, {
    repeatJobKey: repeatJobKey ?? undefined,
    repeat: {
      pattern,
    },
  })

  return job
}

export default addRepeatableJob
