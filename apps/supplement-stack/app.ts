import { createApp } from '@readapt/core'
import YogaGraphQL from '@readapt/graphql-yoga'
import AuthOTP from 'readapt-plugin-auth-otp'

import { connect } from './clients/papr'
import { Users } from './models'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
    interface OtpToken {
      readonly userId: string,
    }
  }
}

const app = createApp({
  plugins: [
    YogaGraphQL.configure({
      yoga: {
        graphqlEndpoint: '/graphql',
      },
    }),
    AuthOTP.configure({
      from: { email: 'robert@herber.me' },
      generateTokenContents: async (email): Promise<Readapt.OtpToken> => {
        const user = await Users.findOneAndUpdate({ email }, {
          $set: {
            lastLoginAt: new Date(),
          },
          $setOnInsert: {
            firstLoginAt: new Date(),
            email,
          },
        }, {
          upsert: true,
          returnDocument: 'after',
        })

        const ret = ({ email, type: 'AuthOtp' as const, userId: user!._id.toHexString() })

        return ret
      },
    }),
  ],
})

void connect()

void app.then(({ start }) => {
  start()
})
