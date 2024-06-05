// import Auth from '@zemble/auth'
// import AuthOtp from '@zemble/auth-otp'
import Bull from '@zemble/bull'
import { createApp } from '@zemble/core'
// import Resend from '@zemble/email-resend'
import GraphQL from '@zemble/graphql'
import GraphQLLogger from '@zemble/logger-graphql'
import Migrations from '@zemble/migrations'
import dryrunAdapter from '@zemble/migrations/adapters/dryrun'
import Logger from '@zemble/pino'
import Routes from '@zemble/routes'
// import Twilio from '@zemble/sms-twilio'

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
    // Resend.configure({
    //   RESEND_API_KEY: process.env['RESEND_API_KEY'],
    //   disable: false,
    // }),
    // Twilio.configure({
    //   TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
    //   TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
    // }),
  ],
})
