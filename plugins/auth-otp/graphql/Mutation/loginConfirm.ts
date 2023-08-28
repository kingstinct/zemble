import { setCookie } from 'hono/cookie'
import Auth from 'readapt-plugin-auth'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { loginRequestKeyValue } from '../../clients/loginRequestKeyValue'
import plugin from '../../plugin'
import { isValidEmail } from '../../utils/isValidEmail'

import type {
  MutationResolvers,
} from '../schema.generated'

const loginConfirm: MutationResolvers['loginConfirm'] = async (_, {
  email, code,
}, { honoContext }) => {
  if (!isValidEmail(email)) {
    return { __typename: 'EmailNotValidError', message: 'Email not valid' }
  }

  if (code.length !== 6) {
    return { __typename: 'CodeNotValidError', message: 'Code should be 6 characters' }
  }

  const entry = await loginRequestKeyValue.get(email.toLowerCase())

  if (entry.twoFactorCode !== code) {
    return { __typename: 'CodeNotValidError', message: 'Code not valid' }
  }

  const accessToken = signJwt({ data: await plugin.config.handleAuthSuccess(email), expiresInSeconds: plugin.config.tokenExpiryInSeconds })

  if (Auth.config.cookies.isEnabled) {
    setCookie(honoContext, Auth.config.cookies.name, accessToken, Auth.config.cookies.opts())
  }

  return { accessToken, __typename: 'LoginConfirmSuccessfulResponse' }
}

export default loginConfirm
