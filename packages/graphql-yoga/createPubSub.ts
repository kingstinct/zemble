import { createPubSub as createYogaPubSub } from 'graphql-yoga'

import type { RedisOptions } from 'ioredis'

const createPubSub = async (redisUrl?: string, redisConfig?: RedisOptions) => {
  if (redisUrl) {
    const { createRedisEventTarget } = await import('@graphql-yoga/redis-event-target')
    const { createClient } = await import('./clients/redis')
    const publishClient = createClient(redisUrl, redisConfig)
    const subscribeClient = createClient(redisUrl, redisConfig)

    const eventTarget = createRedisEventTarget({
      publishClient,
      subscribeClient,
    })

    return createYogaPubSub({ eventTarget })
  }

  return createYogaPubSub()
}

export default createPubSub
