
import { YogaServerOptions } from 'graphql-yoga';

import { PluginConfig } from '@readapt/core/types'
import setupQueues from './utils/setupQueues';

type GraphQLPluginConfig = {
  yoga: Omit<YogaServerOptions<{}, {}>, 'schema'>,
}

const defaults = {
  yoga: { },
} satisfies GraphQLPluginConfig

export default new PluginConfig<GraphQLPluginConfig, typeof defaults>(__dirname, {
  defaultConfig: defaults,
  middleware: (plugins, app, config) => {
    plugins.forEach(({ pluginPath }) => {
      setupQueues(pluginPath)
    })
  },
})