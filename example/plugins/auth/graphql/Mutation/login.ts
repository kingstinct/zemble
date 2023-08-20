import * as jwt from 'jsonwebtoken'
import { secret } from '../../secret'

export default (_, { title }) => {
  const userId = Math.random().toString(36).substring(7)
  return jwt.sign({ userId }, secret)
}