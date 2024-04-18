import { signJwt } from './signJwt'
import plugin from '../plugin'

export const generateRefreshToken = async (sub: string) => signJwt({
  data: { },
  expiresInSeconds: plugin.config.refreshTokenExpiryInSeconds,
  sub,
})
