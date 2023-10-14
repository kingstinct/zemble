import type { SubscriptionResolvers, Todo } from '../schema.generated'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface PubSubTopics {
      readonly todoCreated: readonly [Todo]
    }
  }
}

const todoCreated: SubscriptionResolvers['todoCreated'] = {
  // subscribe to the todoCreated event
  subscribe: (_, __, { pubsub, logger }) => {
    logger.log('subscribing to todoCreated')
    return pubsub.subscribe('todoCreated')
  },
  resolve: (payload: Todo) => payload,
}

export default todoCreated
