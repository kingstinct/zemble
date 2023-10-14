import { createApp } from '@zemble/core'
import YogaGraphQL from '@zemble/graphql'
import AuthOTP from 'zemble-plugin-auth-otp'

import { connect } from './clients/papr'
import { Users } from './models'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
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
      generateTokenContents: async (email): Promise<Zemble.OtpToken> => {
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

        const ret = ({
          email,
          type: 'AuthOtp' as const,
          userId: user!._id.toHexString(),
        })

        return ret
      },
    }),
  ],
})

void connect()

void app.then(({ start }) => {
  start()
})
