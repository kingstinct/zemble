import { Queue, Worker } from 'bullmq'

import plugin from './plugin'

import type { IStandardLogger } from '@zemble/core'
import type {
  Job, JobsOptions, QueueOptions, RedisOptions, RepeatOptions,
} from 'bullmq'

export interface BullPluginConfig extends Zemble.GlobalConfig {
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
  * Redis config to use for pubsub
  */
  readonly redisOptions?: RedisOptions
}

export type ZembleQueueConfig = {
  readonly repeat?: RepeatOptions
  readonly defaultJobOptions?: JobsOptions
}

export type ZembleJobOpts = {
  readonly logger: IStandardLogger
}

export type ZembleWorker<DataType = unknown, ReturnType = unknown> = (job: Job<DataType, ReturnType>, opts: ZembleJobOpts) => Promise<ReturnType> | ReturnType

export class ZembleQueueBull<DataType = unknown, ReturnType = unknown> {
  readonly #worker: ZembleWorker<DataType, ReturnType>

  readonly #config?: ZembleQueueConfig

  constructor(
    readonly worker: ZembleWorker<DataType, ReturnType>,
    config?: ZembleQueueConfig,
  ) {
    this.#worker = worker
    this.#config = config
  }

  // eslint-disable-next-line functional/prefer-readonly-type
  #queueInternal: Queue<DataType, ReturnType, string, DataType, ReturnType, string> | undefined

  get #queue() {
    if (!this.#queueInternal) throw new Error('Queue not initialized, something is wrong!')
    return this.#queueInternal
  }

  async _initQueue(queueName: string, connection: QueueOptions['connection']) {
    const queue = new Queue<DataType, ReturnType, string, DataType, ReturnType, string>(queueName, {
      connection,
      defaultJobOptions: this.#config?.defaultJobOptions,
      prefix: plugin.config.redisOptions?.keyPrefix,
    })

    // eslint-disable-next-line functional/immutable-data
    this.#queueInternal = queue

    const repeatJobKey = `@zemble/bull-repeat-${queue.name}`
    await queue.removeRepeatableByKey(repeatJobKey)
    if (this.#config?.repeat) {
      await queue.add(repeatJobKey, {} as DataType, {
        repeatJobKey,
        repeat: this.#config?.repeat,
      })
    }

    // @ts-expect-error if this cannot be a promise I'm not sure how stuff will work
    const worker = plugin.config.DISABLE_QUEUE_WORKERS ? null : new Worker(queueName, this.#worker, {
      connection,
      prefix: plugin.config.redisOptions?.keyPrefix,
    })

    return { queue, worker }
  }

  async add(...args: Parameters<Queue<DataType, ReturnType, string, DataType, ReturnType, string>['add']>) {
    return this.#queue.add(...args)
  }

  async addBulk(...args: Parameters<Queue<DataType, ReturnType, string, DataType, ReturnType, string>['addBulk']>) {
    return this.#queue.addBulk(...args)
  }

  async remove(...args: Parameters<Queue<DataType, ReturnType, string, DataType, ReturnType, string>['remove']>) {
    return this.#queue.remove(...args)
  }

  async getJob(...args: Parameters<Queue<DataType, ReturnType, string, DataType, ReturnType, string>['getJob']>) {
    return this.#queue.getJob(...args)
  }

  async getDelayed(...args: Parameters<Queue<DataType, ReturnType, string, DataType, ReturnType, string>['getDelayed']>) {
    return this.#queue.getDelayed(...args)
  }

  async pause() {
    return this.#queue.pause()
  }

  async resume() {
    return this.#queue.resume()
  }
}
export default ZembleQueueBull
