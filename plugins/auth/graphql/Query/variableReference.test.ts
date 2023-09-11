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
    const { app } = await plugin.devApp()

    const response = await app.gqlRequest(VariableReferenceQuery, { id: '1' })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.variableReference' requires authentication.`)
  })

  it('Should fail without right id in JWT', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { role: 'admin', organisationId: '2' } })

    const response = await app.gqlRequest(VariableReferenceQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.variableReference' requires token matching {"role":"admin","organisationId":"1"}.`)
  })

  it('Should fail when trying to reference the exact variable literal', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { role: 'admin', organisationId: '$organisationId' } })

    const response = await app.gqlRequest(VariableReferenceQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.errors?.[0].message).toEqual(`Accessing 'Query.variableReference' requires token matching {"role":"admin","organisationId":"1"}.`)
  })

  it('Should succeed with role in JWT', async () => {
    const { app } = await plugin.devApp()

    const token = signJwt({ data: { role: 'admin', organisationId: '1' } })

    const response = await app.gqlRequest(VariableReferenceQuery, { id: '1' }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(response.data?.variableReference).toEqual(`private shit`)
  })
})
