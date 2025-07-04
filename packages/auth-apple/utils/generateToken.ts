import authPlugin from '@zemble/auth'
import { signJwt } from '@zemble/auth/utils/signJwt'
import type { AppleAuthenticationFullName } from '../graphql/schema.generated'
import plugin from '../plugin'
import { type AppleJwtContents } from './validateIdToken'

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
  readonly authorizationCode?: string
  readonly identityToken?: string
  readonly realUserStatus?: string
  readonly userUUID?: string
  readonly fullName?: string
  readonly state?: string
}

export const generateBearerTokenFromAppleToken = async (
  jwtContents: AppleJwtContents,
  signUpUserData: AppleUserSignupData | undefined,
) => {
  const data = await plugin.config.generateTokenContents(
      jwtContents,
      signUpUserData,
    ),
    sub = 'sub' in data ? (data.sub as string) : jwtContents.sub

  const bearerToken = await signJwt({
    sub,
    data,
    expiresInSeconds: authPlugin.config.bearerTokenExpiryInSeconds,
  })

  return { bearerToken, sub }
}
