import { signJwt } from './signJwt'

export const encodeToken = async (data: Zemble.TokenRegistry[keyof Zemble.TokenRegistry]) => {
  const token = await signJwt({ data })
  return token
}
