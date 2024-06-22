import { wait } from '@zemble/utils'

import plugin from './plugin'

interface MyLibreQueueType {
  readonly patientId: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface QueueRegistry {
      readonly ['process-libre']: MyLibreQueueType
    }
  }
}

plugin.configure({
  queues: {
    'process-libre': {
      worker: async (data) => {
        console.log('queueConfig.data', data)
        await wait(1000)
        console.log('done', data)
      },
    },
  },
})

setTimeout(() => {
  void plugin.providers.addToQueue({ data: { patientId: 'sdf' }, type: 'process-libre' })
  void plugin.providers.addToQueue({ data: { patientId: 'string2' }, type: 'process-libre' })
}, 1000)

export default plugin
