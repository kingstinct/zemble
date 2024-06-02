import AuthOTP from '@zemble/auth-otp'
import bunRunner from '@zemble/bun'
import zembleContext from '@zemble/core/zembleContext'
import YogaGraphQL from '@zemble/graphql'

import { connect } from './clients/papr'
import { Users } from './models'

import type { BaseToken } from '@zemble/core'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface OtpToken extends BaseToken {
      readonly userId: string,

    }
  }
}

void bunRunner({
  plugins: [
    YogaGraphQL.configure({
      yoga: {
        graphqlEndpoint: '/graphql',
      },
    }),
    AuthOTP.configure({
      fromEmail: { email: 'robert@herber.me' },
      generateTokenContents: async ({ email }) => {
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

        const ret = {
          email,
          type: 'AuthOtp' as const,
          userId: user!._id.toHexString(),
          sub: user!._id.toHexString(),
        }

        return ret
      },
    }),
  ],
})

void connect({ logger: zembleContext.logger })
