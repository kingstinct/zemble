import * as jwt from 'jsonwebtoken'
import { ISSUER, PRIVATE_KEY } from '../../config'

export default (_: unknown, { data, expiresInSeconds }:{ data: object, expiresInSeconds?: number }) => {
  if(!PRIVATE_KEY){
    throw new Error('PRIVATE_KEY is not set')
  }

  console.log('PRIVATE_KEY', PRIVATE_KEY)

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