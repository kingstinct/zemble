import { GraphQLError } from 'graphql'

import { getQueueByName } from '../../utils/setupQueues'

import type { MutationResolvers } from '../schema.generated'

const addJob: MutationResolvers['addJob'] = async (_, { queue, data, jobId }) => {
  const q = getQueueByName(queue)

  if (!q) {
    throw new GraphQLError(`Queue ${queue} not found`)
  }

  const job = await q.add(queue, data, {
    jobId: jobId ?? undefined,
  })

  return job
}

export default addJob
