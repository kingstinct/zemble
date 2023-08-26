import { GraphQLError } from 'graphql'

import plugin from '../..'
import signJwt from '../../utils/sign'

const { MAINTENANCE_SECRET } = plugin.config

export type DecodedMaintenanceToken = {
  readonly isMaintenanceKey: true
  readonly iat: number
  readonly iss: string
}

export default (_: unknown, { expiresInSeconds, maintenanceSecret }: { readonly maintenanceSecret: string, readonly expiresInSeconds?: number }) => {
  if (maintenanceSecret !== MAINTENANCE_SECRET) {
    throw new GraphQLError('Invalid maintenanceSecret')
  }

  return signJwt({ data: { isMaintenanceKey: true }, expiresInSeconds })
}
