import * as jose from 'jose'

import plugin from '../plugin'

export async function signJwt<T extends object>({ data, expiresInSeconds, privateKey }: { readonly data: T, readonly expiresInSeconds?: number, readonly privateKey?: string }) {
  const { PRIVATE_KEY, ISSUER } = plugin.config
  const actualPrivateKey = privateKey ?? PRIVATE_KEY ?? process.env.PRIVATE_KEY

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
    jwt.setExpirationTime(`${expiresInSeconds} sec`)
  }

  return jwt.sign(ecPrivateKey)
}
