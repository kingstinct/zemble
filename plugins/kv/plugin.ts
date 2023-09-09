/* eslint-disable react-hooks/rules-of-hooks */
import { useExtendContext } from '@envelop/core'
import { Plugin } from '@readapt/core'
import gql from '@readapt/graphql-yoga'
import authApiToken from 'readapt-plugin-auth-api-token'

import CloudflareKeyValue from './clients/CloudFlareKeyValue'
import KeyValue from './clients/KeyValue'
import RedisKeyValue from './clients/RedisKeyValue'

import type { KVNamespace } from '@cloudflare/workers-types'
import type { IStandardKeyValueService } from '@readapt/core'
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

export function kv<T extends Readapt.KVPrefixes[K], K extends keyof Readapt.KVPrefixes = keyof Readapt.KVPrefixes>(prefix: K): IStandardKeyValueService<T> {
  const prefixStr = prefix.toString()
  if (config.implementation === 'cloudflare' || config.cloudflareNamespace) {
    console.log('initing cloudflare kv')
    if (!config.cloudflareNamespace) throw new Error('cloudflareNamespace is required for cloudflare implementation')
    return new CloudflareKeyValue<T>(config.cloudflareNamespace, prefixStr)
  } if (config.implementation === 'redis' || config.redisUrl) {
    if (!config.redisUrl) throw new Error('REDIS_URL is required for redis implementation')
    console.log('initing redis kv')
    return new RedisKeyValue<T>(prefixStr, config.redisUrl, config.redisOptions)
  }

  if (process.env.NODE_ENV === 'production') {
    console.warn('Using in-memory key-value store in production is not recommended, since you can\'t share data between multiple instances of your app')
  }

  console.log('initing in-memory kv')

  return new KeyValue<T>(prefixStr)
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
            useExtendContext((ctx: Readapt.GraphQLContext) => {
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

export default plugin
