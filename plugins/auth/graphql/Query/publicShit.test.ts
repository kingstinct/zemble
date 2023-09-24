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
    const app = await plugin.testApp()

    const response = await app.gqlRequest(PublicShitQuery, {})
    expect(response.data?.publicShit).toEqual(`public shit`)
  })

  it('Should succeed authentication with token', async () => {
    const app = await plugin.testApp()

    const token = await signJwt({ data: { } })

    const response = await app.gqlRequest(PublicShitQuery, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.publicShit).toEqual(`public shit`)
  })
})
