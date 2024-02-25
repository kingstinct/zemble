import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'

export default new Plugin(
  import.meta.dir,
  {
    dependencies: [
      { plugin: GraphQL },
      { plugin: Routes },
    ],
    name: 'pkgname',
    version: '0.0.1',
  },
)
