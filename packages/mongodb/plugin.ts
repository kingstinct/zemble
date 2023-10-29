import { PluginWithMiddleware } from '@zemble/core'
import { setupProvider } from '@zemble/core/utils/setupProvider'
import Routes from '@zemble/routes'
import { MongoClient } from 'mongodb'

import type { MongoClientOptions } from 'mongodb'

interface MongodbClientConfig extends Zemble.GlobalConfig {
  readonly url?: string
  readonly options?: MongoClientOptions
}

interface MongodbClientConfigRequired {
  readonly url: string
  readonly options?: MongoClientOptions
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {

    interface MiddlewareConfig {
      readonly '@zemble/mongodb'?: {
        readonly disable?: boolean,
        readonly config?: MongodbClientConfigRequired,
      }
    }

    interface Providers {
      // eslint-disable-next-line functional/prefer-readonly-type
      'mongodb': MongoClient | undefined
    }
  }
}

const defaultConfig = {
  url: process.env.MONGO_URL ?? 'mongodb://localhost:27017',
} satisfies MongodbClientConfig

export default new PluginWithMiddleware<MongodbClientConfig, typeof defaultConfig>(
  __dirname,
  async ({
    app, config, plugins,
  }) => {
    // we create a global mongodb client for the app, which is also used for all plugins that don't have a custom config
    const dbPromise = await MongoClient.connect(config.url, config.options)

    await setupProvider({
      app,
      initializeProvider: async (customConfig) => {
        const pluginCustomConfig = customConfig?.config
        return pluginCustomConfig
          ? MongoClient.connect(pluginCustomConfig.url, pluginCustomConfig.options)
          : dbPromise
      },
      providerKey: 'mongodb',
      plugins,
      middlewareKey: '@zemble/mongodb',
    })
  },
  {
    defaultConfig,
    dependencies: [
      {
        plugin: Routes,
      },
    ],
  },
)
