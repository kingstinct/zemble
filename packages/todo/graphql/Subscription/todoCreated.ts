import type { SubscriptionResolvers, Todo } from '../schema.generated'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface PubSubTopics {
      readonly todoCreated: readonly [Todo]
    }
  }
}

export const todoCreated: NonNullable<SubscriptionResolvers['todoCreated']> = {
  // subscribe to the todoCreated event
  subscribe: (_, __, { pubsub, logger }) => {
    logger.info('subscribing to todoCreated')
    return pubsub.subscribe('todoCreated')
  },
  resolve: (payload: Todo) => payload,
}

export default todoCreated
