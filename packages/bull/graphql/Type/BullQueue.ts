import type { Queue } from 'bullmq'
import type { Resolvers } from '../schema.generated'

const BullQueueResolvers: Resolvers['BullQueue'] = {
  name: ({ name }) => name,
  count: async (queue) => queue.count(),
  completedCount: async (queue) => queue.getCompletedCount(),
  activeCount: async (queue) => queue.getActiveCount(),
  waitingCount: async (queue) => queue.getWaitingCount(),
  waitingChildrenCount: async (queue) => queue.getWaitingChildrenCount(),
  failedCount: async (queue) => queue.getFailedCount(),
  isPaused: async (queue) => queue.isPaused(),
  repeatableJobs: async (queue, { start, end, asc }) => {
    const repeatableJobs = await queue.getRepeatableJobs(start ?? undefined, end ?? undefined, asc ?? undefined)

    return repeatableJobs
  },
  jobs: async (queue: Queue, { start, end, asc, type }) => {
    const jobs = await queue.getJobs(
      // @ts-expect-error readonly stuff
      Array.isArray(type) ? [...type] : type,
      start,
      end,
      asc,
    )

    // filter out repeatable jobs (they're undefined, weird but yeah)
    return jobs.filter((j) => !!j) ?? []
  },
}

export default BullQueueResolvers
