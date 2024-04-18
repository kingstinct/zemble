/* eslint-disable react-hooks/rules-of-hooks */
import { KeyValue, Plugin, setupProvider } from '@zemble/core'

import RedisKeyValue from './clients/RedisKeyValue'

import type { IStandardKeyValueService } from '@zemble/core'
import type { RedisOptions } from 'ioredis'

interface KeyValueConfig {
  readonly implementation?: 'in-memory' | 'redis' | 'cloudflare';
  readonly redisOptions?: RedisOptions
  readonly redisUrl?: string
}

const defaultConfig = {
  redisUrl: process.env.REDIS_URL,
} satisfies KeyValueConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {

    interface MiddlewareConfig {
      readonly '@zemble/kv'?: {
        readonly disable?: boolean,
      } & KeyValueConfig
    }
  }
}

const plugin = new Plugin<KeyValueConfig & Zemble.GlobalConfig, typeof defaultConfig>(import.meta.dir,
  {
    defaultConfig,
    middleware: async ({
      app, config, logger,
    }) => {
      await setupProvider({
        app,
        middlewareKey: '@zemble/kv',
        initializeProvider: async (pluginConfig) => {
          const initWithConfig = pluginConfig ?? config

          return function PrefixWrapper<
            T extends Zemble.KVPrefixes[K],
            K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes
          >(prefix: K) {
            if (initWithConfig.implementation === 'redis') {
              if (initWithConfig.redisUrl) {
                return new RedisKeyValue<T>(
                  prefix as string,
                  initWithConfig.redisUrl!,
                  logger,
                  initWithConfig.redisOptions,
                )
              }
              logger.warn('redisUrl is required for redis implementation')
            }

            if (process.env.NODE_ENV === 'production') {
              logger.warn('Using in-memory key-value store in production is not recommended, since you can\'t share data between multiple instances of your app')
            }

            return new KeyValue<T>(prefix as string) as IStandardKeyValueService<T>
          }
        },
        providerKey: 'kv',
      })
    },
  })

export default plugin
