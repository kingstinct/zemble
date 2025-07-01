import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import type { UIConfig } from '@bull-board/api/dist/typings/app'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import { parseEnvBoolean } from '@zemble/utils/node/parseEnv'
import type { RedisOptions } from 'bullmq'
import HonoAdapter from './bullboard-hono-adapter'
import setupQueues, { getZembleQueues } from './utils/setupQueues'
import type { ZembleQueueConfig } from './ZembleQueue'
import ZembleQueue from './ZembleQueue'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/bull']?: {
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

  readonly bullboard?:
    | {
        readonly ui?: Partial<UIConfig>
        /**
         * needs to be adjusted for monorepos with node_modules at another level than cwd
         * */
        readonly nodeModulesRootPath?: string
        readonly basePath?: string
      }
    | false

  /**
   * Disables all queue workers
   */
  readonly DISABLE_QUEUE_WORKERS?: boolean
}

const defaults = {
  DISABLE_QUEUE_WORKERS: parseEnvBoolean('DISABLE_QUEUE_WORKERS', false),
  redisUrl: process.env['REDIS_URL'],
  middleware: {
    '@zemble/graphql': { disable: true },
    '@zemble/bull': { disable: true },
  },
} satisfies BullPluginConfig

export type { ZembleQueueConfig }

export { ZembleQueue }

export const waitUntilEmpty = async () => {
  const queues = getZembleQueues()

  return Promise.all(queues.map(async (queue) => queue.waitUntilEmpty()))
}

// eslint-disable-next-line unicorn/consistent-function-scoping
export default new Plugin<BullPluginConfig>(import.meta.dir, {
  defaultConfig: defaults,
  middleware: async ({ context: { pubsub }, config, app, logger }) => {
    const appPath = process.cwd()

    const allQueues = [
      ...(
        await Promise.all(
          app.plugins.map(async ({ pluginPath, config }) => {
            if (!config.middleware?.['@zemble/bull']?.disable) {
              return setupQueues(pluginPath, pubsub, config, logger)
            }
            return []
          }),
        )
      ).flat(),
      ...(await setupQueues(appPath, pubsub, config, logger)),
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
      plugin: GraphQL.configure({}),
    },
  ],
})
