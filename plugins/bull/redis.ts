import Redis from 'ioredis'

import type { RedisOptions } from 'ioredis'

const REDIS_URL = 'redis://:ZPkKGcovADbMP4VFKwc7@dev-redis-new.zmart.rest:6379'

const NODE_ENV = 'development' as string

export const createClient = (options?: RedisOptions): Redis => {
  if (NODE_ENV === 'test') { // this is currently just to avoid connection to the real Redis cluster
    return {} as Redis
    // throw new Error('Redis client is not available in test environment');
  }

  if(!REDIS_URL) throw new Error('REDIS_URL is not defined')

  console.info(`Connecting to Redis at ${REDIS_URL}`)

  const redis = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...options,
  })
  redis.setMaxListeners(30)

  redis.on('error', (error) => {
    console.error(error, 'Redis error')
  })

  redis.on('connect', () => {
    console.info('Connected to Redis')
  })

  return redis
}

export default createClient()
