import { ZembleQueue } from 'zemble-plugin-bull'

export default new ZembleQueue((job) => {
  console.log(job.data)
})
