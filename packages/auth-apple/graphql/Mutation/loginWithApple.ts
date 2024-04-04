import { setCookie } from 'hono/cookie'
import Auth from 'zemble-plugin-auth'

import { generateAccessTokenFromAppleToken } from '../../utils/generateToken'
import { validateIdToken } from '../../utils/validateIdToken'

import type {
  MutationResolvers,
} from '../schema.generated'

const loginConfirm: MutationResolvers['loginWithApple'] = async (_, {
  authorizationCode, identityToken, realUserStatus, userUUID, email, fullName, state,
}, { honoContext }) => {
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
