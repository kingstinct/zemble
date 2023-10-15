import { PluginWithMiddleware } from '@zemble/core'
import GraphQL from '@zemble/graphql'

import setupQueues from './utils/setupQueues'
import { ZembleQueue } from './ZembleQueue'

import type { ZembleQueueConfig } from './ZembleQueue'
import type {
  RedisOptions,
} from 'bullmq'

export interface BullPluginConfig extends Zemble.GlobalConfig {
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

export type { ZembleQueueConfig }

export { ZembleQueue }

export default new PluginWithMiddleware<BullPluginConfig>(__dirname, (config) => ({ plugins, context: { pubsub } }) => {
  plugins.forEach(({ pluginPath }) => {
    setupQueues(pluginPath, pubsub, config)
  })
}, {
  defaultConfig: defaults,
  dependencies: [
    {
      plugin: GraphQL.configure({

      }),
    },

  ],
})
