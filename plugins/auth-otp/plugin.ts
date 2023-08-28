/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { Plugin } from '@readapt/core'
import Auth from 'readapt-plugin-auth'

interface OtpAuthConfig extends Readapt.GlobalConfig {
  readonly REDIS_URL?: string
  readonly REDIS_OPTIONS?: Record<string, unknown>
  readonly tokenExpiryInSeconds?: number
  readonly twoFactorCodeExpiryInSeconds?: number
  readonly minTimeBetweenTwoFactorCodeRequestsInSeconds?: number
  readonly handleAuthRequest: (email: string, twoFactorCode: string) => Promise<void> | void
  readonly handleAuthSuccess: <TTokenContents extends Record<string, unknown>>(email: string) => Promise<TTokenContents> | TTokenContents
}

const defaultConfig = {
  tokenExpiryInSeconds: undefined,
  twoFactorCodeExpiryInSeconds: 60 * 5, // 5 minutes
  minTimeBetweenTwoFactorCodeRequestsInSeconds: 60 * 1, // 1 minute
} satisfies Partial<OtpAuthConfig>

async function handleAuthSuccess<TTokenContents extends Record<string, unknown>>(email: string) {
  console.log('handleAuthSuccess', email)

  return {} as TTokenContents
}

const plugin = new Plugin<OtpAuthConfig, typeof defaultConfig>(__dirname, {
  dependencies: ({ config }) => [
    {
      plugin: Auth,
    },
  ],
  defaultConfig,
  devConfig: {
    handleAuthRequest: (_, code) => { console.log('handleAuthRequest', code) },
    handleAuthSuccess,
  },
})

export const { config } = plugin

export default plugin
