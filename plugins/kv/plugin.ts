/* eslint-disable react-hooks/rules-of-hooks */
import { useExtendContext } from '@envelop/core'
import { Plugin } from '@readapt/core'
import gql from '@readapt/graphql-yoga'
import authApiToken from 'readapt-plugin-auth-api-token'

import CloudflareKeyValue from './clients/CloudFlareKeyValue'
import KeyValue from './clients/KeyValue'
import RedisKeyValue from './clients/RedisKeyValue'

import type { KVNamespace } from '@cloudflare/workers-types'
import type { RedisOptions } from 'ioredis'

interface KeyValueConfig extends Readapt.GlobalConfig {
  readonly implementation?: 'in-memory' | 'redis' | 'cloudflare';
  readonly redisOptions?: RedisOptions
  readonly redisUrl?: string
  readonly cloudflareNamespace?: KVNamespace
}

const defaultConfig = {
  redisUrl: process.env.REDIS_URL,
} satisfies KeyValueConfig

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
    interface GraphQLContext {
      readonly kv: typeof kv
    }
  }
}

const plugin = new Plugin<KeyValueConfig, typeof defaultConfig>(__dirname, {
  dependencies: ({ config }) => [
    {
      plugin: authApiToken,
      devOnly: true,
    },
    {
      plugin: gql.configure({
        yoga: {
          plugins: [
            useExtendContext((ctx) => {
              // eslint-disable-next-line functional/immutable-data
              ctx.kv = kv
            }),
          ],
        },
      }),
      devOnly: true,
    },
  ],
  defaultConfig,
})

export const { config } = plugin

export const kv = (prefix: string) => {
  if (config.implementation === 'cloudflare' || config.cloudflareNamespace) {
    if (!config.cloudflareNamespace) throw new Error('cloudflareNamespace is required for cloudflare implementation')
    return new CloudflareKeyValue(config.cloudflareNamespace, prefix)
  } if (config.implementation === 'redis' || config.redisUrl) {
    if (!config.redisUrl) throw new Error('REDIS_URL is required for redis implementation')
    return new RedisKeyValue(prefix, config.redisUrl, config.redisOptions)
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('Using in-memory key-value store in production is not recommended, since you can\'t share data between multiple instances of your app')
  }

  return new KeyValue(prefix)
}

export default plugin
