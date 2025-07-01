import type { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import plugin from '../plugin'

export const setTokenCookies = (honoContext: Context, bearerToken: string, refreshToken: string) => {
  setCookie(honoContext, plugin.config.cookies.bearerTokenCookieName, bearerToken, plugin.config.cookies.opts(plugin.config.bearerTokenExpiryInSeconds * 1000))

  setCookie(honoContext, plugin.config.cookies.refreshTokenCookieName, refreshToken, plugin.config.cookies.opts(plugin.config.refreshTokenExpiryInSeconds * 1000))
}
