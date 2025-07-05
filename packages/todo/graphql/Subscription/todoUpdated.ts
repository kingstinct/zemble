import type { SubscriptionResolvers, Todo } from '../schema.generated'

declare global {
  namespace Zemble {
    interface PubSubTopics {
      readonly todoUpdated: readonly [Todo]
    }
  }
}

export const todoUpdated: NonNullable<SubscriptionResolvers['todoUpdated']> = {
  // subscribe to the todoUpdated event
  subscribe: (_, __, { pubsub, logger }) => {
    logger.info('subscribing to todoUpdated')
    return pubsub.subscribe('todoUpdated')
  },
  resolve: (payload: Todo) => payload,
}

export default todoUpdated
