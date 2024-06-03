import getTwoFactorCode from './getTwoFactorCode'
import { loginRequestKeyValue } from '../clients/loginRequestKeyValue'
import plugin from '../plugin'

import type { E164PhoneNumber } from './types'

type Context = Omit<Zemble.GraphQLContext, 'decodedToken'> & {
  readonly decodedToken: never;
}

const sendTwoFactorCode = async (emailOrPhoneNumber: string, context: Context, signInMethod: 'email' | 'sms') => {
  const existing = await loginRequestKeyValue().get(emailOrPhoneNumber)

  if (existing?.loginRequestedAt) {
    const { loginRequestedAt } = existing,
          timeUntilAllowedToSendAnother = new Date(loginRequestedAt).valueOf() + (plugin.config.minTimeBetweenTwoFactorCodeRequestsInSeconds * 1000) - Date.now()

    if (timeUntilAllowedToSendAnother > 0) {
      return {
        success: false,
        __typename: 'LoginRequestSuccessResponse' as const,
      }
    }
  }

  const twoFactorCode = getTwoFactorCode()

  await loginRequestKeyValue().set(emailOrPhoneNumber, {
    loginRequestedAt: new Date().toISOString(),
    twoFactorCode,
  }, plugin.config.twoFactorCodeExpiryInSeconds)

  if (signInMethod === 'email') {
    await plugin.config.handleEmailAuthRequest({ email: emailOrPhoneNumber }, twoFactorCode, context)
  }

  if (signInMethod === 'sms') {
    await plugin.config.handleSmsAuthRequest(emailOrPhoneNumber as E164PhoneNumber, twoFactorCode, context)
  }

  return {
    __typename: 'LoginRequestSuccessResponse' as const,
    success: true,
  }
}

export default sendTwoFactorCode
