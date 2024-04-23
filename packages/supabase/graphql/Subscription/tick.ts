import type { SubscriptionResolvers } from '../schema.generated'

let initialized = false
const initializeOnce = (pubsub: Zemble.PubSubType) => {
  if (initialized) return
  initialized = true
  setInterval(() => {
    pubsub.publish('tick', Date.now())
  }, 1000)
}

export const tick: NonNullable<SubscriptionResolvers['tick']> = {
  // subscribe to the tick event
  subscribe: (_, __, { pubsub, logger }) => {
    initializeOnce(pubsub)
    logger.info('subscribing to tick')
    return pubsub.subscribe('tick')
  },
  resolve: (payload: number) => payload,
}

export default tick
