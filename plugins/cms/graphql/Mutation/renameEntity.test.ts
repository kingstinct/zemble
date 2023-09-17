import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { CreateEntityMutation } from './createEntity.test'
import { Entities } from '../../clients/papr'
import plugin from '../../plugin'
import { graphql } from '../client.generated'

const RenameEntityMutation = graphql(`
  mutation RenameEntity($fromName: String!,$toName: String!, $pluralizedName: String!) {
    renameEntity(fromName: $fromName, toName: $toName, pluralizedName: $pluralizedName) {
      name
      pluralizedName
    }
  }
`)

describe('renameEntity', () => {
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

  test('should rename an entity', async () => {
    const res = await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
      pluralizedName: 'books',
    }, opts)

    expect(res.data?.createEntity.name).toEqual('book')

    const { data } = await app.gqlRequest(RenameEntityMutation, {
      fromName: 'book',
      toName: 'article',
      pluralizedName: 'articles',
    }, opts)

    expect(data?.renameEntity.name).toEqual('article')
    expect(data?.renameEntity.pluralizedName).toEqual('articles')

    const entitites = await Entities.find({})
    expect(entitites).toHaveLength(1)
    expect(entitites[0]).toEqual({
      _id: expect.any(ObjectId),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      name: 'article',
      pluralizedName: 'articles',
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
  })
})
