import * as jwt from 'jsonwebtoken'
import { secret } from '../secret'

export const verifyAuth = (token: string) => {
  return jwt.verify(token, secret) as {userId: string}
}