import { verifyJwt } from './verifyJwt'

export const decodeToken = (token: string) => {
  const decodedToken = verifyJwt(token)
  return decodedToken
}
