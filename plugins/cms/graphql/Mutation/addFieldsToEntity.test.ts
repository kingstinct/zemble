import { ObjectId } from 'mongodb'

import { CreateEntityMutation } from './createEntity.test'
import { Entity } from '../../clients/papr'
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

  beforeEach(async () => {
    app = (await plugin.devApp()).app

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    })
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
    })

    expect(addFieldsToEntityRes.data).toEqual<AddFieldsToEntityMutationType>({
      addFieldsToEntity: {
        name: 'book',
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
