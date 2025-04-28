import { createTestApp } from '@zemble/core/test-utils'
import { expect, describe, it } from 'bun:test'

import plugin from '../../plugin'
import { generateRefreshToken } from '../../utils/generateRefreshToken'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const RefreshTokenMutation = graphql(`
  mutation RefreshToken($bearerToken: String!, $refreshToken: String!) {
    refreshToken(bearerToken: $bearerToken, refreshToken: $refreshToken) {
      ... on NewTokenSuccessResponse {
        bearerToken
        refreshToken
      }
      ... on RefreshTokenInvalidError {
        message
      }
    }
  }
`)

describe('refreshToken', () => {
  it('Should fail with invalid tokens', async () => {
    const app = await createTestApp(plugin)

    const response = await app.gqlRequest(
      RefreshTokenMutation,
      { bearerToken: '1', refreshToken: '1' },
      { silenceErrors: true },
    )
    expect(response.errors?.[0]?.message).toEqual(`Invalid token: Invalid Compact JWS`)
  })

  it('Should succeed with valid tokens', async () => {
    plugin.configure({
      reissueBearerToken: async (contents) => ({
        ...contents,
      }),
    })
    const app = await createTestApp(plugin)

    const validBearerToken = await signJwt({ data: { role: 'admin', organisationId: '1' }, sub: '1' })
    const validRefreshToken = await generateRefreshToken({ sub: '1' })

    const response = await app.gqlRequest(
      RefreshTokenMutation,
      { bearerToken: validBearerToken, refreshToken: validRefreshToken },
    )

    expect(response.data?.refreshToken).toHaveProperty('bearerToken', expect.any(String))
    expect(response.data?.refreshToken).toHaveProperty('refreshToken', expect.any(String))
  })

  it('Should fail if refresh token is expired', async () => {
    plugin.configure({
      reissueBearerToken: async (contents) => ({
        ...contents,
      }),
    })
    const app = await createTestApp(plugin)

    const validBearerToken = await signJwt({ data: { role: 'admin', organisationId: '1' }, sub: '1', expiresInSeconds: -1 })
    const validRefreshToken = await generateRefreshToken({ sub: '1', expiresInSeconds: -1 })

    const response = await app.gqlRequest(
      RefreshTokenMutation,
      { bearerToken: validBearerToken, refreshToken: validRefreshToken },
      { silenceErrors: true },
    )

    expect(response.errors?.[0]?.message).toEqual(`Invalid token: "exp" claim timestamp check failed`)
  })

  it('Should succeed when bearer token is expired, but refresh token is still valid', async () => {
    plugin.configure({
      reissueBearerToken: async (contents) => ({
        ...contents,
      }),
    })
    const app = await createTestApp(plugin)

    const validBearerToken = await signJwt({ data: { role: 'admin', organisationId: '1' }, sub: '1', expiresInSeconds: -1 })
    const validRefreshToken = await generateRefreshToken({ sub: '1', expiresInSeconds: 1 })

    const response = await app.gqlRequest(
      RefreshTokenMutation,
      { bearerToken: validBearerToken, refreshToken: validRefreshToken },
    )

    expect(response.data?.refreshToken).toHaveProperty('bearerToken', expect.any(String))
    expect(response.data?.refreshToken).toHaveProperty('refreshToken', expect.any(String))
  })
})
