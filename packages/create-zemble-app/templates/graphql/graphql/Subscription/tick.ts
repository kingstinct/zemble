import type { SubscriptionResolvers } from '../schema.generated'

let initialized = false
const initializeOnce = (pubsub: Zemble.PubSubType) => {
  if (initialized) return
  initialized = true
  setInterval(() => {
    pubsub.publish('tick', Date.now())
  }, 1000)
}

export const tick: SubscriptionResolvers['tick'] = {
  // subscribe to the tick event
  subscribe: (_, __, { pubsub }) => {
    initializeOnce(pubsub)
    console.log('subscribing to tick')
    return pubsub.subscribe('tick')
  },
  resolve: (payload: number) => payload,
}

export default tick
