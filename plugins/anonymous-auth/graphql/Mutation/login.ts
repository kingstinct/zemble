import { encodeToken } from '../../utils/typedToken'

export default (_: unknown, { username}:{ username: string }) => {
  const userId = Math.random().toString(36).substring(7)
  return { token: encodeToken({ userId, username }) }
}