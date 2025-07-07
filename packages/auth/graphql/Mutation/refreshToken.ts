import plugin from '../../plugin'
import { decodeToken } from '../../utils/decodeToken'
import { encodeToken } from '../../utils/encodeToken'
import { generateRefreshToken } from '../../utils/generateRefreshToken'
import { setTokenCookies } from '../../utils/setBearerTokenCookie'
import { verifyJwt } from '../../utils/verifyJwt'

import type { MutationResolvers } from '../schema.generated'

export const refreshTokensFromPrevious = async (
  bearerToken: string,
  refreshToken: string,
) => {
  const previousBearerToken = await decodeToken(bearerToken, undefined, {
    currentDate: new Date(0),
  })

  if (!previousBearerToken.sub) {
    throw new Error("Token doesn't contain a sub field, can't reissue")
  }

  await verifyJwt(refreshToken, undefined, { subject: previousBearerToken.sub })

  const newBearerTokenData =
      await plugin.config.reissueBearerToken(previousBearerToken),
    newBearerToken = await encodeToken(
      newBearerTokenData as Zemble.TokenRegistry[keyof Zemble.TokenRegistry],
      previousBearerToken.sub,
    ),
    newRefreshToken = await generateRefreshToken({
      sub: previousBearerToken.sub,
    })

  return {
    bearerToken: newBearerToken,
    refreshToken: newRefreshToken,
  }
}

export const refreshToken: NonNullable<
  MutationResolvers['refreshToken']
> = async (_parent, { bearerToken, refreshToken }, { honoContext }) => {
  const { bearerToken: newBearerToken, refreshToken: newRefreshToken } =
    await refreshTokensFromPrevious(bearerToken, refreshToken)

  if (plugin.config.cookies.isEnabled) {
    setTokenCookies(honoContext, bearerToken, newRefreshToken)
  }

  return {
    __typename: 'NewTokenSuccessResponse',
    bearerToken: newBearerToken,
    refreshToken: newRefreshToken,
  }
}
