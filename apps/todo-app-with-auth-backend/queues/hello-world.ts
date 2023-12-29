import { ZembleQueue } from 'zemble-plugin-bull'

export default new ZembleQueue((job, { logger }) => {
  logger.info(job.data)
})
