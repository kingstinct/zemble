import { Queue } from 'bullmq'

import type { MutationResolvers } from '../schema.generated'

const drainQueue: MutationResolvers['drainQueue'] = async (_, { queue }) => {
  const q = new Queue(queue, {

  })

  await q.drain()

  return true
}

export default drainQueue
