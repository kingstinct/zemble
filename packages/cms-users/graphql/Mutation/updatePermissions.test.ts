import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test'
import { signJwt } from '@zemble/auth/utils/signJwt'
import { createTestApp } from '@zemble/core/test-utils'
import { ObjectId } from 'mongodb'

import { PermissionType, User } from '../../clients/papr'
import plugin from '../../plugin'
import {
  setupBeforeAll,
  tearDownAfterEach,
  teardownAfterAll,
} from '../../test-setup'
import { graphql } from '../client-generated'

export const UpdatePermissionsMutation = graphql(`
  mutation UpdatePermissions($userId: ID!, $permissions: [PermissionInput!]!) {
    updatePermissions(userId: $userId, permissions: $permissions) {
      id
      permissions{
        type
      }
    }
  }
`)

beforeAll(setupBeforeAll)
afterEach(tearDownAfterEach)
afterAll(teardownAfterAll)

describe('Mutation.updatePermissions', () => {
  it('Should fail without permission', async () => {
    const app = await createTestApp(plugin)

    const { errors } = await app.gqlRequest(
      UpdatePermissionsMutation,
      { userId: 'abc', permissions: [{ type: PermissionType.DEVELOPER }] },
      { silenceErrors: true },
    )

    expect(errors?.[0]?.message).toEqual(
      `Accessing 'Mutation.updatePermissions' requires authentication.`,
    )
  })

  it('Should succeed', async () => {
    const app = await createTestApp(plugin)

    const userId = new ObjectId()

    await User.insertOne({
      email: 'example@example.com',
      lastLoginAt: new Date(),
      permissions: [],
      _id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const token = await signJwt({
      data: { permissions: ['manage-users'] },
      sub: 'test-id',
    })

    const { data } = await app.gqlRequest(
      UpdatePermissionsMutation,
      {
        userId: userId.toHexString(),
        permissions: [{ type: PermissionType.DEVELOPER }],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    expect(data?.updatePermissions.permissions).toEqual([
      {
        type: PermissionType.DEVELOPER,
      },
    ])
  })

  it('Should fail if user doesnt exist', async () => {
    const app = await createTestApp(plugin)

    const userId = '650302fb3593982221caf2e4'

    const token = await signJwt({
      data: { permissions: ['manage-users'] },
      sub: 'test-id',
    })

    const { errors } = await app.gqlRequest(
      UpdatePermissionsMutation,
      {
        userId,
        permissions: [{ type: PermissionType.DEVELOPER }],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        silenceErrors: true,
      },
    )

    expect(errors?.[0]?.message).toEqual('User not found')
  })

  // fix some other time
  it.skip('Should fail if removing user-admin permission from self', async () => {
    const app = await createTestApp(plugin)

    const userId = '650302fb3593982221caf2e4'

    // todo [>1]: invalidation mechanism, three options:
    // 1. invalidate all tokens (forcing re-login)
    // 2. refetch permissions on every request for older tokens
    // 3. implement some kind of refresh mechanism (getting a new token with the right permissions, but without logging
    // in again)
    const token = await signJwt({
      data: { permissions: [PermissionType.MANAGE_USERS], id: userId },
      sub: 'test-id',
    })

    const { errors } = await app.gqlRequest(
      UpdatePermissionsMutation,
      {
        userId,
        permissions: [{ type: PermissionType.MANAGE_USERS }],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        silenceErrors: true,
      },
    )

    expect(errors?.[0]?.message).toEqual(
      'You cannot remove your own user-admin permission',
    )
  })
})
