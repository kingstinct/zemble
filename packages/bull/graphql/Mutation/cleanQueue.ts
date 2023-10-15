import { Queue } from 'bullmq'

import type { MutationResolvers } from '../schema.generated'

const cleanQueue: MutationResolvers['cleanQueue'] = async (_, {
  queue, limit, grace, type,
}) => {
  const q = new Queue(queue, {

  })

  const res = await q.clean(grace, limit, type ?? undefined)

  return res
}

export default cleanQueue
