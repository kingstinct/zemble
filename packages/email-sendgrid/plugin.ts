import sendgrid from '@sendgrid/mail'
import { Plugin } from '@zemble/core'
import setupProvider from '@zemble/core/utils/setupProvider'
import yoga from '@zemble/graphql'

import type { IEmail, IStandardSendEmailService } from '@zemble/core'

interface EmailSendgridConfig extends Zemble.GlobalConfig {
  readonly SENDGRID_API_KEY?: string
  readonly disable?: boolean
}

export const mapEmail = (email: string | IEmail): IEmail => (
  typeof email === 'string'
    ? { email }
    : email
)

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/email-sendgrid']?: Zemble.DefaultMiddlewareConfig
    }

    interface Providers {
      // eslint-disable-next-line functional/prefer-readonly-type
      sendEmail: IStandardSendEmailService
    }
  }
}

const defaultConfig = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  disable: process.env.NODE_ENV === 'test',
  middleware: {
    '@zemble/graphql': {
      disable: true,
    },
  },
} satisfies Partial<EmailSendgridConfig>

// eslint-disable-next-line unicorn/consistent-function-scoping
const plugin = new Plugin<EmailSendgridConfig, typeof defaultConfig>(import.meta.dir, {
  middleware: async ({
    config, app, logger,
  }) => {
    if (!config.disable) {
      const initializeProvider = (): IStandardSendEmailService => async ({
        from, to, html, text, subject, bcc, cc, replyTo,
      // eslint-disable-next-line unicorn/consistent-function-scoping
      }) => {
        if (!config.SENDGRID_API_KEY) {
          logger.warn('SENDGRID_API_KEY must be set to send email, skipping')
          return false
        }

        sendgrid.setApiKey(config.SENDGRID_API_KEY)

        const [response] = await sendgrid.send({
          // eslint-disable-next-line no-nested-ternary
          to: typeof to === 'string' ? to
            : ('email' in to ? { email: to.email, name: to.name ?? undefined }
              : to.map(mapEmail)),
          from: mapEmail(from),
          html: html ?? undefined,
          text,
          subject,
          ...cc ? { cc: cc instanceof Array ? cc.map(mapEmail) : mapEmail(cc) } : {},
          ...bcc ? { bcc: bcc instanceof Array ? bcc.map(mapEmail) : mapEmail(bcc) } : {},
          ...replyTo ? { replyTo: replyTo instanceof Array ? replyTo.map(mapEmail)[0] : mapEmail(replyTo) } : {},
        })

        const ok = response.statusCode >= 200 && response.statusCode < 300

        return ok
      }
      // eslint-disable-next-line functional/immutable-data, no-param-reassign
      await setupProvider({
        app,
        initializeProvider,
        providerKey: 'sendEmail',
        middlewareKey: '@zemble/email-sendgrid',
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
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    middleware: {
      '@zemble/graphql': {
        disable: false,
      },
    },
  },
})

export default plugin
