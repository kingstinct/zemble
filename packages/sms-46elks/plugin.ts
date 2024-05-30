import { Plugin, setupProvider } from '@zemble/core'
import yoga from '@zemble/graphql'

import type {  IStandardSendSmsService } from '@zemble/core'

interface Sms46ElksConfig extends Zemble.GlobalConfig {
  readonly ELKS_USERNAME?: string
  readonly ELKS_PASSWORD?: string
  readonly disable?: boolean
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
      const initializeProvider = (): IStandardSendSmsService => async (data) => {
        if (!config.ELKS_USERNAME || !config.ELKS_PASSWORD) {
          logger.warn('ELKS_USERNAME and ELKS_PASSWORD must be set to send sms, skipping')
          return false
        }


        const auth  = Buffer.from(config.ELKS_USERNAME + ":" + config.ELKS_PASSWORD).toString("base64");

        const body = new URLSearchParams(data).toString()

        try {

         const response = await fetch("https://api.46elks.com/a1/sms", {
            method: "post",
            body,
            headers: {"Authorization": "Basic "  + auth}
          })

          const ok = response.ok
          
          return ok
        } catch (error) {
          logger.error('Error sending sms', error)
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
    ELKS_USERNAME: process.env['ELKS_USERNAME'],
    ELKS_PASSWORD: process.env['ELKS_PASSWORD'],
    middleware: {
      '@zemble/graphql': {
        disable: false,
      },
    },
  },
})

export default plugin
