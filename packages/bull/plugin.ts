import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'

import HonoAdapter from './bullboard-hono-adapter'
import setupQueues from './utils/setupQueues'
import ZembleQueue from './ZembleQueue'

import type { ZembleQueueConfig } from './ZembleQueue'
import type { UIConfig } from '@bull-board/api/dist/typings/app'
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

  readonly bullboard?: {
    readonly ui?: Partial<UIConfig>
    /**
     * needs to be adjusted for monorepos with node_modules at another level than cwd
     * */
    readonly nodeModulesRootPath?: string
    readonly basePath?: string
  } | false
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
export default new Plugin<BullPluginConfig>(import.meta.dir, {
  defaultConfig: defaults,
  middleware: async ({
    plugins, context: { pubsub }, config, app, logger,
  }) => {
    const appPath = process.cwd()

    const allQueues = [
      ...(await Promise.all(plugins.map(async ({ pluginPath, config }) => {
        if (!config.middleware?.['zemble-plugin-bull']?.disable) {
          return setupQueues(pluginPath, pubsub, config, logger)
        }
        return []
      }))).flat(),
      ...await setupQueues(appPath, pubsub, config, logger),
    ]

    if (config.bullboard !== false && process.env.NODE_ENV !== 'test') {
      const serverAdapter = new HonoAdapter(app.hono)
      createBullBoard({
        queues: allQueues.map((q) => new BullMQAdapter(q)),
        serverAdapter,
        options: {
          uiConfig: {
            boardTitle: 'Zemble Queues',
            ...config.bullboard?.ui,
          },
        },
      })

      serverAdapter.setBasePath(config.bullboard?.basePath ?? '/queues')
      if (config.bullboard?.nodeModulesRootPath) {
        serverAdapter.setNodeModulesRootPath(config.bullboard?.nodeModulesRootPath)
      }
      serverAdapter.registerPlugin()
    }
  },
  additionalConfigWhenRunningLocally: {
    bullboard: {
      nodeModulesRootPath: '../..',
    },
  },
  dependencies: [
    {
      plugin: GraphQL.configure({

      }),
    },
  ],
})
