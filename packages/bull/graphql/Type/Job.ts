import type { Job } from 'bullmq'

export default {
  name: ({ name }: Job) => name,
  id: ({ id }: Job) => id,
  delay: ({ delay }: Job) => delay,
  state: async (queue: Job) => queue.getState(),
}
