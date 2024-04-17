import plugin from '../../plugin'
import { decodeToken } from '../../utils/decodeToken'
import { encodeToken } from '../../utils/encodeToken'
import { generateRefreshToken } from '../../utils/generateRefreshToken'
import { setBearerTokenCookie } from '../../utils/setBearerTokenCookie'
import { verifyJwt } from '../../utils/verifyJwt'

import type { MutationResolvers } from '../schema.generated'

export const refreshToken: NonNullable<MutationResolvers['refreshToken']> = async (_parent, { bearerToken, refreshToken }, { honoContext }) => {
  await verifyJwt(refreshToken)

  const previousBearerToken = await decodeToken(bearerToken, undefined, { currentDate: new Date(0) })

  // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-unsafe-argument
  const newBearerTokenData = (await plugin.config.reissueBearerToken(previousBearerToken as never))
  const newBearerToken = await encodeToken(newBearerTokenData)

  if (plugin.config.cookies.isEnabled) {
    setBearerTokenCookie(honoContext, bearerToken)
  }

  return {
    __typename: 'NewTokenSuccessResponse',
    bearerToken: newBearerToken,
    refreshToken: await generateRefreshToken(),
  }
}
