import { PluginWithMiddleware } from '@readapt/core'

import setupQueues from './utils/setupQueues'

import type { RedisOptions } from 'bullmq'

export interface BullPluginConfig extends Readapt.GlobalConfig {
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

export default new PluginWithMiddleware<BullPluginConfig>(__dirname, (config) => ({ plugins, context: { pubsub } }) => {
  plugins.forEach(({ pluginPath }) => {
    setupQueues(pluginPath, pubsub, config)
  })
}, {
  defaultConfig: defaults,
})
