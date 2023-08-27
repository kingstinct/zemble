import type { SubscriptionResolvers } from '../schema.generated'

let initialized = false
const initializeOnce = (pubsub: Readapt.PubSubType) => {
  if (initialized) return
  initialized = true
  setInterval(() => {
    pubsub.publish('tick', Date.now())
  }, 1000)
}

const tick: SubscriptionResolvers['tick'] = {
  // subscribe to the tick event
  subscribe: (_, __, { pubsub }) => {
    initializeOnce(pubsub)
    console.log('subscribing to tick')
    return pubsub.subscribe('tick')
  },
  resolve: (payload: number) => payload,
}

export default tick
