import {
  beforeEach, test, expect,
} from 'bun:test'
import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { AddFieldsToEntityMutation } from './addFieldsToEntity.test'
import { Entities } from '../../clients/papr'
import plugin from '../../plugin'
import { CreateEntityMutation } from '../../utils/createEntityMutation'
import { graphql } from '../client.generated'

const RemoveFieldsFromEntityMutation = graphql(`
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

let app: Readapt.Server
let opts: Record<string, unknown>

beforeEach(async () => {
  app = await plugin.testApp()
  const token = await signJwt({ data: { permissions: [{ type: 'modify-entity' }] } })
  opts = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  await app.gqlRequest(CreateEntityMutation, {
    name: 'book',
    pluralizedName: 'books',
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

  const { data } = await app.gqlRequest(RemoveFieldsFromEntityMutation, {
    name: 'book',
    fields: ['title'],
  }, opts)

  expect(data?.removeFieldsFromEntity).toEqual({
    name: 'book',
    fields: [
      {
        __typename: 'IDField',
        name: 'id',
      },
    ],
  })

  const entitites = await Entities.find({})

  expect(entitites).toEqual([
    {
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
    },
  ])
})
