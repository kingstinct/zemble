import type { SubscriptionResolvers } from '../schema.generated'

export const randomNumber: NonNullable<SubscriptionResolvers['randomNumber']> =
  {
    // subscribe to the randomNumber event
    subscribe: (_, __, { pubsub, logger }) => {
      logger.info('subscribing to randomNumber')
      return pubsub.subscribe('randomNumber')
    },
    resolve: (payload: number) => payload,
  }

export default randomNumber
