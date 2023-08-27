import { signJwt } from './signJwt'

export const encodeToken = (data: Readapt.TokenContents) => signJwt({ data })
