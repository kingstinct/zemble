/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import kv from '@zemble/kv'
import { parseEnvJSON } from '@zemble/utils/node/parseEnv'

import { simpleTemplating } from './utils/simpleTemplating'

import type { IEmail } from '@zemble/core'

interface OtpAuthConfig extends Zemble.GlobalConfig {
  readonly twoFactorCodeExpiryInSeconds?: number
  readonly minTimeBetweenTwoFactorCodeRequestsInSeconds?: number
  readonly WHITELISTED_SIGNUP_EMAILS?: readonly string[]
  readonly WHITELISTED_SIGNUP_EMAIL_DOMAINS?: readonly string[]
  readonly from: IEmail
  /*
   * Write {{email}}, {{name}} and {{twoFactorCode}} to have them replaced with the
   * email, name and two factor code.
    */
  readonly emailSubject?: string
  /*
   * Write {{email}}, {{name}} and {{twoFactorCode}} to have them replaced with the
   * email, name and two factor code.
    */
  readonly emailText?: string
  /*
   * Write {{email}}, {{name}} and {{twoFactorCode}} to have them replaced with the
   * email, name and two factor code.
    */
  readonly emailHtml?: string
  readonly handleAuthRequest?: (email: IEmail, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly generateTokenContents: ({ email }: {readonly email: string}) => Promise<Zemble.OtpToken> | Zemble.OtpToken
}

export interface DefaultOtpToken {
  // readonly type: 'AuthOtp',
  readonly email: string,
  readonly sub: string
}

declare global {
  namespace Zemble {
    interface OtpToken extends DefaultOtpToken {

    }

    interface TokenRegistry {
      readonly AuthOtp: OtpToken
    }
  }
}

function generateTokenContents({ email }: {readonly email: string}): Zemble.OtpToken {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - this is a default implementation
  return { email, type: 'AuthOtp' as const }
}

const defaultConfig = {
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
  generateTokenContents,
  WHITELISTED_SIGNUP_EMAIL_DOMAINS: parseEnvJSON('WHITELISTED_SIGNUP_EMAIL_DOMAINS', undefined),
  WHITELISTED_SIGNUP_EMAILS: parseEnvJSON('WHITELISTED_SIGNUP_EMAILS', undefined),
  handleAuthRequest: async (to, twoFactorCode) => {
    const { sendEmail } = plugin.providers
    if (sendEmail && !['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
      void sendEmail({
        from: plugin.config.from,
        subject: plugin.config.emailSubject ? simpleTemplating(plugin.config.emailSubject, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : 'Login',
        text: plugin.config.emailText ? simpleTemplating(plugin.config.emailText, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : `Your two factor code is ${twoFactorCode}`,
        html: plugin.config.emailHtml ? simpleTemplating(plugin.config.emailHtml, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : `Your two factor code is <b>${twoFactorCode}</b>`,
        to,
      })
    }
    if (process.env.NODE_ENV === 'development') {
      plugin.providers.logger.info(`Generated code for ${to.email}: ${twoFactorCode}`)
    }
  },
} satisfies Partial<OtpAuthConfig>

/**
 * This plugin allows you to easily add two factor authentication over email to your app. Implement
 * `generateTokenContents` to modify the contents of the token that is sent to the user (and other things, like logging
 * that the user logged in in the database). Modify the email configurations to customize the
 * contents of the email sent. Whichever email provider is implemented is used.
 */
const plugin = new Plugin<OtpAuthConfig, typeof defaultConfig>(import.meta.dir, {
  dependencies: [
    {
      plugin: Auth,
    },
    {
      plugin: GraphQL,
    },
    {
      plugin: kv,
    },
  ],
  defaultConfig,
  additionalConfigWhenRunningLocally: {
    handleAuthRequest: ({ email }, code, { logger }) => { logger.info(`handleAuthRequest for ${email}`, code) },
    generateTokenContents,
    from: { email: 'noreply@zemble.com' },
  },
})

export default plugin
