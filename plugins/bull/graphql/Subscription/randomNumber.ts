
import pubSub from '../../pubsub'
 


const randomNumber = {
  // subscribe to the randomNumber event
  subscribe: () => {
    console.log('subscribing to randomNumber');
    return pubSub.subscribe('randomNumber');
  },
  resolve: (payload: unknown) => {
    console.log('resolving randomNumber', payload);
    return payload
  }
}

export default randomNumber