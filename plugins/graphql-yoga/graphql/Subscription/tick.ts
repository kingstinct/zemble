import pubSub from "../../createPubSub";
import { SubscriptionResolvers } from "../schema.generated";

let initialized = false
const initializeOnce = () => {
  if (initialized) return
  initialized = true
  setInterval(() => {
    pubSub.publish('tick', Date.now())
  }, 1000)
}
 

const tick: SubscriptionResolvers['tick'] = {
  // subscribe to the tick event
  subscribe: () => {
    initializeOnce()
    console.log('subscribing to tick');
    return pubSub.subscribe('tick');
  },
  resolve: (payload: number) => {
    return payload
  }
}

export default tick