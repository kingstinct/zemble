import Auth from '@zemble/auth'
import AuthOtp from '@zemble/auth-otp'
import Bull from '@zemble/bull'
import { createApp } from '@zemble/core'
import Resend from '@zemble/email-resend'
import GraphQL from '@zemble/graphql'
import GraphQLLogger from '@zemble/logger-graphql'
import Migrations from '@zemble/migrations'
import dryrunAdapter from '@zemble/migrations/adapters/dryrun'
import Logger from '@zemble/pino'
import Routes from '@zemble/routes'
import Elks from '@zemble/sms-46elks'
import Twilio from '@zemble/sms-twilio'

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
    // Twilio.configure({
    //   TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
    //   TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
    // }),
    Elks.configure({
      ELKS_USERNAME: process.env['ELKS_USERNAME'],
      ELKS_PASSWORD: process.env['ELKS_PASSWORD'],
      disable: false,
      options: {
        dryrun: 'yes',
      },
    }),
    AuthOtp.configure({
      fromSms: 'Ryan Iguchi',
      fromEmail: {
        email: 'info@getlifeline.app',
        name: 'Ryan Iguchi',
      },
      smsMessage: 'Your two factor code is {{twoFactorCode}}',
      WHITELISTED_COUNTRY_CODES: ['SE'],
    }),
    GraphQLLogger,
    GraphQL.configure({
      outputMergedSchemaPath: './app.generated.graphql',
    }),
    MyRoutes.configure(),
    Migrations.configure({
      createAdapter: () => dryrunAdapter,
    }),
    Resend.configure({
      RESEND_API_KEY: 're_V3Znff2Z_C8jWM3NRxR4ERVc6xnFA7bxZ',
      disable: false,
    }),
    Auth.configure({
      PUBLIC_KEY: process.env['PUBLIC_KEY'],
      PRIVATE_KEY: process.env['PRIVATE_KEY'],
    }),
  ],
})
