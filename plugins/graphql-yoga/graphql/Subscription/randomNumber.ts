
import pubSub from '../../createPubSub'
import { SubscriptionResolvers } from '../schema.generated';
 


const randomNumber: SubscriptionResolvers['randomNumber'] = {
  // subscribe to the randomNumber event
  subscribe: () => {
    console.log('subscribing to randomNumber');
    return pubSub.subscribe('randomNumber');
  },
  resolve: (payload: number) => {
    console.log('resolving randomNumber', payload);
    return payload
  }
}

export default randomNumber