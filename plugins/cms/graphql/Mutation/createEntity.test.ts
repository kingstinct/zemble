import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { Entity } from '../../clients/papr'
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
    const token = signJwt({ data: { permissions: ['modify-entity'] } })
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

    const entitites = await Entity.find({})

    expect(entitites).toHaveLength(1)
    expect(entitites[0]).toEqual({
      _id: expect.any(ObjectId),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'book',
      fields: {
        _id: {
          __typename: 'IDField',
          isRequired: true,
          name: '_id',
        },
      },
    })

    const res2 = await app.gqlRequestUntyped<{readonly books: readonly unknown[]}, unknown>('query { books { _id } }', {}, opts)

    expect(res2.data?.books).toEqual([])
  })
})
