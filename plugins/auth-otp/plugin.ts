/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { Plugin } from '@readapt/core'
import Auth from 'readapt-plugin-auth'
import kv from 'readapt-plugin-kv'

import type { IEmail } from '@readapt/core'

interface OtpAuthConfig extends Readapt.GlobalConfig {
  readonly tokenExpiryInSeconds?: number
  readonly twoFactorCodeExpiryInSeconds?: number
  readonly minTimeBetweenTwoFactorCodeRequestsInSeconds?: number
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
  readonly handleAuthRequest?: (email: IEmail, twoFactorCode: string, context: Readapt.GlobalContext) => Promise<void> | void
  readonly generateTokenContents: (email: string) => Promise<Readapt.OtpToken> | Readapt.OtpToken
}

interface DefaultOtpToken {
  readonly type: 'AuthOtp',
  readonly email: string,
}

declare global {
  namespace Readapt {
    interface OtpToken extends DefaultOtpToken {

    }

    interface TokenRegistry {
      readonly AuthOtp: OtpToken
    }
  }
}

function generateTokenContents(email: string): Readapt.OtpToken {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - this is a default implementation
  return { email, type: 'AuthOtp' as const }
}

const simpleTemplating = (template: string, values: Record<string, string>): string => {
  let result = template
  Object.entries(values).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value)
  })
  return result
}

const defaultConfig = {
  tokenExpiryInSeconds: undefined,
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
  generateTokenContents,
  handleAuthRequest: async (to, twoFactorCode, context) => {
    if (context.sendEmail) {
      void context.sendEmail({
        from: plugin.config.from,
        subject: plugin.config.emailSubject ? simpleTemplating(plugin.config.emailSubject, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : 'Login',
        text: plugin.config.emailText ? simpleTemplating(plugin.config.emailText, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : `Your two factor code is ${twoFactorCode}`,
        html: plugin.config.emailHtml ? simpleTemplating(plugin.config.emailHtml, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : `Your two factor code is <b>${twoFactorCode}</b>`,
        to,
      })
    } else {
      console.log(`handleAuthRequest for ${to.email}`, twoFactorCode)
    }
  },
} satisfies Partial<OtpAuthConfig>

const plugin = new Plugin<OtpAuthConfig, typeof defaultConfig>(__dirname, {
  dependencies: [
    {
      plugin: Auth,
    },
    {
      plugin: kv,
    },
  ],
  defaultConfig,
  devConfig: {
    handleAuthRequest: ({ email }, code) => { console.log(`handleAuthRequest for ${email}`, code) },
    generateTokenContents,
    from: { email: 'noreply@readapt.com' },
  },
})

export default plugin
