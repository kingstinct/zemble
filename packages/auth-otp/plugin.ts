/* eslint-disable @typescript-eslint/require-await, @typescript-eslint/no-namespace */

import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import kv from '@zemble/kv'
import { parseEnvJSON } from '@zemble/utils/node/parseEnv'

import { simpleTemplating } from './utils/simpleTemplating'

import type { IEmail } from '@zemble/core'
import {parsePhoneNumber} from 'libphonenumber-js'
import { type CountryCode } from 'libphonenumber-js'
import { isValidE164Number } from './utils/isValidE164Number'

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

  readonly fromSms?: string
  /*
   * Write {{twoFactorCode}} to have them replaced with the
   * email, name and two factor code.
    */
  readonly smsMessage?: string
  readonly WHITELISTED_COUNTRY_CODES?: readonly CountryCode[]


  readonly handleEmailAuthRequest?: (email: IEmail, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly handleSmsAuthRequest?: (phoneNum: string, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly generateTokenContents: ({ email, phoneNum }: {readonly email?: string, readonly phoneNum?: string}) => Promise<Omit<Zemble.OtpToken, 'iat'>> | Omit<Zemble.OtpToken, 'iat'>
}

export interface DefaultOtpToken {
  // readonly type: 'AuthOtp',
  readonly email?: string,
  readonly phoneNum?: string,
  readonly sub: string
}
// type EmailOrPhoneNumber = { readonly email: string } | { readonly phoneNumber: string }
// type DefaultOtpToken = { readonly sub: string } & EmailOrPhoneNumber

declare global {
  namespace Zemble {
    interface OtpToken extends DefaultOtpToken {

    }

    interface TokenRegistry {
      readonly AuthOtp: OtpToken
    }
  }
}

function generateTokenContents({ email, phoneNum }: {readonly email?: string, readonly phoneNum?: string}): Zemble.OtpToken {
  if (email) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - this is a default implementation
    return { email, type: 'AuthOtp' as const }
  }

  if (phoneNum) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - this is a default implementation
    return { phoneNum, type: 'AuthOtp' as const }
  }

  throw new Error('Either email or phoneNum must be provided')
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

  handleSmsAuthRequest: async (phoneNum, twoFactorCode) => {
    const { sendSms } = plugin.providers,
    {fromSms, smsMessage, WHITELISTED_COUNTRY_CODES} = plugin.config

    const from = fromSms?.replace(/\s/g, '')
    const {country, number: to} = parsePhoneNumber(phoneNum)

    if (!from) {
      throw new Error('fromSms must be set')
    }

    if (WHITELISTED_COUNTRY_CODES  && WHITELISTED_COUNTRY_CODES.length) {
      if (!country || !WHITELISTED_COUNTRY_CODES.includes(country)) {
        throw new Error(`Country code ${country} is not allowed`)
      }
    }

    const message = smsMessage ? simpleTemplating(smsMessage, { twoFactorCode }) : `Your code is ${twoFactorCode}`

    if (sendSms && !['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
      void sendSms({
        from: from,
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
