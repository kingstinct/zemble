import authPlugin from '@zemble/auth'
import { signJwt } from '@zemble/auth/utils/signJwt'

import plugin from '..'

import type { DecodedIdToken } from 'firebase-admin/auth'

export const generateBearerTokenFromFirebaseToken = async (
  jwtContents: DecodedIdToken,
) => {
  const bearerToken = await signJwt({
    data: await plugin.config.generateTokenContents(jwtContents),
    expiresInSeconds: authPlugin.config.bearerTokenExpiryInSeconds,
    sub: jwtContents.sub,
  })

  return bearerToken
}
