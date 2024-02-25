import type { SubscriptionResolvers } from '../schema.generated'

const randomNumber: SubscriptionResolvers['randomNumber'] = {
  // subscribe to the randomNumber event
  subscribe: (_, __, { pubsub }) => {
    console.log('subscribing to randomNumber')
    return pubsub.subscribe('randomNumber')
  },
  resolve: (payload: number) => {
    console.log('resolving randomNumber', payload)
    return payload
  },
}

export default randomNumber
