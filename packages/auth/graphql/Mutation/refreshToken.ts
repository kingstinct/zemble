import plugin from '../../plugin'
import { decodeToken } from '../../utils/decodeToken'
import { encodeToken } from '../../utils/encodeToken'
import { generateRefreshToken } from '../../utils/generateRefreshToken'
import { setBearerTokenCookie } from '../../utils/setBearerTokenCookie'
import { verifyJwt } from '../../utils/verifyJwt'

import type { MutationResolvers } from '../schema.generated'

export const refreshToken: NonNullable<MutationResolvers['refreshToken']> = async (_parent, { bearerToken, refreshToken }, { honoContext }) => {
  const previousBearerToken = await decodeToken(bearerToken, undefined, { currentDate: new Date(0) })

  if (!previousBearerToken.sub) {
    throw new Error('Token doesn\'t contain a sub field, cant reissue')
  }

  await verifyJwt(refreshToken, undefined, { subject: previousBearerToken.sub })

  // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-argument
  const newBearerTokenData = await plugin.config.reissueBearerToken(previousBearerToken)
  const newBearerToken = await encodeToken(newBearerTokenData as Zemble.TokenRegistry[keyof Zemble.TokenRegistry], previousBearerToken.sub)

  if (plugin.config.cookies.isEnabled) {
    setBearerTokenCookie(honoContext, bearerToken)
  }

  return {
    __typename: 'NewTokenSuccessResponse',
    bearerToken: newBearerToken,
    refreshToken: await generateRefreshToken({ sub: previousBearerToken.sub }),
  }
}
