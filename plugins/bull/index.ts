import { PluginConfig } from '@readapt/core/types'
import setupQueues from './utils/setupQueues';
import { RedisOptions } from 'bullmq';

type BullPluginConfig = {
 /**
   * The url of the redis instance to use for pubsub
   */
 redisUrl?: string
 /**
  * Redis config to use for pubsub
  */
 redisOptions?: RedisOptions
}

const defaults = {
  redisUrl: process.env.REDIS_URL,
} satisfies BullPluginConfig

export default new PluginConfig<BullPluginConfig, typeof defaults>(__dirname, {
  defaultConfig: defaults,
  middleware: (plugins, app, config, { pubsub: pubSub }) => {
    plugins.forEach(({ pluginPath }) => {
      setupQueues(pluginPath, pubSub)
    })
  },
})