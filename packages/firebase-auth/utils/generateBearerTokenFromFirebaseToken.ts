import authPlugin from '@zemble/auth'
import { signJwt } from '@zemble/auth/utils/signJwt'
import type { DecodedIdToken } from 'firebase-admin/auth'
import plugin from '..'

export const generateBearerTokenFromFirebaseToken = async (jwtContents: DecodedIdToken) => {
  const bearerToken = await signJwt({
    data: await plugin.config.generateTokenContents(jwtContents),
    expiresInSeconds: authPlugin.config.bearerTokenExpiryInSeconds,
    sub: jwtContents.sub,
  })

  return bearerToken
}
