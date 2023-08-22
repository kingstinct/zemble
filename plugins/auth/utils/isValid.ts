import {verify} from 'jsonwebtoken'
import { PUBLIC_KEY } from '../config'
import { MaintenanceKeyData } from '../graphql/Mutation/generateMaintenanceKey'

export const isValid = (token: string, publicKey?: string) => {
  const actualPublicKey = publicKey ?? PUBLIC_KEY
  if(!actualPublicKey){
    throw new Error('PUBLIC_KEY not set')
  }

  return verify(token, actualPublicKey, { algorithms: ['RS256'] })
}

export const isValidMaintenanceKey = (token: string) => {
  const keyIsValid = isValid(token) as MaintenanceKeyData

  return !!keyIsValid.isMaintenanceKey
}