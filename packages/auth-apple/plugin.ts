/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Routes from '@zemble/routes'
import Auth from 'zemble-plugin-auth'

import type { AppleUserSignupData } from './utils/generateToken'
import type { AppleJwtContents } from './utils/validateIdToken'

interface AppleAuthConfig extends Zemble.GlobalConfig {
  readonly tokenExpiryInSeconds?: number
  readonly PRIVATE_KEY?: string;
  readonly generateTokenContents: (jwtContents: AppleJwtContents, signUpUserData: AppleUserSignupData | undefined) => Promise<Zemble.AppleToken> | Zemble.AppleToken
  readonly AUTH_LOGIN_REDIRECT_URL?: string
  readonly AUTH_LOGGED_IN_REDIRECT_URL?: string
  readonly INTERNAL_URL: string
  readonly APPLE_CLIENT_ID?: string
  readonly PUBLIC_KEY?: string
  readonly skipEmailVerificationRequired?: boolean
}

export interface DefaultAppleToken {
  readonly type: 'AuthApple',
  readonly appleUserId: string
  readonly email?: string
}

declare global {
  namespace Zemble {
    interface AppleToken extends DefaultAppleToken {

    }

    interface TokenRegistry {
      readonly AuthApple: AppleToken
    }
  }
}

function generateTokenContents(jwtContents: AppleJwtContents): Zemble.AppleToken {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  return {
    type: 'AuthApple' as const,
    appleUserId: jwtContents.sub,
    email: jwtContents.email,
  }
}

const defaultConfig = {
  tokenExpiryInSeconds: undefined,
  generateTokenContents,
  AUTH_LOGGED_IN_REDIRECT_URL: process.env.AUTH_LOGGED_IN_REDIRECT_URL ?? '/',
  AUTH_LOGIN_REDIRECT_URL: process.env.AUTH_LOGIN_REDIRECT_URL ?? '/login',
  INTERNAL_URL: process.env.INTERNAL_URL ?? 'http://localhost:3000',
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  PUBLIC_KEY: process.env.PUBLIC_KEY,
} satisfies AppleAuthConfig

const plugin = new Plugin<AppleAuthConfig, typeof defaultConfig>(import.meta.dir, {
  dependencies: [
    {
      plugin: Auth,
    },
    {
      plugin: GraphQL,
    },
    {
      plugin: Routes,
    },
  ],
  defaultConfig,
  additionalConfigWhenRunningLocally: {
    generateTokenContents,
  },
})

export default plugin
