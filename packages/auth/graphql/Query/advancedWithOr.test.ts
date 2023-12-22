import { createTestApp } from '@zemble/core'
import { expect, describe, it } from 'bun:test'

import plugin from '../../plugin'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const AdvancedWithOrQuery = graphql(`
  query advancedWithOr($organisationId: String!) {
    advancedWithOr(organisationId: $organisationId)
  }
`)

describe('advancedWithOr', () => {
  it('Should fail authentication', async () => {
    const app = await createTestApp(plugin)

    const response = await app.gqlRequest(
      AdvancedWithOrQuery,
      { organisationId: '123' },
      { silenceErrors: true },
    )

    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.advancedWithOr' requires authentication.`)
  })

  it('Should fail without array', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token' } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      silenceErrors: true,
    })

    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.advancedWithOr' requires token including arrays matching one of [{"includes":{"roles":{"role":"admin","organisationId":"123"}}},{"includes":{"roles":{"role":"superadmin","organisationId":"123"}}}].`)
  })

  it('Should fail when roles array doesnt include the right role', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token', roles: [] } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      silenceErrors: true,
    })

    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.advancedWithOr' requires token including arrays matching one of [{"includes":{"roles":{"role":"admin","organisationId":"123"}}},{"includes":{"roles":{"role":"superadmin","organisationId":"123"}}}].`)
  })

  it('Should succeed when the role includes admin role', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token', roles: [{ role: 'admin', organisationId: '123' }] } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.data?.advancedWithOr).toEqual(`private shit`)
  })

  it('Should succeed when the role includes superadmin role', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token', roles: [{ role: 'admin', organisationId: '123' }] } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.data?.advancedWithOr).toEqual(`private shit`)
  })

  it('Should succeed when the role includes superadmin and admin role', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token', roles: [{ role: 'admin', organisationId: '123' }, { role: 'superadmin', organisationId: '123' }] } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.data?.advancedWithOr).toEqual(`private shit`)
  })

  it('Should succeed when the role includes superadmin (and admin role for other org)', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token', roles: [{ role: 'admin', organisationId: '123' }, { role: 'superadmin', organisationId: '1234' }] } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(response.data?.advancedWithOr).toEqual(`private shit`)
  })

  it('Should fail when the role includes superadmin and admin role for the wrong organization', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { type: 'user-token', roles: [{ role: 'admin', organisationId: '1234' }, { role: 'superadmin', organisationId: '1234' }] } })

    const response = await app.gqlRequest(AdvancedWithOrQuery, { organisationId: '123' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      silenceErrors: true,
    })

    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.advancedWithOr' requires token including arrays matching one of [{"includes":{"roles":{"role":"admin","organisationId":"123"}}},{"includes":{"roles":{"role":"superadmin","organisationId":"123"}}}].`)
  })
})
