import { signJwt } from './signJwt'
import plugin from '../plugin'

export const generateRefreshToken = async () => signJwt({
  data: {},
  expiresInSeconds: plugin.config.refreshTokenExpiryInSeconds,
})
