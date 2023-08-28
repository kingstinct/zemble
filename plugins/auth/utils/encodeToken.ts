import { signJwt } from './signJwt'

export const encodeToken = (data: Readapt.TokenRegistry[keyof Readapt.TokenRegistry]) => signJwt({ data })
