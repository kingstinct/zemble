import {verify} from 'jsonwebtoken'
import plugin from '../'
import { MaintenanceKeyData } from '../graphql/Mutation/generateMaintenanceKey'

const { MAINTENANCE_KEY_EXPIRE_BEFORE_IAT, PUBLIC_KEY } = plugin.config

export function isValid<T = unknown>(token: string, publicKey?: string) {
  const actualPublicKey = publicKey ?? PUBLIC_KEY
  if(!actualPublicKey){
    throw new Error('PUBLIC_KEY not set')
  }

  return verify(token, actualPublicKey, { algorithms: ['RS256'] }) as T
}

export const isValidMaintenanceKey = (token: string) => {
  const keyContents = isValid(token) as MaintenanceKeyData

  return !!keyContents.isMaintenanceKey && MAINTENANCE_KEY_EXPIRE_BEFORE_IAT < keyContents.iat
}