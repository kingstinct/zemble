/* eslint-disable @typescript-eslint/no-namespace */
import authPlugin from '@zemble/auth'
import { encodeToken } from '@zemble/auth/utils/encodeToken'
import {
  setCookie,
} from 'hono/cookie'

import type { MutationResolvers } from '../schema.generated'

const login: MutationResolvers['login'] = async (_: unknown, { username }, { honoContext }) => {
  const userId = Math.random().toString(36).substring(7)
  const token = await encodeToken({ userId, username, type: 'AnonymousAuth' })

  if (authPlugin.config.cookies.isEnabled) {
    setCookie(honoContext, authPlugin.config.cookies.name, token, authPlugin.config.cookies.opts())
  }

  return { token }
}

export default login
