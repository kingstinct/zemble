import { ZembleQueue } from '@zemble/bull'

export default new ZembleQueue((job, { logger }) => {
  logger.info(job.data)
})
