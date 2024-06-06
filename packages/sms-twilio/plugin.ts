/* eslint-disable no-console */
import { Plugin, setupProvider } from '@zemble/core'
import yoga from '@zemble/graphql'

import type { IStandardSendSmsService } from '@zemble/core'

interface SmsTwilioConfig extends Zemble.GlobalConfig {
  readonly TWILIO_ACCOUNT_SID?: string
  readonly TWILIO_AUTH_TOKEN?: string
  readonly disable?: boolean
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/sms-twilio']?: Zemble.DefaultMiddlewareConfig
    }

    interface Providers {
      // eslint-disable-next-line functional/prefer-readonly-type
      sendSms: IStandardSendSmsService
    }
  }
}

const defaultConfig = {
  TWILIO_ACCOUNT_SID: process.env['TWILIO_ACCOUNT_SID'],
  TWILIO_AUTH_TOKEN: process.env['TWILIO_AUTH_TOKEN'],
  disable: process.env.NODE_ENV === 'test',
  middleware: {
    '@zemble/graphql': {
      disable: true,
    },
  },
} satisfies Partial<SmsTwilioConfig>

// eslint-disable-next-line unicorn/consistent-function-scoping
const plugin = new Plugin<SmsTwilioConfig, typeof defaultConfig>(import.meta.dir, {
  middleware: async ({
    config, app, logger,
  }) => {
    if (!config.disable) {
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const initializeProvider = (): IStandardSendSmsService => async ({ to, message, from }) => {
        const {
          TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN,
        } = config

        if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
          logger.warn('Twilio account SID and AuthToken must be set to send sms, skipping')
          return false
        }

        const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`

        const body = new URLSearchParams({
          From: from,
          To: to,
          Body: message,
        })

        const headers = {
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        }

        try {
          const response = await fetch(url, {
            method: 'POST',
            headers,
            body,
          })

          if (!response.ok) {
            throw new Error(`Failed to send the SMS message. Error code: ${response.status}. Status: ${response.statusText}.`)
          }

          console.log('SMS sent successfully', await response.json())

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
        middlewareKey: '@zemble/sms-twilio',
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
