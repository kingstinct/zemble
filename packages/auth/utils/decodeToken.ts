import { verifyJwt } from './verifyJwt'

export const decodeToken = async (token: string) => {
  const decodedToken = await verifyJwt(token) as {
    readonly payload: Zemble.TokenRegistry[keyof Zemble.TokenRegistry]
  }
  return decodedToken
}
