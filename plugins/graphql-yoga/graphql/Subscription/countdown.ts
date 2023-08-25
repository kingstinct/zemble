import { SubscriptionResolvers } from "../schema.generated";

const countdown: SubscriptionResolvers['countdown'] = {
  // This will return the value on every 1 sec until it reaches 0
  subscribe: async function* (_, { from }) {
    for (let i = from; i >= 0; i--) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      yield { countdown: i }
    }
  },
  resolve: (payload: unknown) => {
    console.log('resolving countdown', payload);
    return (payload as { countdown: number}).countdown
  }
}

export default countdown