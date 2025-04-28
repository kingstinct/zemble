import { signJwt } from './signJwt'
import plugin from '../plugin'

export const generateRefreshToken = async ({ sub, expiresInSeconds }: { readonly sub: string, readonly expiresInSeconds?: number }) => signJwt({
  data: { },
  expiresInSeconds: expiresInSeconds ?? plugin.config.refreshTokenExpiryInSeconds,
  sub,
})
