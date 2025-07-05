import { Plugin } from '@zemble/core'
import { setupProvider } from '@zemble/core/utils/setupProvider'
import Routes from '@zemble/routes'
import type { Db, MongoClientOptions } from 'mongodb'
import { MongoClient } from 'mongodb'

interface MongodbClientConfig extends Zemble.GlobalConfig {
  readonly url?: string
  readonly options?: MongoClientOptions
}

interface MongodbClientConfigRequired {
  readonly url: string
  readonly options?: MongoClientOptions
}

declare global {
  namespace Zemble {
    interface MiddlewareConfig {
      readonly '@zemble/mongodb'?: {
        readonly disable?: boolean
        readonly config?: MongodbClientConfigRequired
      }
    }

    interface Providers {
      mongodb:
        | {
            readonly client: MongoClient
            readonly db: Db
          }
        | undefined
    }
  }
}

const defaultConfig = {
  url: process.env['MONGO_URL'] ?? 'mongodb://localhost:27017',
} satisfies MongodbClientConfig

const regexToHidePassword = /(?<=mongodb\+srv:\/\/[^:]+:)[^@]+/

export default new Plugin<MongodbClientConfig, typeof defaultConfig>(
  import.meta.dir,
  {
    middleware: async ({ app, config, logger }) => {
      if (process.env.NODE_ENV !== 'test' || process.env['DEBUG']) {
        logger.info(
          'Connecting to MongoDB',
          config.url.replace(regexToHidePassword, '***'),
        )
      }

      // we create a global mongodb client for the app, which is also used for all plugins that don't have a custom
      // config
      const defaultClient = new MongoClient(config.url, config.options)

      defaultClient.on('error', (error) => {
        logger.error('MongoDB error', error)
      })

      if (process.env.NODE_ENV !== 'test' || process.env['DEBUG']) {
        logger.info('Connected to MongoDB')
      }

      await defaultClient.connect()

      await setupProvider({
        app,
        initializeProvider: async (customConfig) => {
          const pluginCustomConfig = customConfig?.config

          if (pluginCustomConfig) {
            const customClient = new MongoClient(config.url, config.options)

            customClient.on('error', (error) => {
              logger.error('MongoDB error', error)
            })

            await customClient.connect()

            return {
              client: customClient,
              db: customClient.db(),
            }
          }

          return {
            client: defaultClient,
            db: defaultClient.db(),
          }
        },
        providerKey: 'mongodb',
        middlewareKey: '@zemble/mongodb',
      })
    },
    defaultConfig,
    dependencies: [
      {
        plugin: Routes,
      },
    ],
  },
)
