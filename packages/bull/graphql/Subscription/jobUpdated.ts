import type { SubscriptionResolvers } from '../schema.generated'
import type { Job } from 'bullmq'

const jobUpdated: SubscriptionResolvers['jobUpdated'] = {
  // subscribe to the jobUpdated event
  subscribe: (_, __, { pubsub }) => pubsub.subscribe('jobUpdated'),
  resolve: (payload: Job) => payload,
}

export default jobUpdated
