import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'

export default new Plugin(
  __dirname,
  {
    dependencies: [
      { plugin: GraphQL },
      { plugin: Routes },
    ],
  },
)
