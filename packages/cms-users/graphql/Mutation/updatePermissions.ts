import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'

import { PermissionType, User } from '../../clients/papr'

import type { MutationResolvers } from '../schema.generated'

const updatePermissions: MutationResolvers['updatePermissions'] = async (_, { userId, permissions }, { decodedToken }) => {
  if (userId === decodedToken.id && !permissions.some((p) => p.type === PermissionType.USER_ADMIN)) {
    throw new GraphQLError('You cannot remove your own user-admin permission')
  }

  const result = await User.findOneAndUpdate({
    _id: new ObjectId(userId),
  }, {
    $set: {
      permissions: permissions.map((p) => ({
        type: p.type as PermissionType,
        scope: p.scope,
      })),
    },
  }, {
    returnDocument: 'after',
  })

  if (!result) throw new GraphQLError('User not found')

  return result
}

export default updatePermissions
