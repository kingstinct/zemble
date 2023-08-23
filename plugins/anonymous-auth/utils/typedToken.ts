import {isValid} from 'readapt-plugin-auth/utils/isValid'
import signJwt from 'readapt-plugin-auth/utils/sign'

type DecodedToken = { userId: string, username: string }

export const decodeToken = (token: string) => {
  const {userId, username} = isValid<DecodedToken>(token)
  return {userId, username}
}

export const encodeToken = (data: DecodedToken) => {
  return signJwt<DecodedToken>({data })
}