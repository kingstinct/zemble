import { ObjectId } from 'mongodb'

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
  test('should create an entity', async () => {
    const app = await plugin.testApp()

    const res = await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    })

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

    const res2 = await app.gqlRequestUntyped<{readonly books: readonly unknown[]}, unknown>('query { books { _id } }')

    expect(res2.data?.books).toEqual([])
  })
})
