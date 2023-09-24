import type { QueueConfig } from '../utils/setupQueues'

const config: QueueConfig = {
  worker: (job) => {
    console.log(job.data)
  },
}

export default config
