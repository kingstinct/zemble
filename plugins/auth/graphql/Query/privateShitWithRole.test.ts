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
    const { app } = await plugin.devApp()

    const response = await app.gqlRequest(PrivateShitWithRoleQuery, {})
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.privateShitWithRole' requires authentication.`)
  })

  it('Should fail without role in JWT', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { } })

    const response = await app.gqlRequest(PrivateShitWithRoleQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.privateShitWithRole' requires token matching {"role":"admin"}.`)
  })

  it('Should succeed with role in JWT', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { role: 'admin' } })

    const response = await app.gqlRequest(PrivateShitWithRoleQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.privateShitWithRole).toEqual(`private shit`)
  })
})
