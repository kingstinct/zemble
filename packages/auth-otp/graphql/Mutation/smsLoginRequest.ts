import { parsePhoneNumber } from 'libphonenumber-js'

import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'
import getTwoFactorCode from '../../utils/getTwoFactorCode'
import { isValidE164Number } from '../../utils/isValidE164Number'

import type { MutationResolvers } from '../schema.generated'

export const smsLoginRequest: NonNullable<MutationResolvers['smsLoginRequest']> = async (_, {
  phoneNum: phoneNumInput,
}, context) => {
  const phoneNum = phoneNumInput.trim()

  if (!isValidE164Number(phoneNum)) {
    return { message: 'Not a valid phone number', __typename: 'PhoneNumNotValidError' }
  }

  const { country } = parsePhoneNumber(phoneNum),
        { WHITELISTED_COUNTRY_CODES } = plugin.config

  if (WHITELISTED_COUNTRY_CODES && WHITELISTED_COUNTRY_CODES.length) {
    if (!country || !WHITELISTED_COUNTRY_CODES.includes(country)) {
      throw new Error(`Country code ${country} is not allowed`)
    }
  }

  const existing = await loginRequestKeyValue().get(phoneNum)

  if (existing?.loginRequestedAt) {
    const { loginRequestedAt } = existing,
          timeUntilAllowedToSendAnother = new Date(loginRequestedAt).valueOf() + (plugin.config.minTimeBetweenTwoFactorCodeRequestsInSeconds * 1000) - Date.now()

    if (timeUntilAllowedToSendAnother > 0) {
      return {
        success: false,
        __typename: 'LoginRequestSuccessResponse',
      }
    }
  }

  const twoFactorCode = getTwoFactorCode()

  await loginRequestKeyValue().set(phoneNum, {
    loginRequestedAt: new Date().toISOString(),
    twoFactorCode,
  }, plugin.config.twoFactorCodeExpiryInSeconds)

  await plugin.config.handleSmsAuthRequest(phoneNum, twoFactorCode, context)

  return {
    __typename: 'LoginRequestSuccessResponse',
    success: true,
  }
}

export default smsLoginRequest
