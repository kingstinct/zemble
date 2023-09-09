import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'
import { isValidEmail } from '../../utils/isValidEmail'

import type { MutationResolvers } from '../schema.generated'

const getTwoFactorCode = () => {
  if (process.env.NODE_ENV === 'test') {
    return '000000'
  }
  const twoFactorCode = Math.floor(100000 + Math.random() * 900000).toString()

  return twoFactorCode
}

const loginRequest: MutationResolvers['loginRequest'] = async (_, {
  email,
}, context) => {
  if (!isValidEmail(email)) {
    return { message: 'Not a valid email', __typename: 'EmailNotValidError' }
  }

  const existing = await loginRequestKeyValue.get(email.toLowerCase())

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

  await loginRequestKeyValue.set(email.toLowerCase(), {
    loginRequestedAt: new Date().toISOString(),
    twoFactorCode,
  }, plugin.config.twoFactorCodeExpiryInSeconds)

  await plugin.config.handleAuthRequest(email, twoFactorCode, context)

  return {
    __typename: 'LoginRequestSuccessResponse',
    success: true,
  }
}

export default loginRequest
