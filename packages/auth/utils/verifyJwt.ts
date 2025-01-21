import { GraphQLError } from 'graphql'
import * as jose from 'jose'

import plugin from '../plugin'

export async function verifyJwt(token: string, publicKey?: string, opts?: jose.JWTVerifyOptions) {
  try {
    const actualKey = publicKey ?? plugin.config.PUBLIC_KEY ?? process.env['PUBLIC_KEY']

    if (!actualKey) {
      throw new GraphQLError('[@zemble/auth] Missing public key, specify it as an environment variable PUBLIC_KEY or in the plugin config to @zemble/auth')
    }

    const spkiKey = await jose.importSPKI(actualKey, 'RS256')

    const decodedToken = await jose.jwtVerify(token, spkiKey, opts)
    return decodedToken.payload
  } catch (e) {
    if (e instanceof jose.errors.JOSEError) {
      throw new GraphQLError(`Invalid token: ${e.message}`, {
        extensions: {
          code: e.code,
        },
      })
    }
    throw e
  }
}
