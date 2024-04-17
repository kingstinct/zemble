import { verifyJwt } from './verifyJwt'

import type { JWTVerifyOptions } from 'jose'

export const decodeToken = async (token: string, publicKey?: string | undefined, opts?: JWTVerifyOptions | undefined) => {
  const decodedToken = await verifyJwt(token, publicKey, opts) as {
    readonly payload: Zemble.TokenRegistry[keyof Zemble.TokenRegistry]
  }
  return decodedToken
}
