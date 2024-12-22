/* eslint-disable no-underscore-dangle */
import * as fs from 'node:fs'
import * as path from 'node:path'
import safeStableStringify from 'safe-stable-stringify'

import '@zemble/graphql'
import readDir from './readDir'
import createClient from '../clients/redis'
import plugin, { type BullPluginConfig } from '../plugin'
import ZembleQueueBull from '../ZembleQueueBull'

import type { IStandardLogger } from '@zemble/core'
import type {
  Queue,
  Job,
  QueueListener,
} from 'bullmq'
import type { Redis } from 'ioredis'

// eslint-disable-next-line functional/prefer-readonly-type
const queues: Queue[] = []

// eslint-disable-next-line functional/prefer-readonly-type
let zembleQueues: ZembleQueueBull[] = []

const setupQueues = async (
  pluginPath: string,
  pubSub: Zemble.PubSubType,
  config: BullPluginConfig | undefined,
  logger: IStandardLogger,
): Promise<readonly Queue[]> => {
  const queuePath = path.join(pluginPath, '/queues')

  const hasQueues = fs.existsSync(queuePath)

  const jobUpdated = (job: Job) => {
    pubSub.publish('jobUpdated', safeStableStringify(job))
  }

  function queuePubber<T extends keyof QueueListener>(status: T, queue: Queue) {
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
    plugin.debug('Initializing queues from ', queuePath)

    const redisUrl = config?.redisUrl ?? process.env['REDIS_URL']

    if (redisUrl || process.env.NODE_ENV === 'test') {
      const filenames = readDir(queuePath)

      const client = redisUrl && process.env.NODE_ENV !== 'test' ? createClient(
        redisUrl,
        { redis: config?.redisOptions, logger },
      ) : {} as Redis

      await Promise.all(filenames.map(async (filename) => {
        const fileNameWithoutExtension = filename.substring(0, filename.length - 3)
        const queueConfig = (await import(path.join(queuePath, filename))).default

        // eslint-disable-next-line functional/immutable-data
        zembleQueues = [...zembleQueues, queueConfig]

        if (queueConfig instanceof ZembleQueueBull && redisUrl) {
          const { queue, worker } = await queueConfig._initQueue(
            fileNameWithoutExtension,
            client,
          )

          queuePubber('cleaned', queue)
          queuePubber('error', queue)
          queuePubber('progress', queue)
          queuePubber('removed', queue)
          queuePubber('waiting', queue)
          queuePubber('paused', queue)
          queuePubber('resumed', queue)

          if (worker) {
            worker.on('completed', jobUpdated)
            worker.on('active', jobUpdated)

            worker.on('progress', jobUpdated)
            worker.on('failed', (job) => (job ? jobUpdated(job) : null))
          }

          // eslint-disable-next-line functional/immutable-data
          queues.push(queue)
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        } else if (process.env.NODE_ENV === 'test' && queueConfig instanceof require('../ZembleQueueMock').default) {
          await queueConfig._initQueue(fileNameWithoutExtension)
        } else {
          throw new Error(`Failed to load queue ${filename}, make sure it exports a ZembleQueue`)
        }
      }))
    } else {
      logger.error('[bull-plugin] Failed to initialize. No redisUrl provided for bull plugin, you can specify it directly or with REDIS_URL')
    }
  }
  return queues
}

export const getQueues = () => queues

export const getZembleQueues = () => zembleQueues

export const getQueueByName = (name: string) => queues.find((queue) => queue.name === name)

export default setupQueues
