
import { YogaServerOptions } from 'graphql-yoga';

import { PluginConfig } from '@readapt/core/types'
import setupQueues from './utils/setupQueues';

type GraphQLPluginConfig = {
 
}

const defaults = {
  
}

export default new PluginConfig<GraphQLPluginConfig, typeof defaults>(__dirname, {
  defaultConfig: defaults,
  middleware: (plugins, app, config) => {
    plugins.forEach(({ pluginPath }) => {
      setupQueues(pluginPath)
    })
  },
})