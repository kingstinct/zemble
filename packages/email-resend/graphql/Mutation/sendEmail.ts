import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

export const sendEmail: NonNullable<MutationResolvers['sendEmail']> = async (_, { from, to, html, text, subject }) =>
  plugin.providers.sendEmail({
    to: to.map(({ email, name }) => ({ email, name: name ?? undefined })),
    from: {
      email: from.email,
      name: from.name ?? undefined,
    },
    html: html ?? undefined,
    text,
    subject,
  })

export default sendEmail
