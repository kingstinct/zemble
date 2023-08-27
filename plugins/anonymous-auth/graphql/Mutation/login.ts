/* eslint-disable @typescript-eslint/no-namespace */
import {
  setCookie,
} from 'hono/cookie'
import { encodeToken } from 'readapt-plugin-auth/utils/isValid'

import { config } from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

declare global {
  namespace Readapt {
    interface TokenContents {
      readonly userId: string,
      readonly username: string
    }
  }
}

const login: MutationResolvers['login'] = (_: unknown, { username }, { honoContext }) => {
  const userId = Math.random().toString(36).substring(7)
  const token = encodeToken({ userId, username })

  if (config.cookies.isEnabled) {
    setCookie(honoContext, config.cookies.name, token, config.cookies.opts())
  }

  return { token }
}

export default login
