import { deleteCookie } from 'hono/cookie'

import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'
import type { Context } from 'hono'

const logout: MutationResolvers['logoutFromAllDevices'] = async (_, __, { honoContext }) => {
  if (plugin.config.cookies.isEnabled) {
    deleteCookie(honoContext as Context, plugin.config.cookies.bearerTokenCookieName, plugin.config.cookies.opts(0))
  }

  return new Date()
}

export default logout
