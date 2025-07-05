import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import { parseEnvJSON } from '@zemble/utils/node/parseEnv'
import type { DecodedIdToken } from 'firebase-admin/auth'
import type firebaseAdmin from './clients/firebase-admin'
import type { firebaseClient } from './clients/firebase-client'

interface PluginConfig extends Zemble.GlobalConfig {
  readonly generateTokenContents: (
    idTokenContents: DecodedIdToken,
  ) => Promise<Zemble.FirebaseToken> | Zemble.FirebaseToken
  readonly FIREBASE_CLIENT_CONFIG?: firebaseClient.FirebaseOptions
  readonly FIREBASE_ADMIN_SERVICE_ACCOUNT?: firebaseAdmin.ServiceAccount
}

export interface DefaultFirebaseToken {
  readonly type: '@zemble/auth-firebase'
  // readonly appleUserId: string
  readonly email?: string
}

declare global {
  namespace Zemble {
    // @ts-ignore could maybe be improved
    interface FirebaseToken extends DefaultFirebaseToken {}

    interface TokenRegistry {
      readonly AuthFirebase: FirebaseToken
    }
  }
}

const defaultConfig = {
  FIREBASE_ADMIN_SERVICE_ACCOUNT: process.env['FIREBASE_ADMIN_SERVICE_ACCOUNT']
    ? parseEnvJSON<firebaseAdmin.ServiceAccount>(
        'FIREBASE_ADMIN_SERVICE_ACCOUNT',
        undefined,
      )
    : undefined,
  FIREBASE_CLIENT_CONFIG: process.env['FIREBASE_CLIENT_CONFIG']
    ? parseEnvJSON<firebaseClient.FirebaseOptions>(
        'FIREBASE_CLIENT_CONFIG',
        undefined,
      )
    : undefined,
  generateTokenContents: (args) => ({ type: '@zemble/auth-firebase', ...args }),
} satisfies Partial<PluginConfig>

export default new Plugin<PluginConfig, typeof defaultConfig>(import.meta.dir, {
  dependencies: [{ plugin: GraphQL }, { plugin: Auth }, { plugin: Routes }],
  defaultConfig,
})
