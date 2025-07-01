import { Context } from 'hono'
import * as jose from 'jose'
import plugin from '../..'

export default async ({ json }: Context) => {
  const { PUBLIC_KEY } = plugin.config
  if (!PUBLIC_KEY) {
    throw new Error('Missing PUBLIC_KEY')
  }

  const actualPublicKey = await jose.importSPKI(PUBLIC_KEY, 'RS256')
  // @ts-ignore
  const publicJwk = await jose.exportJWK(actualPublicKey)
  return json(publicJwk)
}
