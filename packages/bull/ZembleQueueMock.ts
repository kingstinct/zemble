/* eslint-disable functional/immutable-data */
/* eslint-disable functional/prefer-readonly-type */

import zembleContext from '@zemble/core/zembleContext'

import type { ZembleQueueBull, ZembleQueueConfig, ZembleWorker } from './ZembleQueueBull'
import type {
  Job, JobsOptions, Queue,
} from 'bullmq'

interface IZembleQueue<DataType = unknown, ReturnType = unknown> {
  readonly add: ZembleQueueBull<DataType, ReturnType>['add']
  readonly addBulk: ZembleQueueBull<DataType, ReturnType>['addBulk']
  readonly remove: ZembleQueueBull<DataType, ReturnType>['remove']
  readonly getJob: ZembleQueueBull<DataType, ReturnType>['getJob']
  readonly resume: ZembleQueueBull<DataType, ReturnType>['resume']
  readonly pause: ZembleQueueBull<DataType, ReturnType>['pause']
}

class ZembleQueueMock<DataType = unknown, ReturnType = unknown> implements IZembleQueue<DataType, ReturnType> {
  private jobs: Array<Job<DataType, ReturnType, string>> = []

  private isPaused = false

  constructor(
    readonly worker: ZembleWorker,
    _?: ZembleQueueConfig,
  ) {
    this.#worker = worker
    // this.#config = config
  }

  readonly #worker: ZembleWorker

  // readonly #config?: ZembleQueueConfig

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
          void this.#worker(job, { logger: zembleContext.logger })
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
      progress: () => ({}),
      ...(opts || {}),
    } as unknown as Job<DataType, ReturnType, string>

    return job
  }

  async add(name: string, data: DataType, opts?: JobsOptions | undefined): Promise<Job<DataType, ReturnType, string>> {
    if (this.isPaused) {
      throw new Error('Queue is paused')
    }

    const job = this.#createMockJob(name, data, opts)
    this.jobs.push(job)
    setTimeout(async () => this.#worker(job, { logger: zembleContext.logger }), 0)
    return job
  }

  async remove(jobId: string) {
    const initialLength = this.jobs.length
    this.jobs = this.jobs.filter((job) => job.id !== jobId)
    const removedCount = initialLength - this.jobs.length
    return removedCount
  }

  async getJob(jobId: string): Promise<Job<DataType, ReturnType, string> | undefined> {
    return this.jobs.find((job) => job.id === jobId)
  }

  async pause() {
    this.isPaused = true
  }

  async resume(): Promise<void> {
    this.isPaused = false
  }
}

export default ZembleQueueMock
