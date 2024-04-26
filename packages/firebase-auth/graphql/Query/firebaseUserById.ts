import firebaseAdmin from '../../clients/firebase-admin'

import type { QueryResolvers } from '../schema.generated'

const hello: QueryResolvers['firebaseUserById'] = async (_, { uid }) => {
  const user = await firebaseAdmin.auth().getUser(uid)

  return user
}

export default hello
