import firebaseAdmin from 'firebase-admin'

import plugin from '../plugin'

if (!plugin.config.FIREBASE_ADMIN_SERVICE_ACCOUNT) {
  throw new Error('FIREBASE_ADMIN_SERVICE_ACCOUNT is required')
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(plugin.config.FIREBASE_ADMIN_SERVICE_ACCOUNT),
})

export default firebaseAdmin
