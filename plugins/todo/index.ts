import PluginConfig from '@readapt/core/types'
import Yoga from '@readapt/graphql-yoga'
import anonymousAuth from 'readapt-plugin-anonymous-auth'

export default new PluginConfig(__dirname, {
  // this is mostly to ensure we get the global typings past here
  middlewareDependencies: [{ middleware: Yoga.configureMiddleware() }],
  pluginDependencies: [{ plugin: anonymousAuth.configurePlugin(), devOnly: true }],
})
