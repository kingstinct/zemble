import {
  beforeEach, test, expect, describe, afterEach, afterAll,
} from 'bun:test'
import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { Entities } from '../../clients/papr'
import plugin from '../../plugin'
import { CreateEntityMutation } from '../../utils/createEntityMutation'

describe('Mutation.createEntity', () => {
  let app: Readapt.Server
  let opts: Record<string, unknown>

  beforeEach(async () => {
    console.log('beforeEach', process.env.NODE_ENV)
    app = await plugin.testApp()
    const token = await signJwt({ data: { permissions: [{ type: 'modify-entity' }] } })
    opts = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  })

  afterAll(() => {
    console.log('afterAll!!')
  })

  afterEach(() => {
    console.log('afterEach', process.env.NODE_ENV)
  })

  test('should create an entity', async () => {
    const res = await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
      pluralizedName: 'books',
    }, opts)

    expect(res.data?.createEntity.name).toEqual('book')

    const entitites = await Entities.find({})

    console.log('entitites', entitites)

    expect(entitites).toHaveLength(1)
    expect(entitites[0]).toEqual({
      _id: expect.any(ObjectId),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'book',
      pluralizedName: 'books',
      isPublishable: false,
      fields: {
        id: {
          __typename: 'IDField',
          isRequired: true,
          isRequiredInput: false,
          name: 'id',
        },
      },
    })

    const { data } = await app.gqlRequestUntyped<{readonly getAllBooks: readonly unknown[]}, unknown>('query { getAllBooks { id } }', {}, opts)

    expect(data?.getAllBooks).toEqual([])
  })
})
