import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../config'

export default (_: unknown, { username}:{ username: string }) => {
  const userId = Math.random().toString(36).substring(7)
  return { token: jwt.sign({ userId, username }, JWT_SECRET) }
}