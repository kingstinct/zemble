import { decodeToken } from '../../utils/typedToken'

export default (_:unknown, {token}:{token: string}) => {
  return decodeToken(token)
}