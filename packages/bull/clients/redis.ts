import Redis from 'ioredis'

import type { IStandardLogger } from '@zemble/core'
import type { RedisOptions } from 'ioredis'

export const createClient = (redisUrl: string, options: { readonly redis?: RedisOptions, readonly logger: IStandardLogger }): Redis => {
  if (process.env.NODE_ENV === 'test') { // this is currently just to avoid connection to the real Redis cluster
    return {} as Redis
    // throw new Error('Redis client is not available in test environment');
  }

  const { logger } = options

  logger.info(`Connecting to Redis at ${redisUrl}`)

  const redisOptions = { ...options.redis }
  // eslint-disable-next-line functional/immutable-data
  delete redisOptions.keyPrefix

  const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...redisOptions,
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
