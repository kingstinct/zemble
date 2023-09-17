import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { Entities } from '../../clients/papr'
import plugin from '../../plugin'
import { graphql } from '../client.generated'

// eslint-disable-next-line jest/no-export
export const CreateEntityMutation = graphql(`
  mutation CreateEntity($name: String!) {
    createEntity(name: $name) {
      name
    }
  }
`)

describe('createEntity', () => {
  let app: Readapt.Server
  let opts: Record<string, unknown>

  beforeEach(async () => {
    app = await plugin.testApp()
    const token = signJwt({ data: { permissions: [{ type: 'modify-entity' }] } })
    opts = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  })

  test('should create an entity', async () => {
    const res = await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    }, opts)

    expect(res.data?.createEntity.name).toEqual('book')

    const entitites = await Entities.find({})

    expect(entitites).toHaveLength(1)
    expect(entitites[0]).toEqual({
      _id: expect.any(ObjectId),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'book',
      pluralizedName: 'books',
      fields: {
        id: {
          __typename: 'IDField',
          isRequired: true,
          name: 'id',
        },
      },
    })

    const { data, errors } = await app.gqlRequestUntyped<{readonly getAllBooks: readonly unknown[]}, unknown>('query { getAllBooks { id } }', {}, opts)

    expect(data?.getAllBooks).toEqual([])
  })
})
