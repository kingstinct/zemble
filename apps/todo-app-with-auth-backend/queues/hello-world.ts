import type { QueueConfig } from 'readapt-plugin-bull/utils/setupQueues'

const config: QueueConfig = {
  worker: (job) => {
    console.log(job.data)
  },
}

export default config
