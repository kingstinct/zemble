import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'

import MyRoutes from './plugins/files/plugin'

export default createApp({
  plugins: [
    Routes.configure(),
    GraphQL.configure({ sofa: { basePath: '/api' } }),
    MyRoutes.configure(),
  ],
})
