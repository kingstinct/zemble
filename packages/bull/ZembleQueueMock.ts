/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */
import { mock } from 'bun:test'

import type { ZembleQueueBull, ZembleQueueConfig } from './ZembleQueueBull'
import type {
  Job, JobsOptions, Queue,
} from 'bullmq'

interface IZembleQueue<DataType = unknown, ReturnType = unknown> {
  readonly add: ZembleQueueBull<DataType, ReturnType>['add']
  readonly addBulk: ZembleQueueBull<DataType, ReturnType>['addBulk']
}

class ZembleQueueMock<DataType = unknown, ReturnType = unknown> implements IZembleQueue<DataType, ReturnType> {
  constructor(
    readonly worker: (job: Job<DataType, ReturnType>) => Promise<void> | void,
    config?: ZembleQueueConfig,
  ) {
    this.#worker = worker
    this.#config = config
  }

  readonly #worker: (job: Job<DataType, ReturnType>) => Promise<void> | void

  readonly #config?: ZembleQueueConfig

  #queueInternal: Queue<DataType, ReturnType, string> | undefined

  get #queue(): Queue<DataType, ReturnType, string> {
    if (!this.#queueInternal) throw new Error('Queue not initialized, something is wrong!')

    return this.#queueInternal
  }

  async addBulk(jobs: Parameters<ZembleQueueBull<DataType, ReturnType>['addBulk']>[0]) {
    const js = jobs.map((job) => this.#createMockJob(job.name, job.data, job.opts))

    void js.reduce(async (prev, job) => {
      await prev
      await new Promise((resolve) => {
        setTimeout(() => {
          void this.#worker(job)
          resolve(undefined)
        }, 0)
      })
    }, Promise.resolve())

    return js
  }

  async _initQueue(queueName: string) {
    this.#queueInternal = {
      name: queueName,
      qualifiedName: queueName,
    } as Queue<DataType, ReturnType, string>
  }

  #createMockJob(name: string, data: DataType, opts?: JobsOptions | undefined): Job<DataType, ReturnType, string> {
    const job = {
      queue: this.#queue,
      queueName: this.#queue.name,
      attemptsMade: 0,
      data,
      name,
      progress: mock(() => ({})),
      ...(opts || {}),
    } as unknown as Job<DataType, ReturnType, string>

    return job
  }

  async add(name: string, data: DataType, opts?: JobsOptions | undefined): Promise<Job<DataType, ReturnType, string>> {
    const job = this.#createMockJob(name, data, opts)
    setTimeout(async () => this.#worker(job), 0)
    return job
  }
}

export default ZembleQueueMock
