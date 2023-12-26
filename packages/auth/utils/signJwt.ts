import * as jose from 'jose'

import plugin from '../plugin'

const { PRIVATE_KEY, ISSUER } = plugin.config

export async function signJwt<T extends object>({ data, expiresInSeconds }: { readonly data: T, readonly expiresInSeconds?: number }) {
  const actualPrivateKey = PRIVATE_KEY ?? process.env.PRIVATE_KEY

  if (!actualPrivateKey) {
    throw new Error('[zemble-plugin-auth] PRIVATE_KEY is not set, please set it as an environment variable or in the plugin config')
  }

  const ecPrivateKey = await jose.importPKCS8(actualPrivateKey, 'RS256')

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
