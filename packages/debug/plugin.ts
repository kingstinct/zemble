import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import Auth from 'zemble-plugin-auth'

export default new Plugin(
  import.meta.dir,
  {
    dependencies: [
      { plugin: GraphQL },
      { plugin: Routes },
      { plugin: Auth },
    ],
  },
)
