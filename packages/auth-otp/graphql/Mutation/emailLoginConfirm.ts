import getTokens from '../../utils/getTokens'
import { isValidEmail } from '../../utils/isValidEmail'

import type {
  MutationResolvers,
} from '../schema.generated'

export const emailLoginConfirm: NonNullable<MutationResolvers['emailLoginConfirm']> = async (_, {
  email: emailIn, code,
}, { honoContext }) => {
  const email = emailIn.toLowerCase().trim()
  if (!emailIn || !isValidEmail(email)) {
    return { __typename: 'EmailNotValidError', message: 'Email not valid' }
  }

  return getTokens(code, emailIn, honoContext)
}

export default emailLoginConfirm
