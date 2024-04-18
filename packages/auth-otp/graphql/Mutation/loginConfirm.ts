import Auth from 'zemble-plugin-auth'
import { generateRefreshToken } from 'zemble-plugin-auth/utils/generateRefreshToken'
import { setBearerTokenCookie } from 'zemble-plugin-auth/utils/setBearerTokenCookie'
import { signJwt } from 'zemble-plugin-auth/utils/signJwt'

import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'
import { isValidEmail } from '../../utils/isValidEmail'

import type {
  MutationResolvers,
} from '../schema.generated'

const loginConfirm: MutationResolvers['loginConfirm'] = async (_, {
  email: emailIn, code,
}, { honoContext }) => {
  const email = emailIn.toLowerCase().trim()
  if (!isValidEmail(email)) {
    return { __typename: 'EmailNotValidError', message: 'Email not valid' }
  }

  if (code.length !== 6) {
    return { __typename: 'CodeNotValidError', message: 'Code should be 6 characters' }
  }

  const entry = await loginRequestKeyValue().get(email.toLowerCase())

  if (!entry) {
    return { __typename: 'CodeNotValidError', message: 'Must loginRequest code first, it might have expired' }
  }

  if (entry?.twoFactorCode !== code) {
    return { __typename: 'CodeNotValidError', message: 'Code not valid' }
  }

  const bearerToken = await signJwt({
    data: await plugin.config.generateTokenContents({ email }),
    expiresInSeconds: Auth.config.bearerTokenExpiryInSeconds,
  })

  if (Auth.config.cookies.isEnabled) {
    setBearerTokenCookie(honoContext, bearerToken)
  }

  return {
    __typename: 'LoginConfirmSuccessfulResponse',
    bearerToken,
    refreshToken: await generateRefreshToken(),
  }
}

export default loginConfirm
