import type { SubscriptionResolvers, Todo } from '../schema.generated'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
    interface PubSubTopics {
      readonly todoUpdated: readonly [Todo]
    }
  }
}

const todoUpdated: SubscriptionResolvers['todoUpdated'] = {
  // subscribe to the todoUpdated event
  subscribe: (_, __, { pubsub }) => {
    console.log('subscribing to todoUpdated')
    return pubsub.subscribe('todoUpdated')
  },
  resolve: (payload: Todo) => {
    console.log('resolving todoUpdated', payload)
    return payload
  },
}

export default todoUpdated
