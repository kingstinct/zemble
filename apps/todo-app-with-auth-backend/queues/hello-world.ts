import type { QueueConfig } from 'zemble-plugin-bull/utils/setupQueues'

const config: QueueConfig = {
  worker: (job) => {
    console.log(job.data)
  },
}

export default config
