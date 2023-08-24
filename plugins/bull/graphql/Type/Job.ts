import { JobType, Job } from "bullmq";

export default {
  name: ({name}: Job) => name,
  id: ({id}: Job) => id,
  delay: ({delay}: Job) => delay,
  state: (queue: Job) => queue.getState(),
}