import { createTestApp } from '@zemble/core/test-utils'
import { expect, describe, it } from 'bun:test'

import plugin from '../../plugin'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const PrivateShitWithRoleQuery = graphql(`
  query PrivateShitWithRole {
    privateShitWithRole
  }
`)

describe('PrivateShitWithRole', () => {
  it('Should fail authentication', async () => {
    const app = await createTestApp(plugin)

    const response = await app.gqlRequest(
      PrivateShitWithRoleQuery,
      {},
      { silenceErrors: true },
    )
    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.privateShitWithRole' requires authentication.`)
  })

  it('Should fail without role in JWT', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { }, sub: '1' })

    const response = await app.gqlRequest(PrivateShitWithRoleQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      silenceErrors: true,
    })
    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.privateShitWithRole' requires token matching {"role":"admin"}.`)
  })

  it('Should succeed with role in JWT', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { role: 'admin' }, sub: '1' })

    const response = await app.gqlRequest(PrivateShitWithRoleQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.privateShitWithRole).toEqual(`private shit`)
  })
})
