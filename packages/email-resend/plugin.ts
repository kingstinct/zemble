import type { IEmail, IStandardSendEmailService } from '@zemble/core'
import { Plugin } from '@zemble/core'
import setupProvider from '@zemble/core/utils/setupProvider'
import yoga from '@zemble/graphql'
import { Resend } from 'resend'

interface EmailResendConfig extends Zemble.GlobalConfig {
  readonly RESEND_API_KEY?: string
  readonly disable?: boolean
}

export const mapEmail = (email: string | IEmail): string => {
  if (typeof email === 'string') {
    return email
  }
  return email.name ? `${email.name} <${email.email}>` : email.email
}

declare global {
  namespace Zemble {
    interface MiddlewareConfig {
      readonly ['@zemble/email-resend']?: Zemble.DefaultMiddlewareConfig
    }

    interface Providers {
      sendEmail: IStandardSendEmailService
    }
  }
}

const defaultConfig = {
  RESEND_API_KEY: process.env['RESEND_API_KEY'],
  disable: process.env.NODE_ENV === 'test',
  middleware: {
    '@zemble/graphql': {
      disable: true,
    },
  },
} satisfies Partial<EmailResendConfig>

const plugin = new Plugin<EmailResendConfig, typeof defaultConfig>(
  import.meta.dir,
  {
    middleware: async ({ config, app, logger }) => {
      if (!config.disable) {
        const initializeProvider =
          (): IStandardSendEmailService =>
          async ({ from, to, html, text, subject, replyTo, cc, bcc }) => {
            if (!config.RESEND_API_KEY) {
              logger.warn('RESEND_API_KEY must be set to send email, skipping')
              return false
            }

            const resend = new Resend(config.RESEND_API_KEY)

            const response = await resend.emails.send({
              to: to instanceof Array ? to.map(mapEmail) : mapEmail(to),
              from: mapEmail(from),
              html: html ?? undefined,
              text,
              subject,
              ...(replyTo
                ? {
                    reply_to:
                      replyTo instanceof Array
                        ? replyTo.map(mapEmail)
                        : mapEmail(replyTo),
                  }
                : {}),
              ...(cc
                ? { cc: cc instanceof Array ? cc.map(mapEmail) : mapEmail(cc) }
                : {}),
              ...(bcc
                ? {
                    bcc:
                      bcc instanceof Array ? bcc.map(mapEmail) : mapEmail(bcc),
                  }
                : {}),
            })

            const ok = response.error === null

            return ok
          }
        await setupProvider({
          app,
          initializeProvider,
          providerKey: 'sendEmail',
          middlewareKey: '@zemble/email-resend',
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
      RESEND_API_KEY: process.env['RESEND_API_KEY'],
      middleware: {
        '@zemble/graphql': {
          disable: false,
        },
      },
    },
  },
)

export default plugin
