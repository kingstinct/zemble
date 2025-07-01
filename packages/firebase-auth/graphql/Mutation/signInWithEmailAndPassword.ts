import plugin from '@zemble/auth'
import { generateRefreshToken } from '@zemble/auth/utils/generateRefreshToken'
import { setTokenCookies } from '@zemble/auth/utils/setBearerTokenCookie'

import firebaseAdmin from '../../clients/firebase-admin'
import { firebaseAuth } from '../../clients/firebase-client'
import { generateBearerTokenFromFirebaseToken } from '../../utils/generateBearerTokenFromFirebaseToken'

import type { MutationResolvers } from '../schema.generated'

const signInWithEmailAndPassword: MutationResolvers['signInWithEmailAndPassword'] = async (_, { email, password }, { honoContext }) => {
  const credential = await firebaseAuth.signInWithEmailAndPassword(firebaseAuth.getAuth(), email, password)

  const idToken = await firebaseAuth.getIdToken(credential.user)

  const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)

  const bearerToken = await generateBearerTokenFromFirebaseToken(decodedToken)

  const refreshToken = await generateRefreshToken(decodedToken)

  if (plugin.config.cookies.isEnabled) {
    setTokenCookies(honoContext, bearerToken, refreshToken)
  }

  return {
    __typename: 'AuthResponse',
    bearerToken,
    refreshToken,
  }
}

export default signInWithEmailAndPassword
