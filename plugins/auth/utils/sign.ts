import * as jwt from 'jsonwebtoken'
import plugin from '../'

const { PRIVATE_KEY, ISSUER } = plugin.config

function signJwt<T extends object>({ data, expiresInSeconds }:{ data: T, expiresInSeconds?: number }) {
  if(!PRIVATE_KEY){
    throw new Error('PRIVATE_KEY is not set')
  }

  return {
    token: jwt.sign(
      data,
      PRIVATE_KEY,
      {
        algorithm: 'RS256',
        ...expiresInSeconds !== undefined ? { expiresIn: expiresInSeconds } : {},
        issuer: ISSUER,
      }) 
  }
} 

export default signJwt