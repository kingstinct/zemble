import { Queue } from 'bullmq'
import redis from '../../clients/redis'
import { MutationResolvers } from '../schema.generated'

const addJob: MutationResolvers['addJob'] = async (_, { queue }, ) => {
  const q = new Queue(queue, {
    connection: redis()
  })

  const job = await q.add(queue, {}, {})

  return job
}

export default addJob