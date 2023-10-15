import { Queue } from 'bullmq'

import type { MutationResolvers } from '../schema.generated'

const addJob: MutationResolvers['addRepeatableJob'] = async (_, {
  queue, data, repeatJobKey, pattern,
}) => {
  const q = new Queue(queue, {

  })

  const job = await q.add(queue, data, {
    repeatJobKey: repeatJobKey ?? undefined,
    repeat: {
      pattern,
    },
  })

  return job
}

export default addJob
