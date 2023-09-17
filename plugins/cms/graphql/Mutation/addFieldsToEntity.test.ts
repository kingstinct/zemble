import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { CreateEntityMutation } from './createEntity.test'
import { Entities } from '../../clients/papr'
import plugin from '../../plugin'
import { graphql } from '../client.generated'

import type { AddFieldsToEntityMutation as AddFieldsToEntityMutationType } from '../client.generated/graphql'

// eslint-disable-next-line jest/no-export
export const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(entityName: $name, fields: $fields) {
      name
    }
  }
`)

describe('addFieldsToEntity', () => {
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

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    }, opts)
  })

  test('should add a title field', async () => {
    const addFieldsToEntityRes = await app.gqlRequest(AddFieldsToEntityMutation, {
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

    expect(addFieldsToEntityRes.data).toEqual<AddFieldsToEntityMutationType>({
      addFieldsToEntity: {
        name: 'book',
      },
    })

    const entitites = await Entities.find({})

    expect(entitites).toEqual([
      {
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
          title: {
            __typename: 'StringField',
            isRequired: true,
            name: 'title',
          },
        },
      },
    ])
  })
})
