import readDir from '@zemble/core/utils/readDir'
import { Queue, Worker } from 'bullmq'
import * as fs from 'node:fs'
import * as path from 'node:path'

import '@zemble/graphql'

import createClient from '../clients/redis'

import type { BullPluginConfig } from '../plugin'
import type { Job } from 'bullmq'

export type QueueConfig<DataType = unknown, ReturnType = unknown> = {
  readonly worker: (job: Job<DataType, ReturnType>) => Promise<void> | void
}

// eslint-disable-next-line functional/prefer-readonly-type
const queues: Queue[] = []

const setupQueues = (pluginPath: string, pubSub: Zemble.PubSubType, config: BullPluginConfig | undefined) => {
  const queuePath = path.join(pluginPath, '/queues')

  const hasQueues = fs.existsSync(queuePath)

  const jobUpdated = (job: Job) => {
    pubSub.publish('jobUpdated', job)
  }

  if (hasQueues) {
    const redisUrl = config?.redisUrl

    if (config && redisUrl) {
      const filenames = readDir(queuePath)

      filenames.forEach(async (filename) => {
        const fileNameWithoutExtension = filename.substring(0, filename.length - 3)
        const queueConfig = (await import(path.join(queuePath, filename))).default as QueueConfig

        const queue = new Queue(fileNameWithoutExtension, {
          connection: createClient(redisUrl, config.redisOptions),
        })

        // @ts-expect-error if this cannot be a promise I'm not sure how stuff will work
        const worker = new Worker(fileNameWithoutExtension, queueConfig.worker, {
          connection: createClient(redisUrl, config.redisOptions),
        })

        worker.on('completed', jobUpdated)
        worker.on('active', jobUpdated)

        worker.on('progress', jobUpdated)
        worker.on('failed', (job) => (job ? jobUpdated(job) : null))

        // eslint-disable-next-line functional/immutable-data
        queues.push(queue)
      })
    } else {
      console.error('[bull-plugin] Failed to initialize. No redisUrl provided for bull plugin, you can specify it directly or with REDIS_URL')
    }
  }
}

export const getQueues = () => queues

export default setupQueues
