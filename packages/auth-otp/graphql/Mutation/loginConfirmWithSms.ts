import getTokens from '../../utils/getTokens'
import { isValidE164Number } from '../../utils/isValidE164Number'

import type {
  MutationResolvers,
} from '../schema.generated'

export const loginConfirmWithSms: NonNullable<MutationResolvers['loginConfirmWithSms']> = async (_, {
  phoneNumberWithCountryCode: phoneNumberIn, code,
}, { honoContext }) => {
  const phoneNumberWithCountryCode = phoneNumberIn.trim()

  if (!isValidE164Number(phoneNumberWithCountryCode)) {
    return { __typename: 'PhoneNumNotValidError', message: 'Phone number is not valid' }
  }

  return getTokens(code, phoneNumberWithCountryCode, honoContext, 'sms')
}

export default loginConfirmWithSms
