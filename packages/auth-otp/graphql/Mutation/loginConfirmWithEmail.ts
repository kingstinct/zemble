import getTokens from '../../utils/getTokens'
import { isValidEmail } from '../../utils/isValidEmail'

import type { MutationResolvers } from '../schema.generated'

export const loginConfirmWithEmail: NonNullable<MutationResolvers['loginConfirmWithEmail']> = async (_, { email: emailIn, code }, context) => {
  const email = emailIn.toLowerCase().trim()
  if (!emailIn || !isValidEmail(email)) {
    return { __typename: 'EmailNotValidError', message: 'Email not valid' }
  }

  return getTokens(code, emailIn, context, 'email')
}

export default loginConfirmWithEmail
