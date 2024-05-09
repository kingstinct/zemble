import { Queue, Worker } from 'bullmq'

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

export type ZembleWorker<DataType = unknown, ReturnType = unknown> = (job: Job<DataType, ReturnType>, opts: ZembleJobOpts) => Promise<void> | void

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
  #queueInternal: Queue<DataType, ReturnType> | undefined

  get #queue() {
    if (!this.#queueInternal) throw new Error('Queue not initialized, something is wrong!')
    return this.#queueInternal
  }

  async _initQueue(queueName: string, connection: QueueOptions['connection']) {
    const queue = new Queue(queueName, {
      connection,
      defaultJobOptions: this.#config?.defaultJobOptions,
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
    const worker = new Worker(queueName, this.#worker, {
      connection,
    })

    return { queue, worker }
  }

  async add(...args: Parameters<Queue<DataType, ReturnType>['add']>) {
    return this.#queue.add(...args)
  }

  async addBulk(...args: Parameters<Queue<DataType, ReturnType>['addBulk']>) {
    return this.#queue.addBulk(...args)
  }

  async remove(...args: Parameters<Queue<DataType, ReturnType>['remove']>) {
    return this.#queue.remove(...args)
  }

  async getJob(...args: Parameters<Queue<DataType, ReturnType>['getJob']>) {
    return this.#queue.getJob(...args)
  }

  async getDelayed(...args: Parameters<Queue<DataType, ReturnType>['getDelayed']>) {
    return this.#queue.getDelayed(...args)
  }
}
export default ZembleQueueBull
