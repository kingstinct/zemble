import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'
import { isValidE164Number } from '../../utils/isValidE164Number'

import type { MutationResolvers } from '../schema.generated'

const getTwoFactorCode = () => {
  if (process.env.NODE_ENV === 'test') {
    return '000000'
  }
  const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()

  return twoFactorCode
}

export const smsLoginRequest: NonNullable<MutationResolvers['smsLoginRequest']> = async (_, {
  phoneNum: phoneNumInput,
}, context) => {
  if (!isValidE164Number(phoneNumInput)) {
    return { message: 'Not a valid phone number', __typename: 'PhoneNumNotValidError' }
  }

  const phoneNum = phoneNumInput.trim()

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
