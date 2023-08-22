import { Context } from 'hono'
import { createPublicKey } from 'crypto';
import * as jose from 'jose'
import { PUBLIC_KEY } from '../../config'

export default async ({json}: Context) => {
  if (!PUBLIC_KEY) {
    throw new Error('Missing PUBLIC_KEY')
  }
  
  const publicKeyObject = createPublicKey(PUBLIC_KEY);
  // @ts-ignore
  const publicJwk = await jose.exportJWK(publicKeyObject)
  return json(publicJwk)
} 