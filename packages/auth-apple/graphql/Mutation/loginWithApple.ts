import { GraphQLError } from 'graphql'
import Auth from 'zemble-plugin-auth'
import { generateRefreshToken } from 'zemble-plugin-auth/utils/generateRefreshToken'
import { setBearerTokenCookie } from 'zemble-plugin-auth/utils/setBearerTokenCookie'

import plugin from '../../plugin'
import { generateBearerTokenFromAppleToken } from '../../utils/generateToken'
import { validateIdToken } from '../../utils/validateIdToken'
import { validateOAuthStateJWT } from '../../utils/validateOAuthStateJWT'

import type {
  MutationResolvers,
} from '../schema.generated'

const loginConfirm: MutationResolvers['loginWithApple'] = async (_, {
  authorizationCode, identityToken, realUserStatus, userUUID, email, fullName, state,
}, { honoContext }) => {
  if (state) {
    const isValid = await validateOAuthStateJWT(state)
    if (!isValid) {
      throw new GraphQLError('[@zemble/auth-apple] Invalid or expired state parameter')
    }
  } else if (plugin.config.enforceStateValidation) {
    throw new GraphQLError('state is required when enforceStateValidation is enabled')
  }

  const idToken = await validateIdToken(identityToken)

  const bearerToken = await generateBearerTokenFromAppleToken(idToken, {
    email: email ?? undefined,
    name: fullName ?? undefined,
    authorizationCode,
    identityToken,
    realUserStatus,
    userUUID,
    state: state ?? undefined,
  })

  if (Auth.config.cookies.isEnabled) {
    setBearerTokenCookie(honoContext, bearerToken)
  }

  return {
    __typename: 'AppleLoginResponse',
    bearerToken,
    refreshToken: await generateRefreshToken(idToken.sub),
  }
}

export default loginConfirm
