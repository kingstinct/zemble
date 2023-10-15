import { Queue } from 'bullmq'

import type { MutationResolvers } from '../schema.generated'

const removeJob: MutationResolvers['removeJob'] = async (_, { queue, jobId }) => {
  const q = new Queue(queue, {

  })

  const success = await q.remove(jobId)

  return success === 1
}

export default removeJob
