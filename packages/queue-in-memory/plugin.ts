import {
  Plugin, setupProvider, type IStandardAddToQueueService, type IStandardRemoveFromQueueService, type JobStatus,
} from '@zemble/core'
import GraphQL from '@zemble/graphql'
import { concurrencyExecutionLock } from '@zemble/utils/executionLock'

type Worker<TType extends keyof Zemble.QueueRegistry> = (queueConfig: Zemble.QueueRegistry[TType]) => Promise<void> | void

interface Config extends Zemble.GlobalConfig {
  readonly queues: Record<keyof Zemble.QueueRegistry, {
    readonly concurrency?: number
    readonly worker: Worker<keyof Zemble.QueueRegistry>
  }>
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface Providers {
      readonly addToQueue: IStandardAddToQueueService
      readonly removeFromQueue: IStandardRemoveFromQueueService
    }

    interface MiddlewareConfig {
      readonly ['@zemble/queue-in-memory']?: undefined
    }
  }
}

export interface JobData<TType extends keyof Zemble.QueueRegistry = keyof Zemble.QueueRegistry> {
  readonly jobId: string
  readonly type: TType
  readonly data: Zemble.QueueRegistry[TType]
  readonly priority: number
  readonly earliestExecution?: Date
}

const plugin = new Plugin<Config>(
  import.meta.dir,
  {
    dependencies: [{ plugin: GraphQL }],
    middleware: async ({ app }) => {
      const jobTimers = new Map<string, Timer>()
      const jobStatus = new Map<string, JobStatus>()
      // eslint-disable-next-line no-spaced-func
      const workers = new Map<keyof Zemble.QueueRegistry, (() => void)>()
      // eslint-disable-next-line functional/prefer-readonly-type
      const executionQueues = new Map<string, Array<JobData>>()
      let jobIdCounter = 0

      function createWorker<TType extends keyof Zemble.QueueRegistry>(type: TType, concurrency: number, worker: Worker<TType>) {
        return concurrencyExecutionLock(async () => {
          const executionQueue = executionQueues.get(type)!
          // eslint-disable-next-line functional/immutable-data
          const pickedJob = executionQueue.find((j) => !j.earliestExecution || j.earliestExecution.valueOf() < Date.now())

          if (!pickedJob) {
            throw new Error('No job found')
          }

          const { jobId, data } = pickedJob
          executionQueues.set(type, executionQueue.filter((j) => j.jobId !== jobId))
          jobStatus.set(jobId, 'active')
          try {
            await worker(data)
            jobStatus.set(jobId, 'completed')
          } catch (error) {
            jobStatus.set(jobId, 'failed')
          }
        }, concurrency ?? 1)
      }

      await setupProvider({
        app,
        // eslint-disable-next-line unicorn/consistent-function-scoping
        initializeProvider: () => (cfg) => {
          const queue = plugin.config.queues[cfg.type]
          // eslint-disable-next-line no-plusplus
          const jobId = `${cfg.type}:${cfg.jobId ?? (jobIdCounter++).toString()}`

          if (!queue) {
            throw new Error(`Queue ${cfg.type} not found`)
          }

          const executionQueue = executionQueues.get(cfg.type) ?? []

          executionQueues.set(cfg.type, [
            ...executionQueue, {
              jobId,
              data: cfg.data,
              type: cfg.type,
              priority: cfg.priority ?? -Date.now(),
              earliestExecution: cfg.delayMs ? new Date(Date.now() + cfg.delayMs) : undefined,
            },
          ].sort((a, b) => a.priority - b.priority))

          if (!workers.has(cfg.type)) {
            workers.set(cfg.type, createWorker(cfg.type, queue.concurrency ?? 1, queue.worker))
          }

          jobTimers.set(jobId, setTimeout(workers.get(cfg.type)!, cfg.delayMs ?? 0))
          jobStatus.set(jobId, 'queued')

          return {
            jobId,
            status: jobStatus.get(jobId)!,
            type: cfg.type,
          }
        },
        middlewareKey: '@zemble/queue-in-memory',
        providerKey: 'addToQueue',
      })

      await setupProvider({
        app,
        // eslint-disable-next-line unicorn/consistent-function-scoping
        initializeProvider: () => (jobId) => {
          const status = jobStatus.get(jobId)
          if (!status) {
            throw new Error('job with id not found')
          }
          const [type] = jobId.split(':')
          if (status === 'queued') {
            jobStatus.set(jobId, 'cancelled')
            const executionQueue = executionQueues.get(type!)!
            executionQueues.set(type!, executionQueue.filter((j) => j.jobId !== jobId))

            const timer = jobTimers.get(jobId)
            clearTimeout(timer)
          }

          return {
            jobId,
            status,
            type: type as keyof Zemble.QueueRegistry,
          }
        },
        middlewareKey: '@zemble/queue-in-memory',
        providerKey: 'removeFromQueue',
      })
    },
  },
)

export default plugin
