/* eslint-disable no-console */
import { Plugin, setupProvider } from '@zemble/core'
import yoga from '@zemble/graphql'

import type { IStandardSendSmsService } from '@zemble/core'

interface Sms46ElksConfig extends Zemble.GlobalConfig {
  readonly ELKS_USERNAME?: string
  readonly ELKS_PASSWORD?: string
  readonly disable?: boolean
  readonly options: {
    readonly dryrun?: 'yes' | 'no'
    readonly flashsms?: 'yes' | 'no'
    readonly dontlog?: 'message' | 'from' | 'to'
    readonly whendelivered?: string
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/sms-46elks']?: Zemble.DefaultMiddlewareConfig
    }

    interface Providers {
      // eslint-disable-next-line functional/prefer-readonly-type
      sendSms: IStandardSendSmsService
    }
  }
}

const defaultConfig = {
  ELKS_USERNAME: process.env['ELKS_USERNAME'],
  ELKS_PASSWORD: process.env['ELKS_PASSWORD'],
  disable: process.env.NODE_ENV === 'test',
  middleware: {
    '@zemble/graphql': {
      disable: true,
    },
  },
} satisfies Partial<Sms46ElksConfig>

// eslint-disable-next-line unicorn/consistent-function-scoping
const plugin = new Plugin<Sms46ElksConfig, typeof defaultConfig>(import.meta.dir, {
  middleware: async ({
    config, app, logger,
  }) => {
    if (!config.disable) {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const initializeProvider = (): IStandardSendSmsService => async (data) => {
        if (!config.ELKS_USERNAME || !config.ELKS_PASSWORD) {
          logger.warn('ELKS_USERNAME and ELKS_PASSWORD must be set to send sms, skipping')
          return false
        }

        const auth = Buffer.from(`${config.ELKS_USERNAME}:${config.ELKS_PASSWORD}`).toString('base64')

        let formatedData = { ...data, from: data.from.replace(/\s/g, '') }

        if (config.options) {
          formatedData = { ...formatedData, ...config.options }
        }

        const body = new URLSearchParams(formatedData).toString()

        try {
          const response = await fetch('https://api.46elks.com/a1/sms', {
            method: 'POST',
            body,
            headers: { Authorization: `Basic ${auth}` },
          })

          const { ok } = response

          if (!ok) {
            console.log(response.status)
            throw new Error('Failed to send sms')
          }

          if (ok) {
            console.log('RESPONSE', await response.json())
          }

          return true
        } catch (error) {
          if (error instanceof Error) {
            logger.error('Error sending sms', error.message)
          }
          return false
        }
      }
      await setupProvider({
        app,
        initializeProvider,
        providerKey: 'sendSms',
        middlewareKey: '@zemble/sms-46elks',
      })
    }
  },
  dependencies: [
    {
      plugin: yoga,
    },
  ],
  defaultConfig,
  additionalConfigWhenRunningLocally: {
    middleware: {
      '@zemble/graphql': {
        disable: false,
      },
    },
  },
})

export default plugin
