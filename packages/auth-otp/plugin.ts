/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import kv from '@zemble/kv'
import { parseEnvJSON } from '@zemble/utils/node/parseEnv'
import { type CountryCode } from 'libphonenumber-js'

import { simpleTemplating } from './utils/simpleTemplating'

import type { E164PhoneNumber } from './utils/types'
import type { IEmail, TokenContents } from '@zemble/core'

interface OtpAuthConfig extends Zemble.GlobalConfig {
  readonly twoFactorCodeExpiryInSeconds?: number
  readonly minTimeBetweenTwoFactorCodeRequestsInSeconds?: number

  // EMAIL
  readonly WHITELISTED_SIGNUP_EMAILS?: readonly string[]
  readonly WHITELISTED_SIGNUP_EMAIL_DOMAINS?: readonly string[]
  readonly fromEmail?: IEmail

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

  // SMS

  /*
    * The name that the SMS will appear to be sent from.
    * Should be a E.164 formatted phone number (e.g. +14155552671) or a string (company name).
  */
  readonly fromSms?: string
  /*
   * Write {{twoFactorCode}} to have them replaced with the
   * email, name and two factor code.
    */
  readonly smsMessage?: string
  /*
    * A list of two-letter country codes in ISO alpha-2 format that are allowed to receive SMS messages.
    * If this is not set, all country codes are allowed.
  */
  readonly WHITELISTED_COUNTRY_CODES?: readonly CountryCode[]

  readonly handleEmailAuthRequest?: (email: IEmail, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly handleSmsAuthRequest?: (phoneNum: E164PhoneNumber, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly generateTokenContents: ({ email, phoneNumber, decodedToken }: GenerateTokenContentArgs) => Promise<Omit<Zemble.OtpToken, 'iat'>> | Omit<Zemble.OtpToken, 'iat'>
}

export interface DefaultOtpToken {
  readonly type: 'AuthOtp',
  readonly email?: string,
  readonly phoneNumber?: string,
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

type GenerateTokenContentArgs = ({readonly email?: string, readonly phoneNumber?: string, readonly decodedToken?: TokenContents})

function generateTokenContents({ email, phoneNumber }: GenerateTokenContentArgs): Zemble.OtpToken {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - this is a default implementation
  return {
    email, phoneNumber, type: 'AuthOtp',
  }
}

const defaultConfig = {
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
  generateTokenContents,
  WHITELISTED_SIGNUP_EMAIL_DOMAINS: parseEnvJSON('WHITELISTED_SIGNUP_EMAIL_DOMAINS', undefined),
  WHITELISTED_SIGNUP_EMAILS: parseEnvJSON('WHITELISTED_SIGNUP_EMAILS', undefined),
  handleEmailAuthRequest: async (to, twoFactorCode) => {
    const { sendEmail } = plugin.providers

    if (!plugin.config.fromEmail) {
      throw new Error('fromEmail must be set')
    }

    if (sendEmail && !['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
      void sendEmail({
        from: plugin.config.fromEmail,
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

  handleSmsAuthRequest: async (to, twoFactorCode) => {
    const { sendSms } = plugin.providers,
          { fromSms: from, smsMessage } = plugin.config

    if (!from) {
      throw new Error('fromSms must be set')
    }

    const message = smsMessage ? simpleTemplating(smsMessage, { twoFactorCode }) : `Your code is ${twoFactorCode}`

    if (sendSms && !['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
      void sendSms({
        from,
        message,
        to,
      })
    }
    if (process.env.NODE_ENV === 'development') {
      plugin.providers.logger.info(`Generated code for ${to}: ${twoFactorCode}`)
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
    handleEmailAuthRequest: ({ email }, code, { logger }) => { logger.info(`handleAuthRequest for ${email}`, code) },
    handleSmsAuthRequest: (to, code, { logger }) => { logger.info(`handleAuthRequest for ${to}`, code) },
    generateTokenContents,
    fromEmail: { email: 'noreply@zemble.com' },
    fromSms: 'Zemble',
  },
})

export default plugin
