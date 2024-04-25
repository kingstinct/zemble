import * as firebaseClient from 'firebase/app'
import * as firebaseAuth from 'firebase/auth'

import plugin from '../plugin'

if (!plugin.config.FIREBASE_CLIENT_CONFIG) {
  throw new Error('FIREBASE_CLIENT_CONFIG is required')
}

firebaseClient.initializeApp(plugin.config.FIREBASE_CLIENT_CONFIG)

export {
  firebaseAuth,
  firebaseClient,
}
