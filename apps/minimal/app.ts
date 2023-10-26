import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Migrations from '@zemble/migrations'
import dryrunAdapter from '@zemble/migrations/adapters/dryrun'
import Routes from '@zemble/routes'
import Auth from 'zemble-plugin-auth'

import MyRoutes from './plugins/files/plugin'

export default createApp({
  plugins: [
    Routes.configure(),
    GraphQL.configure({ sofa: { basePath: '/api' } }),
    MyRoutes.configure(),
    Auth.configure(),
    Migrations.configure({
      createAdapter: () => dryrunAdapter,
    }),
  ],
})
