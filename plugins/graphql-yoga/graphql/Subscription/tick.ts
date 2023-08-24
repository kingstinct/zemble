import pubSub from "../../pubsub";
 
setInterval(() => {
  pubSub.publish('tick', Date.now())
})

const tick = {
  // subscribe to the tick event
  subscribe: () => {
    console.log('subscribing to tick');
    return pubSub.subscribe('tick');
  },
  resolve: (payload: unknown) => {
    console.log('resolving tick', payload);
    return payload
  }
}

export default tick