import Auth from '@zemble/auth'
import { generateRefreshToken } from '@zemble/auth/utils/generateRefreshToken'
import { setTokenCookies } from '@zemble/auth/utils/setBearerTokenCookie'
import { GraphQLError } from 'graphql'

import plugin from '../../plugin'
import { generateBearerTokenFromAppleToken } from '../../utils/generateToken'
import { validateIdToken } from '../../utils/validateIdToken'
import { validateOAuthStateJWT } from '../../utils/validateOAuthStateJWT'

import type { MutationResolvers } from '../schema.generated'

export const loginWithApple: NonNullable<MutationResolvers['loginWithApple']> = async (_, { authorizationCode, identityToken, realUserStatus, userUUID, email, fullName, state }, { honoContext }) => {
  if (state) {
    const isValid = await validateOAuthStateJWT(state)
    if (!isValid) {
      throw new GraphQLError('[@zemble/auth-apple] Invalid or expired state parameter')
    }
  } else if (plugin.config.enforceStateValidation) {
    throw new GraphQLError('state is required when enforceStateValidation is enabled')
  }

  const idToken = await validateIdToken(identityToken)

  const { bearerToken, sub } = await generateBearerTokenFromAppleToken(idToken, {
    email: email ?? undefined,
    name: fullName ?? undefined,
    authorizationCode,
    identityToken,
    realUserStatus,
    userUUID,
    state: state ?? undefined,
  })

  const refreshToken = await generateRefreshToken({ sub })

  if (Auth.config.cookies.isEnabled) {
    setTokenCookies(honoContext, bearerToken, refreshToken)
  }

  return {
    __typename: 'AppleLoginResponse',
    bearerToken,
    refreshToken,
  }
}

export default loginWithApple
