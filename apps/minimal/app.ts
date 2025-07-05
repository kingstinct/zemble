import Bull from '@zemble/bull'
import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import GraphQLLogger from '@zemble/logger-graphql'
import Migrations from '@zemble/migrations'
import dryrunAdapter from '@zemble/migrations/adapters/dryrun'
import Routes from '@zemble/routes'

import MyRoutes from './plugins/files/plugin'

export default createApp({
  plugins: [
    Routes.configure(),
    Bull.configure({
      bullboard: {
        nodeModulesRootPath: '../..',
      },
    }),
    GraphQLLogger,
    GraphQL.configure({
      outputMergedSchemaPath: './app.generated.graphql',
    }),
    MyRoutes.configure(),
    Migrations.configure({
      createAdapter: () => dryrunAdapter,
    }),
  ],
})
