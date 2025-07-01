import type { TokenContents } from '@zemble/core'
import type { JWTVerifyOptions } from 'jose'
import plugin from '../plugin'
import { verifyJwt } from './verifyJwt'

export const decodeToken = async (token: string, publicKey?: string, opts?: JWTVerifyOptions) => {
  const decodedToken = (await verifyJwt(token, publicKey, opts)) as TokenContents

  if (plugin.config.checkTokenValidity && decodedToken.sub) {
    const isValid = await plugin.config.checkTokenValidity(token, decodedToken)
    if (!isValid) {
      throw new Error('Token has been invalidated')
    }
  }

  return decodedToken
}
