import {
  beforeEach, test, expect, afterAll, afterEach, beforeAll,
} from 'bun:test'
import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { AddFieldsToEntityMutation, CreateEntityMutation } from '../../utils/testOperations'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

// todo [>1]: add tests for required-checks/migration

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

test('should add a title field', async () => {
  const addFieldsToEntityRes = await app.gqlRequest(AddFieldsToEntityMutation, {
    name: 'book',
    fields: [
      {
        StringField: {
          name: 'title',
          isRequired: true,
          isRequiredInput: false,
        },
      },
    ],
  }, opts)

  expect(addFieldsToEntityRes.data).toEqual({
    addFieldsToEntity: {
      name: 'book',
    },
  })

  const entities = await readEntities()

  expect(entities).toEqual([
    {
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
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
        title: {
          __typename: 'StringField',
          isRequired: true,
          isRequiredInput: false,
          isSearchable: false,
          name: 'title',
        },
      },
    },
  ])
})
