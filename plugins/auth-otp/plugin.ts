/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { Plugin } from '@readapt/core'
import Auth from 'readapt-plugin-auth'
import kv from 'readapt-plugin-kv'

interface OtpAuthConfig extends Readapt.GlobalConfig {
  readonly tokenExpiryInSeconds?: number
  readonly twoFactorCodeExpiryInSeconds?: number
  readonly minTimeBetweenTwoFactorCodeRequestsInSeconds?: number
  /**
   * Use this to handle the request for a two factor code, usually by sending an email with the code.
   */
  readonly handleAuthRequest: (email: string, twoFactorCode: string) => Promise<void> | void
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

const defaultConfig = {
  tokenExpiryInSeconds: undefined,
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
  generateTokenContents,
} satisfies Partial<OtpAuthConfig>

const plugin = new Plugin<OtpAuthConfig, typeof defaultConfig>(__dirname, {
  dependencies: ({ config }) => [
    {
      plugin: Auth,
    },
    {
      plugin: kv,
    },
  ],
  defaultConfig,
  devConfig: {
    handleAuthRequest: (_, code) => { console.log('handleAuthRequest', code) },
    generateTokenContents,
  },
})

export default plugin
