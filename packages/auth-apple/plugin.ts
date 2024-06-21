/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import path from 'node:path'

import { generateOAuthStateJWT } from './utils/generateOAuthStateJWT'
import { generateBearerTokenFromAppleToken, type AppleUserSignupData, type AppleUserSignupDataOnWeb } from './utils/generateToken'
import { validateIdToken, type AppleJwtContents } from './utils/validateIdToken'
import { validateOAuthStateJWT } from './utils/validateOAuthStateJWT'

interface AppleAuthConfig extends Zemble.GlobalConfig {
  readonly PRIVATE_KEY?: string;
  readonly generateTokenContents: (jwtContents: AppleJwtContents, signUpUserData: AppleUserSignupData | undefined) => Promise<Zemble.AppleToken> | Zemble.AppleToken
  readonly UNAUTHENTICATED_REDIRECT_URL?: string
  readonly AUTHENTICATED_REDIRECT_URL?: string
  readonly INTERNAL_URL?: string
  readonly APPLE_CLIENT_ID?: string
  readonly PUBLIC_KEY?: string
  readonly skipEmailVerificationRequired?: boolean
  readonly enforceStateValidation?: boolean
  readonly appleAuthInitializePath?: string
  readonly appleAuthCallbackPath?: string
}

export interface DefaultAppleToken {
  readonly type: '@zemble/auth-apple',
  readonly appleUserId: string
  readonly email?: string
}

declare global {
  namespace Zemble {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore could maybe be improved
    interface AppleToken extends DefaultAppleToken {

    }

    interface TokenRegistry {
      readonly AuthApple: AppleToken
    }
  }
}

function generateTokenContents(jwtContents: AppleJwtContents): Zemble.AppleToken {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - this is a default implementation
  return {
    type: '@zemble/auth-apple',
    appleUserId: jwtContents.sub,
    email: jwtContents.email,
  }
}

const defaultConfig = {
  generateTokenContents,
  AUTHENTICATED_REDIRECT_URL: process.env['AUTH_LOGGED_IN_REDIRECT_URL'] ?? '/',
  UNAUTHENTICATED_REDIRECT_URL: process.env['AUTH_LOGIN_REDIRECT_URL'] ?? '/login',
  INTERNAL_URL: process.env['INTERNAL_URL'] ?? 'http://localhost:3000',
  APPLE_CLIENT_ID: process.env['APPLE_CLIENT_ID'],
  PRIVATE_KEY: process.env['PRIVATE_KEY'],
  PUBLIC_KEY: process.env['PUBLIC_KEY'],
  appleAuthInitializePath: '/auth/apple',
  appleAuthCallbackPath: '/auth/apple/callback',
} satisfies AppleAuthConfig

const plugin = new Plugin<AppleAuthConfig, typeof defaultConfig>(import.meta.dir, {
  dependencies: [
    {
      plugin: Auth,
    },
    {
      plugin: GraphQL,
    },
  ],
  defaultConfig,
  middleware: async ({ app, config, self }) => {
    app.hono.get(config.appleAuthInitializePath, async (ctx) => {
      const scope = 'email name',
            state = await generateOAuthStateJWT(),
            {
              APPLE_CLIENT_ID, INTERNAL_URL, appleAuthCallbackPath,
            } = config,
            redirectUri = path.join(INTERNAL_URL, appleAuthCallbackPath)

      if (!APPLE_CLIENT_ID) {
        return ctx.json({
          error: 'APPLE_CLIENT_ID needs to be set for Apple OAuth flow to work.',
        }, 500)
      }

      const authorizationUri = `https://appleid.apple.com/auth/authorize?response_type=code id_token&client_id=${APPLE_CLIENT_ID}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&response_mode=form_post`

      return ctx.redirect(authorizationUri)
    })

    app.hono.post(config.appleAuthCallbackPath, async (ctx) => {
      const formData = await ctx.req.formData(),
            idToken = formData.get('id_token')?.toString(),
            user = formData.get('user')?.toString(),
            state = formData.get('state')?.toString(),
            {
              UNAUTHENTICATED_REDIRECT_URL,
              AUTHENTICATED_REDIRECT_URL,
            } = config

      if (state) {
        const isValid = await validateOAuthStateJWT(state)
        if (!isValid) {
          self.providers.logger.error('state is invalid or expired')
          return ctx.redirect(UNAUTHENTICATED_REDIRECT_URL)
        }
      } else if (config.enforceStateValidation) {
        self.providers.logger.error('state is not present in formdata from Apple')
        return ctx.redirect(UNAUTHENTICATED_REDIRECT_URL)
      }

      if (!idToken) {
        self.providers.logger.error('No id_token found in formdata from Apple')
        return ctx.redirect(UNAUTHENTICATED_REDIRECT_URL)
      }

      try {
        const decoded = await validateIdToken(idToken)
        const userDataOnWeb = user ? JSON.parse(user) as AppleUserSignupDataOnWeb : undefined
        const userData: AppleUserSignupData | undefined = userDataOnWeb ? {
          email: userDataOnWeb.email,
          name: userDataOnWeb.name ? {
            givenName: userDataOnWeb.name.firstName,
            familyName: userDataOnWeb.name.lastName,
          } : undefined,
        } : undefined

        const bearerToken = await generateBearerTokenFromAppleToken(decoded, userData)

        // handle token

        // Code to handle user authentication and retrieval using the decoded information

        return ctx.redirect(`${AUTHENTICATED_REDIRECT_URL}?bearerToken=${bearerToken}`)
      } catch (error) {
        if (error instanceof Error) {
          self.providers.logger.error('Error:', error.message)
        } else {
          self.providers.logger.error('Error:', error)
        }

        return ctx.redirect(UNAUTHENTICATED_REDIRECT_URL)
      }
    })
  },
  additionalConfigWhenRunningLocally: {
    generateTokenContents,
  },
})

export default plugin
