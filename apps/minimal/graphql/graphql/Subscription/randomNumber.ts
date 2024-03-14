import type { SubscriptionResolvers } from '../../types.generated'

export const randomNumber: NonNullable<SubscriptionResolvers['randomNumber']> = {
  subscribe: async (_parent, _arg, _ctx) => { /* Implement Subscription.randomNumber resolver logic here */ },
}
