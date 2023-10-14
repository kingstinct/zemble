/* eslint-disable react-hooks/rules-of-hooks */
import { useExtendContext } from '@envelop/core'
import { Plugin } from '@zemble/core'
import zembleContext from '@zemble/core/zembleContext'
import gql from '@zemble/graphql'

import CloudflareKeyValue from './clients/CloudFlareKeyValue'
import KeyValue from './clients/KeyValue'
import RedisKeyValue from './clients/RedisKeyValue'

import type { KVNamespace } from '@cloudflare/workers-types'
import type { IStandardKeyValueService } from '@zemble/core'
import type { RedisOptions } from 'ioredis'

interface KeyValueConfig extends Zemble.GlobalConfig {
  readonly implementation?: 'in-memory' | 'redis' | 'cloudflare';
  readonly redisOptions?: RedisOptions
  readonly redisUrl?: string
  readonly cloudflareNamespace?: KVNamespace
}

const defaultConfig = {
  redisUrl: process.env.REDIS_URL,
} satisfies KeyValueConfig

type KvBound = <T extends Zemble.KVPrefixes[K], K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes>(prefix: K) => IStandardKeyValueService<T>

function kvUnbound<T extends Zemble.KVPrefixes[K], K extends keyof Zemble.KVPrefixes = keyof Zemble.KVPrefixes>(this: Zemble.GlobalContext, prefix: K): IStandardKeyValueService<T> {
  const prefixStr = prefix.toString()
  const { config } = plugin

  if (config.implementation === 'cloudflare' || config.cloudflareNamespace) {
    this.logger.log('initing cloudflare kv')
    if (!config.cloudflareNamespace) throw new Error('cloudflareNamespace is required for cloudflare implementation')
    return new CloudflareKeyValue<T>(config.cloudflareNamespace, prefixStr)
  } if (config.implementation === 'redis' || config.redisUrl) {
    if (!config.redisUrl) throw new Error('REDIS_URL is required for redis implementation')
    this.logger.log('initing redis kv')
    return new RedisKeyValue<T>(prefixStr, config.redisUrl, config.redisOptions)
  }

  if (process.env.NODE_ENV === 'production') {
    this.logger.warn('Using in-memory key-value store in production is not recommended, since you can\'t share data between multiple instances of your app')
  }

  this.logger.log('initing in-memory kv')

  return new KeyValue<T>(prefixStr)
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore fix later
export const kv: KvBound = kvUnbound.bind(zembleContext)

const plugin = new Plugin<KeyValueConfig, typeof defaultConfig>(__dirname, {
  dependencies: ({ config }) => [
    {
      plugin: gql.configure({
        yoga: {
          plugins: [
            useExtendContext((ctx: Zemble.GraphQLContext) => {
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

export default plugin
