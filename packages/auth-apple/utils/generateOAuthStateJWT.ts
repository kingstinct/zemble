import { signJwt } from '@zemble/auth/utils/signJwt'

import plugin from '../plugin'

export const generateOAuthStateJWT = async () => signJwt({
  data: {},
  expiresInSeconds: 60 * 60 * 1, // 1 hour
  privateKey: plugin.config.PRIVATE_KEY,
  sub: 'apple-oauth-state',
})
