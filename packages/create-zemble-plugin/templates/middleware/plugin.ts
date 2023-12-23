import { PluginWithMiddleware } from '@zemble/core'

export default new PluginWithMiddleware(
  import.meta.dir,
  ({
    app, config, context, plugins,
  }) => {
    // Middleware
  },
  {
    dependencies: [],
  },
)
