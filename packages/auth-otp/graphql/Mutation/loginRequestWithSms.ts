import { parsePhoneNumberWithError } from 'libphonenumber-js'

import plugin from '../../plugin'
import { isValidE164Number } from '../../utils/isValidE164Number'
import sendTwoFactorCode from '../../utils/sendTwoFactorCode'

import type { MutationResolvers } from '../schema.generated'

export const loginRequestWithSms: NonNullable<
  MutationResolvers['loginRequestWithSms']
> = async (_, { phoneNumberWithCountryCode: phoneNumIn }, context) => {
  const phoneNumberWithCountryCode = phoneNumIn.trim()

  if (!isValidE164Number(phoneNumberWithCountryCode)) {
    return {
      message: 'Not a valid phone number',
      __typename: 'PhoneNumNotValidError',
    }
  }

  const { country } = parsePhoneNumberWithError(phoneNumberWithCountryCode)
  const { WHITELISTED_COUNTRY_CODES } = plugin.config

  if (WHITELISTED_COUNTRY_CODES && WHITELISTED_COUNTRY_CODES.length) {
    if (!country || !WHITELISTED_COUNTRY_CODES.includes(country)) {
      return {
        message: 'Country code not whitelisted',
        __typename: 'PhoneNumNotValidError',
      }
    }
  }

  return sendTwoFactorCode(phoneNumberWithCountryCode, context, 'sms')
}

export default loginRequestWithSms
