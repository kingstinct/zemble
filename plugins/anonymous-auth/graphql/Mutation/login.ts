/* eslint-disable @typescript-eslint/no-namespace */
import {
  setCookie,
} from 'hono/cookie'
import { encodeToken } from 'readapt-plugin-auth/utils/isValid'

import type { MutationResolvers } from '../schema.generated'

declare global {
  namespace Readapt {
    interface TokenContents {
      readonly userId: string,
      readonly username: string
    }
  }
}

const login: MutationResolvers['login'] = (_: unknown, { username }, { honoContext, config }) => {
  const userId = Math.random().toString(36).substring(7)
  const token = encodeToken({ userId, username })

  if (config['readapt-plugin-anonymous-auth'].enableCookieAuth && config['readapt-plugin-anonymous-auth'].cookieName) {
    setCookie(honoContext, config['readapt-plugin-anonymous-auth'].cookieName, token, {
      sameSite: 'Lax',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      // domain: 'localhost:3000',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2), // 2 days
    })
  }

  return { token }
}

export default login
