import plugin from '../../plugin'
import { isValidEmail } from '../../utils/isValidEmail'
import sendTwoFactorCode from '../../utils/sendTwoFactorCode'

import type { MutationResolvers } from '../schema.generated'

export const loginRequestWithEmail: NonNullable<MutationResolvers['loginRequestWithEmail']> = async (_, {
  email: emailInput,
}, context) => {
  if (!isValidEmail(emailInput)) {
    return { message: 'Not a valid email', __typename: 'EmailNotValidError' }
  }

  const email = emailInput.toLowerCase().trim()

  const whitelistedEmailFromDomain = plugin.config.WHITELISTED_SIGNUP_EMAIL_DOMAINS?.includes(emailInput.split('@')[1]!)

  const validatedEmailFromWhitelist = plugin.config.WHITELISTED_SIGNUP_EMAILS?.includes(email)

  const hasWhitelist = plugin.config.WHITELISTED_SIGNUP_EMAILS || plugin.config.WHITELISTED_SIGNUP_EMAIL_DOMAINS

  if (hasWhitelist && !whitelistedEmailFromDomain && !validatedEmailFromWhitelist) {
    return {
      message: 'Email not whitelisted',
      __typename: 'EmailNotValidError',
    }
  }

  return sendTwoFactorCode(emailInput, context, 'email')
}

export default loginRequestWithEmail
