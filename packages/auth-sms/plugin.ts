import Auth from '@zemble/auth'
import { Plugin } from '@zemble/core'
import GraphQL from '@zemble/graphql'
import kv from '@zemble/kv'


interface SMSAuthConfig extends Zemble.GlobalConfig {
  readonly twoFactorCodeExpiryInSeconds?: number
  readonly minTimeBetweenTwoFactorCodeRequestsInSeconds?: number

// The from parameter should be either an E.164 number or a string. That string is often called "Text sender ID" or "alphanumeric sender ID".
//  Example: +46766861004, ElkCo

  readonly from: string
  readonly message?: string

//   The to parameter should be the E.164 formatted number of the recipient.
// Example: +46766861004.
  readonly handleAuthRequest?: (phoneNum: string, twoFactorCode: string, context: Zemble.GlobalContext) => Promise<void> | void
  readonly generateTokenContents: ({ phoneNum }: {readonly phoneNum: string}) => Promise<Omit<Zemble.SmsToken, 'iat'>> | Omit<Zemble.SmsToken, 'iat'>
}

export interface DefaultSmsToken {
  // readonly type: 'AuthOtp',
  readonly phoneNum: string,
  readonly sub: string
}

declare global {
  namespace Zemble {
    interface SmsToken extends DefaultSmsToken {

    }

    interface TokenRegistry {
      readonly SmsOtp: SmsToken
    }
  }
}



function generateTokenContents({ phoneNum }: {readonly phoneNum: string}): Zemble.SmsToken {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - this is a default implementation
  return { phoneNum, type: 'AuthOtp' as const }
}

const defaultConfig = {
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
  generateTokenContents,

  handleAuthRequest: async (to, twoFactorCode) => {
    const { sendSms } = plugin.providers

    if (sendSms && !['test', 'development'].includes(process.env.NODE_ENV ?? '')) {
      void sendSms({
        from: plugin.config.from,
        message: plugin.config.message ?? `Your code is ${twoFactorCode}`,
        to,
      })
    }
    if (process.env.NODE_ENV === 'development') {
      plugin.providers.logger.info(`Generated code for ${to}: ${twoFactorCode}`)
    }
  },
} satisfies Partial<SMSAuthConfig>


const plugin = new Plugin<SMSAuthConfig, typeof defaultConfig>(import.meta.dir, {
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
    handleAuthRequest: (to, code, { logger }) => { logger.info(`handleAuthRequest for ${to}`, code) },
    generateTokenContents,
    from: 'noreply@zemble.com',
  },
})

export default plugin
