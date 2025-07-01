import type { Job } from 'bullmq'
import type { SubscriptionResolvers } from '../schema.generated'

export const jobUpdated: NonNullable<SubscriptionResolvers['jobUpdated']> = {
  // subscribe to the jobUpdated event
  subscribe: (_, __, { pubsub }) => pubsub.subscribe('jobUpdated'),
  resolve: (payload: Job) => payload,
}

export default jobUpdated
