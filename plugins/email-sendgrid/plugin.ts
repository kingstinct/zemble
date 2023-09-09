/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable react-hooks/rules-of-hooks */

import { PluginWithMiddleware } from '@readapt/core'
import yoga from '@readapt/graphql-yoga'
import sendgrid from '@sendgrid/mail'

import type { IEmail, IStandardSendEmailService } from '@readapt/core'

interface EmailSendgridConfig extends Readapt.GlobalConfig {
  readonly SENDGRID_API_KEY?: string
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Readapt {
    interface GlobalContext {
      // eslint-disable-next-line functional/prefer-readonly-type
      sendEmail: IStandardSendEmailService
    }
  }
}

export const mapEmail = (email: string | IEmail): IEmail => (typeof email === 'string' ? { email } : email)

const defaultConfig = {
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  skipGraphQL: true,
} satisfies Partial<EmailSendgridConfig>

// eslint-disable-next-line unicorn/consistent-function-scoping
const plugin = new PluginWithMiddleware<EmailSendgridConfig, typeof defaultConfig>(__dirname, () => ({ context }) => {
  // eslint-disable-next-line functional/immutable-data
  context.sendEmail = async ({
    from, to, html, text, subject,
  }) => {
    if (!plugin.config.SENDGRID_API_KEY) {
      console.warn('SENDGRID_API_KEY must be set to send email, skipping')
      return false
    }
    sendgrid.setApiKey(plugin.config.SENDGRID_API_KEY)
    const [response] = await sendgrid.send({
      // eslint-disable-next-line no-nested-ternary
      to: typeof to === 'string' ? to
        : ('email' in to ? { email: to.email, name: to.name ?? undefined }
          : to.map(mapEmail)),
      from: mapEmail(from),
      html: html ?? undefined,
      text,
      subject,
    })

    const ok = response.statusCode >= 200 && response.statusCode < 300

    return ok
  }
}, {
  dependencies: [
    {
      plugin: yoga,
    },
  ],
  defaultConfig,
  devConfig: {
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    skipGraphQL: false,
  },
})

export default plugin
