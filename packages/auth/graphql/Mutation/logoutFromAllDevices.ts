import { deleteCookie } from 'hono/cookie'

import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'
import type { Context } from 'hono'
import type { JWTPayload } from 'jose'

export const logoutFromAllDevices: NonNullable<MutationResolvers['logoutFromAllDevices']> = async (_parent, _arg, { honoContext, decodedToken }) => {
  if (plugin.config.cookies.isEnabled) {
    deleteCookie(honoContext as Context, plugin.config.cookies.bearerTokenCookieName, plugin.config.cookies.opts(0))
  }

  const { sub } = (decodedToken ?? {}) as JWTPayload
  if (sub) {
    plugin.config.invalidateAllTokens(sub)
  }

  return new Date()
}

export default logoutFromAllDevices
