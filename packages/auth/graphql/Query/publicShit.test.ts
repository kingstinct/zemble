import { describe, expect, it } from 'bun:test'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const PublicShitQuery = graphql(`
  query PublicShit {
    publicShit
  }
`)

describe('publicShit', () => {
  it('Should succeed authentication without token', async () => {
    const app = await createTestApp(plugin)

    const response = await app.gqlRequest(PublicShitQuery, {})
    expect(response.data?.publicShit).toEqual(`public shit`)
  })

  it('Should succeed authentication with token', async () => {
    const app = await createTestApp(plugin)

    const token = await signJwt({ data: {}, sub: '1' })

    const response = await app.gqlRequest(
      PublicShitQuery,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    expect(response.data?.publicShit).toEqual(`public shit`)
  })
})
