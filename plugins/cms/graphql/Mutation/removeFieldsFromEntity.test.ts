import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { AddFieldsToEntityMutation } from './addFieldsToEntity.test'
import { CreateEntityMutation } from './createEntity.test'
import { Entity } from '../../clients/papr'
import plugin from '../../plugin'
import { graphql } from '../client.generated'

// eslint-disable-next-line jest/no-export
export const RemoveFieldsFromEntityMutation = graphql(`
  mutation RemoveFieldsFromEntity($name: String!, $fields: [String!]!) {
    removeFieldsFromEntity(entityName: $name, fields: $fields) {
      name
      fields {
        __typename
        name
      }
    }
  }
`)

describe('RemoveFieldsFromEntity', () => {
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

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    }, opts)
  })

  test('should remove a title field', async () => {
    await app.gqlRequest(AddFieldsToEntityMutation, {
      name: 'book',
      fields: [
        {
          StringField: {
            name: 'title',
            isRequired: true,
          },
        },
      ],
    }, opts)

    const removeFieldsFromEntityRes = await app.gqlRequest(RemoveFieldsFromEntityMutation, {
      name: 'book',
      fields: ['title'],
    }, opts)

    expect(removeFieldsFromEntityRes.data).toEqual({
      removeFieldsFromEntity: {
        name: 'book',
        fields: [
          {
            __typename: 'IDField',
            name: '_id',
          },
        ],
      },
    })

    const entitites = await Entity.find({})

    expect(entitites).toEqual([
      {
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
      },
    ])
  })
})
