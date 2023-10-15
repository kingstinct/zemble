import { ZembleQueue } from '../ZembleQueue'

export default new ZembleQueue((job) => {
  console.log(job.data)
}, {
  repeat: {
    // every 5 seconds
    pattern: '*/5 * * * * *',
    jobId: 'hello-world',
  },
})
