import { PluginWithMiddleware } from '@zemble/core'
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
    const db = await MongoClient.connect(config.url, config.options)

    await Promise.all(plugins.map(async (plugin) => {
      if (!plugin.config.middleware?.['@zemble/mongodb']?.disable) {
        const pluginConfig = plugin.config.middleware?.['@zemble/mongodb']?.config

        // eslint-disable-next-line functional/immutable-data, no-param-reassign
        plugin.providers.mongodb = pluginConfig
          ? await MongoClient.connect(pluginConfig.url, pluginConfig.options)
          : db
      }
    }))

    // eslint-disable-next-line functional/immutable-data, no-param-reassign
    app.providers.mongodb = db
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
