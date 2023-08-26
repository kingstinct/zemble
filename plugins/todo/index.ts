import PluginConfig from '@readapt/core/types'
import Yoga from '@readapt/graphql-yoga'

export default new PluginConfig(__dirname, {
  // this is mostly to ensure we get the global typings past here
  middlewareDependencies: [Yoga.configureMiddleware({})],
})
