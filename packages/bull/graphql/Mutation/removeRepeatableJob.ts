import { Queue } from 'bullmq'

import type { MutationResolvers } from '../schema.generated'

const removeRepeatableJob: MutationResolvers['removeRepeatableJob'] = async (_, {
  queue, repeatJobKey,
}) => {
  const q = new Queue(queue, {

  })

  const job = await q.removeRepeatableByKey(repeatJobKey)

  return job
}

export default removeRepeatableJob
