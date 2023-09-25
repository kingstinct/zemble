import { verifyJwt } from './verifyJwt'

export const decodeToken = async (token: string) => {
  const decodedToken = await verifyJwt(token) as { readonly payload: Readapt.TokenRegistry[keyof Readapt.TokenRegistry] }
  return decodedToken
}
