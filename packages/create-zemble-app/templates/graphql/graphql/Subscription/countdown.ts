import type { SubscriptionResolvers } from '../schema.generated'

export const countdown: SubscriptionResolvers['countdown'] = {
  // This will return the value on every 1 sec until it reaches 0
  // eslint-disable-next-line object-shorthand
  subscribe: async function* (_, { from }, { logger }) {
    // eslint-disable-next-line no-plusplus
    for (let i = from; i >= 0; i--) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        logger.info('countdown', { countdown: i })
        setTimeout(resolve, 1000)
      })
      yield { countdown: i }
    }
  },
  resolve: (payload: unknown) => (payload as { readonly countdown: number}).countdown,
}

export default countdown
