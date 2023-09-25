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
    console.log('test')
    const app = await plugin.testApp()
    console.log('test2')

    const response = await app.gqlRequest(PrivateShitQuery, {})
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.privateShit' requires authentication.`)
  })

  it('Should succeed authentication', async () => {
    console.log('test')
    const app = await plugin.testApp()
    console.log('test2')

    const token = await signJwt({ data: { } })

    const response = await app.gqlRequest(PrivateShitQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.privateShit).toEqual(`private shit`)
  })
})
