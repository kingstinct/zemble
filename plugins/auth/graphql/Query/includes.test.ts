import plugin from '../../plugin'
import { signJwt } from '../../utils/signJwt'
import { graphql } from '../client.generated'

const IncludesQuery = graphql(`
  query Includes($id: String!) {
    includes(organisationId: $id)
  }
`)

describe('Includes', () => {
  it('Should fail authentication', async () => {
    const { app } = await plugin.devApp()

    const response = await app.gqlRequest(IncludesQuery, { id: '1' })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.includes' requires authentication.`)
  })

  it('Should fail without right id in JWT', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { roles: [{ role: 'admin', organisationId: '2' }] } })

    const response = await app.gqlRequest(IncludesQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.includes' requires token including arrays matching {"roles":{"role":"admin","organisationId":"1"}}.`)
  })

  it('Should fail when trying to reference the exact variable literal', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { roles: [{ role: 'admin', organisationId: '$organisationId' }] } })

    const response = await app.gqlRequest(IncludesQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.includes' requires token including arrays matching {"roles":{"role":"admin","organisationId":"1"}}.`)
  })

  it('Should succeed with role in JWT', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { roles: [{ role: 'admin', organisationId: '1' }] } })

    const response = await app.gqlRequest(IncludesQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.includes).toEqual(`private shit`)
  })

  it('Should succeed with role in JWT as one of many', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { roles: [{ role: 'superuser', organisationId: '2' }, { role: 'admin', organisationId: '1' }, { role: 'superuser', organisationId: '3' }] } })

    const response = await app.gqlRequest(IncludesQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.includes).toEqual(`private shit`)
  })
})
