import Auth from '@zemble/auth'
import { GraphQLError } from 'graphql'
import { setCookie } from 'hono/cookie'

import plugin from '../../plugin'
import { generateAccessTokenFromAppleToken } from '../../utils/generateToken'
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

  const accessToken = await generateAccessTokenFromAppleToken(idToken, {
    email: email ?? undefined,
    name: fullName ?? undefined,
  })

  if (Auth.config.cookies.isEnabled) {
    setCookie(honoContext, Auth.config.cookies.name, accessToken, Auth.config.cookies.opts())
  }

  return { accessToken, __typename: 'AppleLoginResponse' }
}

export default loginConfirm
