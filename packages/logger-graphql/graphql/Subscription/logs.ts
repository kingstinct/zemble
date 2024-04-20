import type { SubscriptionResolvers } from '../schema.generated'

export const logs: NonNullable<SubscriptionResolvers['logs']> = {
  subscribe: (_, __, { pubsub }) => {
    setTimeout(() => {
      pubsub.publish(`logger`, { severity: 'info', args: ['logger streamer started'] })
    }, 0)
    return pubsub.subscribe(`logger`)
  },
  resolve: (payload: { readonly severity: string, readonly args: readonly [unknown?, ...readonly unknown[]]}) => {
    const { severity, args } = payload

    return {
      severity,
      message: args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a, null, ' ').replaceAll('\n', ' '))).join(', '),
      timestamp: new Date().toISOString(),
    }
  },
}

export default logs
