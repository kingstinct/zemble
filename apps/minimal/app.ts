import { createApp } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Migrations from '@zemble/migrations'
import dryrunAdapter from '@zemble/migrations/adapters/dryrun'
import Logger from '@zemble/pino'
import Routes from '@zemble/routes'
import Bull from 'zemble-plugin-bull'
import GraphQLLogger from 'zemble-plugin-logger-graphql'

import MyRoutes from './plugins/files/plugin'

export default createApp({
  plugins: [
    Routes.configure(),
    Logger.configure(),
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
