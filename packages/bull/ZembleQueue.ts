import { Queue, Worker } from 'bullmq'

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

export class ZembleQueue<DataType = unknown, ReturnType = unknown> {
  readonly #worker: (job: Job<DataType, ReturnType>) => Promise<void> | void

  readonly #config?: ZembleQueueConfig

  constructor(
    readonly worker: (job: Job<DataType, ReturnType>) => Promise<void> | void,
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

    const repeatJobKey = `zemble-plugin-bull-repeat-${queue.name}`
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
}

export default ZembleQueue
