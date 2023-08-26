import type { SubscriptionResolvers } from '../schema.generated'
import type { Job } from 'bullmq'

const jobUpdated: SubscriptionResolvers['jobUpdated'] = {
  // subscribe to the jobUpdated event
  subscribe: (_, __, { pubsub }) => {
    console.log('subscribing to jobUpdated')
    return pubsub.subscribe('jobUpdated')
  },
  resolve: (payload: Job) => {
    console.log('resolving jobUpdated', payload)
    return payload
  },
}

export default jobUpdated
