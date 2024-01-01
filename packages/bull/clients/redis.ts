import Redis from 'ioredis'

import type { IStandardLogger } from '@zemble/core'
import type { RedisOptions } from 'ioredis'

const NODE_ENV = 'development' as string

export const createClient = (redisUrl: string, options: { readonly redis?: RedisOptions, readonly logger: IStandardLogger }): Redis => {
  if (NODE_ENV === 'test') { // this is currently just to avoid connection to the real Redis cluster
    return {} as Redis
    // throw new Error('Redis client is not available in test environment');
  }

  const { logger } = options

  logger.info(`Connecting to Redis at ${redisUrl}`)

  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...options.redis,
  })
  redis.setMaxListeners(30)

  redis.on('error', (error) => {
    logger.error(error, 'Redis error')
  })

  redis.on('connect', () => {
    logger.info('Connected to Redis')
  })

  return redis
}

export default createClient
