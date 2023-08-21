import * as jwt from 'jsonwebtoken'
import { secret } from '../../secret'

export default () => {
  const userId = Math.random().toString(36).substring(7)
  return jwt.sign({ userId }, secret)
}