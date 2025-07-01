import type { IStandardLogger } from '@zemble/core'
import zembleContext from '@zemble/core/zembleContext'
import { createPubSub as createYogaPubSub } from 'graphql-yoga'
import type { RedisOptions } from 'ioredis'

const createPubSub = async (redisUrl?: string, options?: { readonly redis?: RedisOptions; readonly logger?: IStandardLogger }) => {
  if (redisUrl && process.env.NODE_ENV !== 'test') {
    const optionsWithDefaults = { logger: zembleContext.logger, ...options }
    try {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { createRedisEventTarget } = await import('@graphql-yoga/redis-event-target')
      const { createClient } = await import('./clients/redis')
      const publishClient = createClient(redisUrl, optionsWithDefaults)
      const subscribeClient = createClient(redisUrl, optionsWithDefaults)

      const eventTarget = createRedisEventTarget({
        publishClient,
        subscribeClient,
      })

      return createYogaPubSub({ eventTarget })
    } catch (error) {
      optionsWithDefaults.logger.error('Error initializing pubsub, maybe you need to install ioredis or @graphql-yoga/redis-event-target?', error)
    }
  }

  return createYogaPubSub()
}

export default createPubSub
