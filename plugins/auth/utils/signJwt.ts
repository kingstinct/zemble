import * as jwt from 'jsonwebtoken'

import plugin from '../plugin'

const { PRIVATE_KEY, ISSUER } = plugin.config

export function signJwt<T extends object>({ data, expiresInSeconds }: { readonly data: T, readonly expiresInSeconds?: number }) {
  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not set')
  }

  return jwt.sign(
    data,
    PRIVATE_KEY,
    {
      algorithm: 'RS256',
      ...expiresInSeconds !== undefined ? { expiresIn: expiresInSeconds } : {},
      issuer: ISSUER,
    },
  )
}
