import Redis from 'ioredis'

import type { RedisOptions } from 'ioredis'

const NODE_ENV = 'development' as string

export const createClient = (redisUrl: string, options?: RedisOptions): Redis => {
  if (NODE_ENV === 'test') { // this is currently just to avoid connection to the real Redis cluster
    return {} as Redis
    // throw new Error('Redis client is not available in test environment');
  }

  console.info(`[@zemble/bull] Connecting to Redis at ${redisUrl}`)

  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...options,
  })
  redis.setMaxListeners(30)

  redis.on('error', (error) => {
    console.error(error, 'Redis error')
  })

  redis.on('connect', () => {
    console.info('[@zemble/bull] Connected to Redis')
  })

  return redis
}

export default createClient
