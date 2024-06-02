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

  const { bearerToken, refreshToken } = await getTokens(code, emailIn, honoContext)

  if (!bearerToken || !refreshToken) {
    return { __typename: 'CodeNotValidError', message: 'Code not valid' }
  }

  return {
    __typename: 'LoginConfirmSuccessfulResponse',
    bearerToken,
    refreshToken,
  }
}

export default emailLoginConfirm
