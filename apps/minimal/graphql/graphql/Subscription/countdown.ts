import type { SubscriptionResolvers } from '../../types.generated'

export const countdown: NonNullable<SubscriptionResolvers['countdown']> = {
  subscribe: async (_parent, _arg, _ctx) => { /* Implement Subscription.countdown resolver logic here */ },
}
