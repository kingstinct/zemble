import { GraphQLError } from 'graphql'
import * as jose from 'jose'
import { JOSEError, JWTExpired } from 'jose/errors'

import plugin from '../plugin'

const JWKS = jose.createRemoteJWKSet(new URL('https://appleid.apple.com/auth/keys'))

export interface AppleJwtContents {
  readonly iss: string
  readonly aud: string
  readonly exp: number
  readonly iat: number
  readonly sub: string
  readonly c_hash: string
  readonly email: string
  readonly email_verified: boolean
  readonly auth_time: number
  readonly nonce_supported: boolean
}

export const validateIdToken = async (idToken: string) => {
  try {
    const { payload } = await jose.jwtVerify<AppleJwtContents>(idToken, JWKS, {})

    if (!payload.email_verified && !plugin.config.skipEmailVerificationRequired) {
      throw new GraphQLError('[@zemble/auth-apple] User email not verified, either set skipEmailVerificationRequired to true or verify the email with Apple.')
    }

    return payload
  } catch (error) {
    if (error instanceof JWTExpired) {
      throw new GraphQLError('[@zemble/auth-apple] Error validating Apple ID token, the token has expired')
    }
    if (error instanceof JOSEError) {
      throw new GraphQLError('[@zemble/auth-apple] Error validating Apple ID token, the token is probably not valid')
    }
    throw error
  }
}
