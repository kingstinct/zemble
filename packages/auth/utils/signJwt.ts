import * as jose from 'jose'

import plugin from '../plugin'

export async function signJwt<T extends object>({
  data,
  expiresInSeconds,
  privateKey,
  sub,
}: {
  readonly data: T
  readonly expiresInSeconds?: number
  readonly privateKey?: string
  readonly sub: string
}) {
  const { PRIVATE_KEY, ISSUER } = plugin.config
  const actualPrivateKey = privateKey ?? PRIVATE_KEY ?? process.env.PRIVATE_KEY

  if (!actualPrivateKey) {
    throw new Error('[@zemble/auth] PRIVATE_KEY is not set, please set it as an environment variable or in the plugin config. You can run `bunx zemble-generate-keys` to add it to your .env')
  }

  const ecPrivateKey = await jose.importPKCS8(actualPrivateKey, 'RS256')

  const jwt = new jose.SignJWT({
    ...data,
    iss: ISSUER,
    sub,
  })
    .setIssuedAt()
    .setSubject(sub)
    .setIssuer(ISSUER)
    .setProtectedHeader({ alg: 'RS256' })

  if (expiresInSeconds) {
    jwt.setExpirationTime(`${expiresInSeconds} sec`)
  }

  return jwt.sign(ecPrivateKey)
}
