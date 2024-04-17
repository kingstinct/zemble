/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import Auth from 'zemble-plugin-auth'
import kv from 'zemble-plugin-kv'

import type { IEmail } from '@zemble/core'

interface OtpAuthConfig extends Zemble.GlobalConfig {
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
  readonly handleAuthRequest?: (email: IEmail, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly generateTokenContents: ({ email }: {readonly email: string}) => Promise<Zemble.OtpToken> | Zemble.OtpToken
}

export interface DefaultOtpToken {
  // readonly type: 'AuthOtp',
  readonly email: string,
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

const simpleTemplating = (template: string, values: Record<string, string>): string => {
  let result = template
  Object.entries(values).forEach(([key, value]) => {
    result = result.replaceAll(`{{${key}}}`, value)
  })
  return result
}

const defaultConfig = {
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
  generateTokenContents,
  handleAuthRequest: async (to, twoFactorCode) => {
    const { sendEmail } = plugin.providers
    if (sendEmail && process.env.NODE_ENV !== 'test') {
      void sendEmail({
        from: plugin.config.from,
        subject: plugin.config.emailSubject ? simpleTemplating(plugin.config.emailSubject, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : 'Login',
        text: plugin.config.emailText ? simpleTemplating(plugin.config.emailText, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : `Your two factor code is ${twoFactorCode}`,
        html: plugin.config.emailHtml ? simpleTemplating(plugin.config.emailHtml, { email: to.email, name: to.name ?? to.email, twoFactorCode }) : `Your two factor code is <b>${twoFactorCode}</b>`,
        to,
      })
    }
    plugin.debug(`handleAuthRequest for ${to.email}: ${twoFactorCode}`)
  },
} satisfies Partial<OtpAuthConfig>

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
