import { setCookie } from 'hono/cookie'

import plugin from '../plugin'

import type { Context } from 'hono'

export const setBearerTokenCookie = (honoContext: Context, bearerToken: string) => {
  setCookie(
    honoContext,
    plugin.config.cookies.bearerTokenCookieName,
    bearerToken,
    plugin.config.cookies.opts(
      plugin.config.bearerTokenExpiryInSeconds * 1000,
    ),
  )
}
