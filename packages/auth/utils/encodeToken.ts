import { signJwt } from './signJwt'

export const encodeToken = async (data: Readapt.TokenRegistry[keyof Readapt.TokenRegistry]) => {
  const token = await signJwt({ data })
  return token
}
