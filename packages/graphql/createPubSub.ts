import { createPubSub as createYogaPubSub } from 'graphql-yoga'

import type { RedisOptions } from 'ioredis'

const createPubSub = async (redisUrl?: string, redisConfig?: RedisOptions) => {
  if (redisUrl) {
    try {
      // eslint-disable-next-line import/no-extraneous-dependencies
      const { createRedisEventTarget } = await import('@graphql-yoga/redis-event-target')
      const { createClient } = await import('./clients/redis')
      const publishClient = createClient(redisUrl, redisConfig)
      const subscribeClient = createClient(redisUrl, redisConfig)

      const eventTarget = createRedisEventTarget({
        publishClient,
        subscribeClient,
      })

      return createYogaPubSub({ eventTarget })
    } catch (error) {
      console.error('Error initializing pubsub, maybe you need to install ioredis or @graphql-yoga/redis-event-target?', error)
    }
  }

  return createYogaPubSub()
}

export default createPubSub
