import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'

export default createApp({
  plugins: [
    Routes.configure(),
    GraphQL.configure(),
  ],
})
