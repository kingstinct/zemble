import type { MutationResolvers } from '../schema.generated'

const sendEmailResolver: MutationResolvers['sendEmail'] = async (_, {
  from, to, html, text, subject,
}, { sendEmail }) => sendEmail({
  to: to.map(({ email, name }) => ({ email, name: name ?? undefined })),
  from: {
    email: from.email,
    name: from.name ?? undefined,
  },
  html: html ?? undefined,
  text,
  subject,
})

export default sendEmailResolver
