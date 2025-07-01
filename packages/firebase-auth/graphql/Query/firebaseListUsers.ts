import firebaseAdmin from '../../clients/firebase-admin'

import type { QueryResolvers } from '../schema.generated'

const hello: QueryResolvers['firebaseListUsers'] = async (_, { maxResults, pageToken }) => {
  const allUsers = await firebaseAdmin.auth().listUsers(maxResults ?? undefined, pageToken ?? undefined)

  return allUsers.users
}

export default hello
