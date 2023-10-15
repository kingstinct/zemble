/* eslint-disable no-underscore-dangle */
import readDir from '@zemble/core/utils/readDir'
import * as fs from 'node:fs'
import * as path from 'node:path'

import '@zemble/graphql'

import createClient from '../clients/redis'
import { type BullPluginConfig } from '../plugin'
import ZembleQueueBull from '../ZembleQueueBull'
import ZembleQueueMock from '../ZembleQueueMock'

import type {
  Queue,
  Job,
  QueueListener,
} from 'bullmq'

// eslint-disable-next-line functional/prefer-readonly-type
const queues: Queue[] = []

const setupQueues = (pluginPath: string, pubSub: Zemble.PubSubType, config: BullPluginConfig | undefined) => {
  const queuePath = path.join(pluginPath, '/queues')

  const hasQueues = fs.existsSync(queuePath)

  const jobUpdated = (job: Job) => {
    pubSub.publish('jobUpdated', job)
  }

  function queuePubber<T extends keyof QueueListener<unknown, unknown, string>>(status: T, queue: Queue) {
    queue.on(status, (...args) => {
      const typedArgs = args as Parameters<QueueListener<unknown, unknown, string>[T]>

      pubSub.publish(
        'queueUpdated',
        {
          args: typedArgs,
          queue,
          status,
        },
      )
    })
  }

  if (hasQueues) {
    const redisUrl = config?.redisUrl

    if (config && redisUrl) {
      const filenames = readDir(queuePath)

      filenames.forEach(async (filename) => {
        const fileNameWithoutExtension = filename.substring(0, filename.length - 3)
        const queueConfig = (await import(path.join(queuePath, filename))).default

        if (queueConfig instanceof ZembleQueueBull) {
          const { queue, worker } = await queueConfig._initQueue(fileNameWithoutExtension, createClient(redisUrl, config.redisOptions))

          queuePubber('cleaned', queue)
          queuePubber('error', queue)
          queuePubber('progress', queue)
          queuePubber('removed', queue)
          queuePubber('waiting', queue)
          queuePubber('paused', queue)
          queuePubber('resumed', queue)

          worker.on('completed', jobUpdated)
          worker.on('active', jobUpdated)

          worker.on('progress', jobUpdated)
          worker.on('failed', (job) => (job ? jobUpdated(job) : null))

          // eslint-disable-next-line functional/immutable-data
          queues.push(queue)
        } else if (queueConfig instanceof ZembleQueueMock) {
          await queueConfig._initQueue(fileNameWithoutExtension)
        } else {
          throw new Error(`Failed to load queue ${filename}, make sure it exports a ZembleQueue`)
        }
      })
    } else {
      console.error('[bull-plugin] Failed to initialize. No redisUrl provided for bull plugin, you can specify it directly or with REDIS_URL')
    }
  }
}

export const getQueues = () => queues

export default setupQueues
