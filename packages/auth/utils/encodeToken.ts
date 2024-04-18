import { signJwt } from './signJwt'

export const encodeToken = async (data: Zemble.TokenRegistry[keyof Zemble.TokenRegistry], sub: string) => {
  const token = await signJwt({ data, sub })
  return token
}
