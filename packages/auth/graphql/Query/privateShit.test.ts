import { createTestApp } from '@zemble/core/test-utils'
import { describe, it, expect } from 'bun:test'

import plugin from '../../plugin'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const PrivateShitQuery = graphql(`
  query PrivateShit {
    privateShit
  }
`)

describe('privateShit', () => {
  it('Should fail authentication', async () => {
    const app = await createTestApp(plugin)

    const response = await app.gqlRequest(PrivateShitQuery, {}, { silenceErrors: true })
    expect(response.errors?.[0]?.message).toEqual(`Accessing 'Query.privateShit' requires authentication.`)
  })

  it('Should succeed authentication', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: { }, sub: '1' })

    const response = await app.gqlRequest(PrivateShitQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.privateShit).toEqual(`private shit`)
  })
})
