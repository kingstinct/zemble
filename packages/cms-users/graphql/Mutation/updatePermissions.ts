import { GraphQLError } from 'graphql'
import { ObjectId } from 'mongodb'

import { PermissionType, User } from '../../clients/papr'

import type { MutationResolvers } from '../schema.generated'

export const updatePermissions: NonNullable<MutationResolvers['updatePermissions']> = async (_, { userId, permissions }, { decodedToken }) => {
  // @ts-expect-error fix sometime
  if (userId === decodedToken.id && permissions.some((p) => p.type === PermissionType.MANAGE_USERS)) {
    throw new GraphQLError('You cannot remove your own user-admin permission')
  }

  const result = await User.findOneAndUpdate({
    _id: new ObjectId(userId),
  }, {
    $set: {
      permissions: permissions.map((p) => ({
        type: p.type as PermissionType,
      })),
    },
  }, {
    returnDocument: 'after',
  })

  if (!result) throw new GraphQLError('User not found')

  return result
}

export default updatePermissions
