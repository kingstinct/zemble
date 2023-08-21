import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config'

export const verifyAuth = (token: string) => {
  return jwt.verify(token, JWT_SECRET) as {userId: string, username: string}
}