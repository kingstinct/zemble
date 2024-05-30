import Auth from '@zemble/auth'
import { generateRefreshToken } from '@zemble/auth/utils/generateRefreshToken'
import { setTokenCookies } from '@zemble/auth/utils/setBearerTokenCookie'
import { signJwt } from '@zemble/auth/utils/signJwt'

import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'

import type {
  MutationResolvers,
} from '../schema.generated'
import { isValidE164Number } from '../../utils/isValidE164Number'

export const loginConfirm: NonNullable<MutationResolvers['loginConfirm']> = async (_, {
  phoneNum: phoneNumIn, code,
}, { honoContext }) => {
  const phoneNum = phoneNumIn.trim()

  if (!isValidE164Number(phoneNum)) {
    return { __typename: 'PhoneNumNotValidError', message: 'Phone number is not valid' }
  }

  if (code.length !== 6) {
    return { __typename: 'CodeNotValidError', message: 'Code should be 6 characters' }
  }

  const entry = await loginRequestKeyValue().get(phoneNum)

  if (!entry) {
    return { __typename: 'CodeNotValidError', message: 'Must loginRequest code first, it might have expired' }
  }

  if (entry?.twoFactorCode !== code) {
    return { __typename: 'CodeNotValidError', message: 'Code not valid' }
  }

  const { sub, ...data } = await plugin.config.generateTokenContents({ phoneNum })

  const bearerToken = await signJwt({
    data,
    expiresInSeconds: Auth.config.bearerTokenExpiryInSeconds,
    sub,
  })

  const refreshToken = await generateRefreshToken({ sub })

  if (Auth.config.cookies.isEnabled) {
    setTokenCookies(honoContext, bearerToken, refreshToken)
  }

  return {
    __typename: 'LoginConfirmSuccessfulResponse',
    bearerToken,
    refreshToken,
  }
}

export default loginConfirm
