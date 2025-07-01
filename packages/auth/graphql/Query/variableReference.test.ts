import { describe, expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const VariableReferenceQuery = graphql(`
  query VariableReference($id: String!) {
    variableReference(organisationId: $id)
  }
`)

describe('variableReference', () => {
  it('Should fail authentication', async () => {
    const app = await createTestApp(plugin)

    const response = await app.gqlRequest(VariableReferenceQuery, { id: '1' }, { silenceErrors: true })
    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.variableReference' requires authentication.`)
  })

  it('Should fail without right id in JWT', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { role: 'admin', organisationId: '2' }, sub: '1' })

    const response = await app.gqlRequest(
      VariableReferenceQuery,
      { id: '1' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        silenceErrors: true,
      },
    )
    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.variableReference' requires token matching {"role":"admin","organisationId":"1"}.`)
  })

  it('Should fail when trying to reference the exact variable literal', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { role: 'admin', organisationId: '$organisationId' }, sub: '1' })

    const response = await app.gqlRequest(
      VariableReferenceQuery,
      { id: '1' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        silenceErrors: true,
      },
    )
    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.variableReference' requires token matching {"role":"admin","organisationId":"1"}.`)
  })

  it('Should succeed with role in JWT', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { role: 'admin', organisationId: '1' }, sub: '1' })

    const response = await app.gqlRequest(
      VariableReferenceQuery,
      { id: '1' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    expect(response.data?.variableReference).toEqual(`private shit`)
  })
})
