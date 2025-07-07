import type { Context } from 'hono'
import { deleteCookie } from 'hono/cookie'
import type { JWTPayload } from 'jose'
import plugin from '../../plugin'
import type { MutationResolvers } from '../schema.generated'

export const logoutFromAllDevices: NonNullable<
  MutationResolvers['logoutFromAllDevices']
> = async (_parent, _arg, { honoContext, decodedToken }) => {
  if (plugin.config.cookies.isEnabled) {
    deleteCookie(
      honoContext as Context,
      plugin.config.cookies.bearerTokenCookieName,
      plugin.config.cookies.opts(0),
    )
  }

  const { sub } = (decodedToken ?? {}) as JWTPayload
  if (sub) {
    await plugin.config.invalidateAllTokens(sub)
  }

  return new Date()
}

export default logoutFromAllDevices
