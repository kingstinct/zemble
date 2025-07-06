import { ZembleQueue } from '../ZembleQueue'

export default new ZembleQueue(
  (job, { logger }) => {
    logger.info({ job })
  },
  {
    repeat: {
      // every 5 seconds
      pattern: '*/5 * * * * *',
      jobId: 'hello-world',
    },
  },
)
