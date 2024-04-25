import { generateRefreshToken } from '@zemble/auth/utils/generateRefreshToken'

import firebaseAdmin from '../../clients/firebase-admin'
import { firebaseAuth } from '../../clients/firebase-client'
import { generateBearerTokenFromFirebaseToken } from '../../utils/generateBearerTokenFromFirebaseToken'

import type { MutationResolvers } from '../schema.generated'

const signInWithEmailAndPassword: MutationResolvers['signInWithEmailAndPassword'] = async (_, { email, password }, { honoContext }) => {
  const credential = await firebaseAuth.signInWithEmailAndPassword(
    firebaseAuth.getAuth(),
    email,
    password,
  )

  const idToken = await firebaseAuth.getIdToken(credential.user)

  const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken)

  const token = await generateBearerTokenFromFirebaseToken(decodedToken)

  return {
    __typename: 'AuthResponse',
    bearerToken: token,
    refreshToken: await generateRefreshToken(decodedToken),
  }
}

export default signInWithEmailAndPassword
