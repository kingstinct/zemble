import plugin from '../../plugin'
import { generateOAuthStateJWT } from '../../utils/generateOAuthStateJWT'

import type { Context } from 'hono'

export default async (ctx: Context) => {
  const scope = 'email name'
  const state = await generateOAuthStateJWT()

  const { APPLE_CLIENT_ID, INTERNAL_URL } = plugin.config

  const redirectUri = `${INTERNAL_URL}/auth/apple/callback`

  if (!APPLE_CLIENT_ID) {
    return ctx.json({
      error: 'APPLE_CLIENT_ID needs to be set for Apple OAuth flow to work.',
    }, 500)
  }

  const authorizationUri = `https://appleid.apple.com/auth/authorize?response_type=code id_token&client_id=${APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&response_mode=form_post`

  return ctx.redirect(authorizationUri)
}
