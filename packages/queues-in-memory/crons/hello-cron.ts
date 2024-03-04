import { ZembleCron } from '@zemble/core'

export default new ZembleCron(() => {
  console.log('hello cron!!')
}, {
  repeatPattern: '*/5 * * * * *',
})
