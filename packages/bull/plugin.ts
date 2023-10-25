import { PluginWithMiddleware } from '@zemble/core'
import GraphQL from '@zemble/graphql'

import setupQueues from './utils/setupQueues'
import ZembleQueue from './ZembleQueue'

import type { ZembleQueueConfig } from './ZembleQueue'
import type {
  RedisOptions,
} from 'bullmq'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['zemble-plugin-bull']?: {
        readonly disable?: boolean
      }
    }
  }
}

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
  middleware: {
    '@zemble/graphql': { disable: true },
    'zemble-plugin-bull': { disable: true },
  },
} satisfies BullPluginConfig

export type { ZembleQueueConfig }

export { ZembleQueue }

// eslint-disable-next-line unicorn/consistent-function-scoping
export default new PluginWithMiddleware<BullPluginConfig>(__dirname, ({ plugins, context: { pubsub }, config }) => {
  plugins.forEach(({ pluginPath, config }) => {
    if (!config.middleware?.['zemble-plugin-bull']?.disable) {
      setupQueues(pluginPath, pubsub, config)
    }
  })
  const appPath = process.cwd()
  setupQueues(appPath, pubsub, config)
}, {
  defaultConfig: defaults,
  dependencies: [
    {
      plugin: GraphQL.configure({

      }),
    },
  ],
})
