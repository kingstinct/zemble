import authPlugin from '@zemble/auth'
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
  readonly authorizationCode?: string,
  readonly identityToken?: string,
  readonly realUserStatus?: string,
  readonly userUUID?: string,
  readonly fullName?: string,
  readonly state?: string,
}

export const generateBearerTokenFromAppleToken = async (
  jwtContents: AppleJwtContents,
  signUpUserData: AppleUserSignupData | undefined,
) => {
  const bearerToken = await signJwt({
    data: await plugin.config.generateTokenContents(jwtContents, signUpUserData),
    expiresInSeconds: authPlugin.config.bearerTokenExpiryInSeconds,
    sub: jwtContents.sub,
  })

  return bearerToken
}
