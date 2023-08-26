import { verify } from 'jsonwebtoken'

import signJwt from './sign'
import plugin from '..'

import type { DecodedMaintenanceToken } from '../graphql/Mutation/generateMaintenanceKey'

const { MAINTENANCE_KEY_EXPIRE_BEFORE_IAT, PUBLIC_KEY } = plugin.config

export function isValid<T = unknown>(token: string, publicKey?: string) {
  const actualPublicKey = publicKey ?? PUBLIC_KEY
  if (!actualPublicKey) {
    throw new Error('PUBLIC_KEY not set')
  }

  return verify(token, actualPublicKey, { algorithms: ['RS256'] }) as T
}

export const isValidMaintenanceKey = (token: string) => {
  const keyContents = isValid(token) as DecodedMaintenanceToken

  return !!keyContents.isMaintenanceKey && MAINTENANCE_KEY_EXPIRE_BEFORE_IAT < keyContents.iat
}

export const decodeToken = (token: string) => {
  const decodedToken = isValid<Readapt.DecodedToken>(token)
  return decodedToken
}

export const encodeToken = (data: Readapt.TokenContents) => signJwt<Readapt.TokenContents>({ data })
