import plugin from '../plugin'
import { signJwt } from './signJwt'

export const generateRefreshToken = async ({
  sub,
  expiresInSeconds,
}: {
  readonly sub: string
  readonly expiresInSeconds?: number
}) =>
  signJwt({
    data: {},
    expiresInSeconds:
      expiresInSeconds ?? plugin.config.refreshTokenExpiryInSeconds,
    sub,
  })
