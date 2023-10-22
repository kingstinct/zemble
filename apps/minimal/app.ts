import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import AnonymousAuth from 'zemble-plugin-auth-anonymous'

import MyRoutes from './plugins/files/plugin'

export default createApp({
  plugins: [
    Routes.configure(),
    GraphQL.configure({ sofa: { basePath: '/api' } }),
    MyRoutes.configure(),
    AnonymousAuth.configure(),
  ],
})
