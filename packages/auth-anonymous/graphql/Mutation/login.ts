/* eslint-disable @typescript-eslint/no-namespace */
import authPlugin from '@zemble/auth'
import { encodeToken } from '@zemble/auth/utils/encodeToken'
import { generateRefreshToken } from '@zemble/auth/utils/generateRefreshToken'
import { setBearerTokenCookie } from '@zemble/auth/utils/setBearerTokenCookie'

import plugin from '../../plugin'

import type { MutationResolvers } from '../schema.generated'

const login: MutationResolvers['login'] = async (_: unknown, __, { honoContext }) => {
  const userId = plugin.config.generateUserId()
  const tokenData = plugin.config.generateTokenContents(userId)
  const bearerToken = await encodeToken(tokenData, userId)

  if (authPlugin.config.cookies.isEnabled) {
    setBearerTokenCookie(honoContext, bearerToken)
  }

  return { bearerToken, refreshToken: await generateRefreshToken({ sub: tokenData.sub }) }
}

export default login
