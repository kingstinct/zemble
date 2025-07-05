import authPlugin from '@zemble/auth'
import { encodeToken } from '@zemble/auth/utils/encodeToken'
import { generateRefreshToken } from '@zemble/auth/utils/generateRefreshToken'
import { setTokenCookies } from '@zemble/auth/utils/setBearerTokenCookie'

import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const login: MutationResolvers['loginAnonymous'] = async (
  _: unknown,
  __,
  { honoContext },
) => {
  const userId = plugin.config.generateUserId(),
    tokenData = plugin.config.generateTokenContents(userId),
    bearerToken = await encodeToken(tokenData, userId),
    refreshToken = await generateRefreshToken({ sub: tokenData.userId })

  if (authPlugin.config.cookies.isEnabled) {
    setTokenCookies(honoContext, bearerToken, refreshToken)
  }

  return { bearerToken, refreshToken }
}

export default login
