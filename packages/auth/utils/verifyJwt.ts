import { GraphQLError } from 'graphql'
import * as jose from 'jose'

import plugin from '../plugin'

export async function verifyJwt(token: string, publicKey?: string) {
  try {
    const actualPublicKey = await jose.importSPKI(publicKey ?? plugin.config.PUBLIC_KEY as string, 'RS256')

    const decodedToken = await jose.jwtVerify(token, actualPublicKey)
    return decodedToken.payload
  } catch (e) {
    if (e instanceof jose.errors.JOSEError) {
      throw new GraphQLError(`Invalid token: ${e.message}`)
    }
    throw e
  }
}
