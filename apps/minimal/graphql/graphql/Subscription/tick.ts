import type { SubscriptionResolvers } from '../../types.generated'

export const tick: NonNullable<SubscriptionResolvers['tick']> = {
  subscribe: async (_parent, _arg, _ctx) => { /* Implement Subscription.tick resolver logic here */ },
}
