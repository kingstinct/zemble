import { GraphQLError } from 'graphql'
import signJwt from '../../utils/sign'
import plugin from '../..'
const { MAINTENANCE_SECRET } = plugin.config

export type MaintenanceKeyData = {
  isMaintenanceKey: true
  iat: number
  iss: string
}

export default (_: unknown, { expiresInSeconds, maintenanceSecret }:{ maintenanceSecret: string, expiresInSeconds?: number }) => {
  if(maintenanceSecret !== MAINTENANCE_SECRET){
    throw new GraphQLError('Invalid maintenanceSecret')
  }
  
  return signJwt({ data: { isMaintenanceKey: true }, expiresInSeconds })
} 