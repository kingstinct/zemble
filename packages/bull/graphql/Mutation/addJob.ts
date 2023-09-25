import { Queue } from 'bullmq'

import type { MutationResolvers } from '../schema.generated'

const addJob: MutationResolvers['addJob'] = async (_, { queue }) => {
  const q = new Queue(queue, {

  })

  const job = await q.add(queue, {}, {})

  return job
}

export default addJob
