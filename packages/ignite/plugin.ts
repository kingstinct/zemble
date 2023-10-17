import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import Bull from 'zemble-plugin-bull'

export default new Plugin(__dirname, {
  defaultConfig: {},
  dependencies: () => [
    { plugin: Routes },
    { plugin: GraphQL },
    { plugin: Bull },
  ],
})
