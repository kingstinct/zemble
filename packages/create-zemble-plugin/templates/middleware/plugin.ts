import { PluginWithMiddleware } from '@zemble/core'

export default new PluginWithMiddleware(
  __dirname,
  ({
    app, config, context, plugins,
  }) => {
    // Middleware
  },
  {
    dependencies: [],
  },
)
