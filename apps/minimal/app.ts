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
    GraphQLLogger,
    GraphQL.configure({
      outputMergedSchemaPath: './app.generated.graphql',
    }),
    MyRoutes.configure(),
    Migrations.configure({
      createAdapter: () => dryrunAdapter,
    }),
    Resend.configure({
      RESEND_API_KEY: process.env['RESEND_API_KEY'],
      disable: false,
    }),
    Auth.configure(),
    AuthOtp.configure({
      fromEmail: { email: ' [email protected]' },
      fromSms: 'Zemble',
      smsMessage: 'Your code is {{twoFactorCode}}',
      generateTokenContents: async ({ email: emailRaw, phoneNumber: phoneNumberRaw }) => {
        if (emailRaw) {
          const email = emailRaw.toLowerCase().trim(),
                db = getDbWithTypedCollections(),
                user = await db.users.findOneAndUpdate(
                  { email },
                  {
                    $set: {
                      acceptedTermsAt: new Date(),
                      lastActiveAt: new Date(),
                    },
                    $setOnInsert: {
                      ...userAtTimeOfInsert(
                        email,
                        email,
                      ),
                    },
                  },
                  { upsert: true, returnDocument: 'after' },
                )

          const data: AuthToken = {
            aud: [OAUTH_IDENTIFIER],
            iss: OAUTH_IDENTIFIER,
            email,
            isSuperUser: false,
            sub: user!._id.toHexString(),
            iat: Math.floor(Date.now() / 1000),
            exp: MAX_TOKEN_EXPIRY_IN_SECONDS + Math.floor(Date.now() / 1000),
          }

          return data
        }
        if (phoneNumberRaw) {
          const phoneNumber = phoneNumberRaw.trim(),
                db = getDbWithTypedCollections(),
                user = await db.users.findOneAndUpdate(
                  { phone: phoneNumber },
                  {
                    $set: {
                      acceptedTermsAt: new Date(),
                      lastActiveAt: new Date(),
                    },
                    $setOnInsert: {
                      ...userAtTimeOfInsert(),
                    },
                  },
                  { upsert: true, returnDocument: 'after' },
                )

          const data: AuthToken = {
            aud: [OAUTH_IDENTIFIER],
            iss: OAUTH_IDENTIFIER,
            phoneNumber,
            isSuperUser: false,
            sub: user!._id.toHexString(),
            iat: Math.floor(Date.now() / 1000),
            exp: MAX_TOKEN_EXPIRY_IN_SECONDS + Math.floor(Date.now() / 1000),
          }

          return data
        }

        throw new Error('Either email or phoneNumber must be provided')
      },
    }),
    Twilio.configure({
      TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
      TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
    }),
  ],
})
