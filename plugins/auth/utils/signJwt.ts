import * as jose from 'jose'

import plugin from '../plugin'

const { PRIVATE_KEY, ISSUER } = plugin.config

export async function signJwt<T extends object>({ data, expiresInSeconds }: { readonly data: T, readonly expiresInSeconds?: number }) {
  const ecPrivateKey = await jose.importPKCS8(PRIVATE_KEY as string, 'RS256')

  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY is not set')
  }

  const jwt = new jose.SignJWT({
    ...data,
    iss: ISSUER,
  })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setProtectedHeader({ alg: 'RS256' })

  if (expiresInSeconds) {
    jwt.setExpirationTime(expiresInSeconds)
  }

  return jwt.sign(ecPrivateKey)
}
