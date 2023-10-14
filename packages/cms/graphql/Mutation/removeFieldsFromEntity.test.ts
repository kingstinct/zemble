import {
  beforeEach, test, expect, beforeAll, afterAll, afterEach,
} from 'bun:test'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { AddFieldsToEntityMutation, CreateEntityMutation } from '../../utils/testOperations'
import { graphql } from '../client.generated'

beforeAll(setupBeforeAll)
afterAll(teardownAfterAll)
afterEach(tearDownAfterEach)

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

  const entitites = await readEntities()

  expect(entitites).toEqual([
    {
      name: 'book',
      pluralizedName: 'books',
      isPublishable: false,
      fields: [
        {
          __typename: 'IDField',
          isRequired: true,
          isRequiredInput: false,
          name: 'id',
        },
      ],
    },
  ])
})
