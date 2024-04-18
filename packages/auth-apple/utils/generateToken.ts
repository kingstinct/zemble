import { signJwt } from '@zemble/auth/utils/signJwt'

import { type AppleJwtContents } from './validateIdToken'
import plugin from '../plugin'

import type { AppleAuthenticationFullName } from '../graphql/schema.generated'

export type AppleUserSignupDataOnWeb = {
  readonly email?: string
  readonly name?: {
    readonly firstName?: string
    readonly lastName?: string
  }
}

export type AppleUserSignupData = {
  readonly email?: string
  readonly name?: AppleAuthenticationFullName
}

export const generateAccessTokenFromAppleToken = async (
  jwtContents: AppleJwtContents,
  signUpUserData: AppleUserSignupData | undefined,
) => {
  const accessToken = await signJwt({
    data: await plugin.config.generateTokenContents(jwtContents, signUpUserData),
    expiresInSeconds: plugin.config.tokenExpiryInSeconds,
  })

  return accessToken
}
