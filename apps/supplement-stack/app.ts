import { createApp } from '@readapt/core'
import YogaGraphQL from '@readapt/graphql-yoga'
import { ObjectId } from 'mongodb'
import AuthOTP from 'readapt-plugin-auth-otp'
import './models'

import { connect } from './clients/papr'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
    interface OtpToken {
      readonly userId: ObjectId,
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
      handleAuthRequest: (email, code) => { console.log('handleAuthRequest', code) },
      generateTokenContents: (email): Readapt.OtpToken => {
        // todo: get user id from email
        const ret = ({ email, type: 'AuthOtp' as const, userId: new ObjectId() })
        return ret
      },
    }),
  ],
})

void connect()

void app.then(({ start }) => {
  start()
})
