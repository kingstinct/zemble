import { verifyJwt } from './verifyJwt'
import plugin from '../plugin'

import type { TokenContents } from '@zemble/core'
import type { JWTVerifyOptions } from 'jose'

export const decodeToken = async (token: string, publicKey?: string | undefined, opts?: JWTVerifyOptions | undefined) => {
  const decodedToken = await verifyJwt(token, publicKey, opts) as TokenContents

  if (plugin.config.checkTokenValidity && decodedToken.sub) {
    const isValid = await plugin.config.checkTokenValidity(decodedToken.sub, token)
    if (!isValid) {
      throw new Error('Token has been invalidated')
    }
  }

  return decodedToken
}
