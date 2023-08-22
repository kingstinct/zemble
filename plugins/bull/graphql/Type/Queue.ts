import { JobType, Queue } from "bullmq";

export default {
  name: ({name}: Queue) => name,
  count: (queue: Queue) => queue.count(),
  completedCount: (queue: Queue) => queue.getCompletedCount(),
  activeCount: (queue: Queue) => queue.getActiveCount(),
  waitingCount: (queue: Queue) => queue.getWaitingCount(),
  waitingChildrenCount: (queue: Queue) => queue.getWaitingChildrenCount(),
  failedCount: (queue: Queue) => queue.getFailedCount(),
  delayedCount: (queue: Queue) => queue.getDelayedCount(),
  isPaused: (queue: Queue) => queue.isPaused(),
  jobs: (queue: Queue, { start, end, asc, types }: { start?: number, end?: number, asc?: boolean, types?: JobType }) => queue.getJobs(types, start, end, asc),
}