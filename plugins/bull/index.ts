import { PluginConfigWithMiddleware } from '@readapt/core/types'

import setupQueues from './utils/setupQueues'

import type { RedisOptions } from 'bullmq'

export type BullPluginConfig = {
  /**
   * The url of the redis instance to use for pubsub
   */
  readonly redisUrl?: string
  /**
  * Redis config to use for pubsub
  */
  readonly redisOptions?: RedisOptions
}

const defaults = {
  redisUrl: process.env.REDIS_URL,
} satisfies BullPluginConfig

export default new PluginConfigWithMiddleware<BullPluginConfig, typeof defaults>(__dirname, (config) => ({ plugins, context: { pubsub } }) => {
  plugins.forEach(({ pluginPath }) => {
    setupQueues(pluginPath, pubsub, config)
  })
})
