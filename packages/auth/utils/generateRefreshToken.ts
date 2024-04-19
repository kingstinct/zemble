import { signJwt } from './signJwt'
import plugin from '../plugin'

export const generateRefreshToken = async ({ sub }: { readonly sub: string }) => signJwt({
  data: { },
  expiresInSeconds: plugin.config.refreshTokenExpiryInSeconds,
  sub,
})
