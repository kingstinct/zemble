import { signJwt } from './signJwt'

import type { TokenContents } from '@zemble/core'

export const encodeToken = async (data: TokenContents, sub: string) => {
  const token = await signJwt({ data, sub })
  return token
}
