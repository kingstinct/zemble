import type { SubscriptionResolvers, Todo } from '../schema.generated'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface PubSubTopics {
      readonly todoUpdated: readonly [Todo]
    }
  }
}

const todoUpdated: SubscriptionResolvers['todoUpdated'] = {
  // subscribe to the todoUpdated event
  subscribe: (_, __, { pubsub, logger }) => {
    logger.log('subscribing to todoUpdated')
    return pubsub.subscribe('todoUpdated')
  },
  resolve: (payload: Todo) => payload,
}

export default todoUpdated
