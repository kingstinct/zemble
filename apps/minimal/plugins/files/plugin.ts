import Plugin from '@zemble/core/Plugin'
import Routes from '@zemble/routes'

export default new Plugin(
  __dirname,
  {
    name: 'files',
    version: '0.0.1',
    dependencies: [
      {
        plugin: Routes,
      },
    ],
  },
)
