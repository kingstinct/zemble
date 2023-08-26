import type { JobType, Queue } from 'bullmq'

export default {
  name: ({ name }: Queue) => name,
  count: async (queue: Queue) => queue.count(),
  completedCount: async (queue: Queue) => queue.getCompletedCount(),
  activeCount: async (queue: Queue) => queue.getActiveCount(),
  waitingCount: async (queue: Queue) => queue.getWaitingCount(),
  waitingChildrenCount: async (queue: Queue) => queue.getWaitingChildrenCount(),
  failedCount: async (queue: Queue) => queue.getFailedCount(),
  delayedCount: async (queue: Queue) => queue.getDelayedCount(),
  isPaused: async (queue: Queue) => queue.isPaused(),
  jobs: async (queue: Queue, {
    start, end, asc, types,
  }: { readonly start?: number, readonly end?: number, readonly asc?: boolean, readonly types?: JobType }) => queue.getJobs(types, start, end, asc),
}
