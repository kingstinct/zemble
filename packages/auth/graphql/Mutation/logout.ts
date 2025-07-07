import type { Context } from 'hono'
import { deleteCookie } from 'hono/cookie'
import type { JWTPayload } from 'jose'
import plugin from '../../plugin'
import type { MutationResolvers } from '../schema.generated'

export const logout: NonNullable<MutationResolvers['logout']> = async (
  _,
  __,
  { honoContext, token, decodedToken },
) => {
  if (plugin.config.cookies.isEnabled) {
    deleteCookie(
      honoContext as Context,
      plugin.config.cookies.bearerTokenCookieName,
      plugin.config.cookies.opts(0),
    )
  }

  const { sub } = (decodedToken ?? {}) as JWTPayload
  if (sub && token) {
    await plugin.config.invalidateToken(sub, token)
  }

  return new Date()
}

export default logout
