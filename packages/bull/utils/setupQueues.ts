/* eslint-disable no-underscore-dangle */
import * as fs from 'node:fs'
import * as path from 'node:path'
import safeStableStringify from 'safe-stable-stringify'

import '@zemble/graphql'
import readDir from './readDir'
import createClient from '../clients/redis'
import { type BullPluginConfig } from '../plugin'
import ZembleQueueBull from '../ZembleQueueBull'

import type {
  Queue,
  Job,
  QueueListener,
} from 'bullmq'

// eslint-disable-next-line functional/prefer-readonly-type
const queues: Queue[] = []

const setupQueues = (
  pluginPath: string,
  pubSub: Zemble.PubSubType,
  config: BullPluginConfig | undefined,
): readonly Queue[] => {
  const queuePath = path.join(pluginPath, '/queues')

  const hasQueues = fs.existsSync(queuePath)

  const jobUpdated = (job: Job) => {
    pubSub.publish('jobUpdated', safeStableStringify(job))
  }

  function queuePubber<T extends keyof QueueListener<unknown, unknown, string>>(status: T, queue: Queue) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    queue.on(status, (...args: Parameters<QueueListener<unknown, unknown, string>[T]>) => {
      const typedArgs = args

      pubSub.publish(
        'queueUpdated',
        {
          args: typedArgs,
          queue: safeStableStringify(queue),
          status,
        },
      )
    })
  }

  if (hasQueues) {
    if (process.env.NODE_ENV !== 'test' || process.env.DEBUG) {
      console.log('[bull-plugin] Initializing queues from ', queuePath)
    }
    const redisUrl = config?.redisUrl ?? process.env.REDIS_URL

    if (redisUrl || process.env.NODE_ENV === 'test') {
      const filenames = readDir(queuePath)

      filenames.forEach(async (filename) => {
        const fileNameWithoutExtension = filename.substring(0, filename.length - 3)
        const queueConfig = (await import(path.join(queuePath, filename))).default

        if (queueConfig instanceof ZembleQueueBull && redisUrl) {
          const { queue, worker } = await queueConfig._initQueue(
            fileNameWithoutExtension,
            createClient(
              redisUrl,
              config?.redisOptions,
            ),
          )

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
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        } else if (process.env.NODE_ENV === 'test' && queueConfig instanceof require('../ZembleQueueMock').default) {
          await queueConfig._initQueue(fileNameWithoutExtension)
        } else {
          throw new Error(`Failed to load queue ${filename}, make sure it exports a ZembleQueue`)
        }
      })
    } else {
      console.error('[bull-plugin] Failed to initialize. No redisUrl provided for bull plugin, you can specify it directly or with REDIS_URL')
    }
  }
  return queues
}

export const getQueues = () => queues

export default setupQueues
