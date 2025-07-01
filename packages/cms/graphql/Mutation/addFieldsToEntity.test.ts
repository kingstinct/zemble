import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'bun:test'
import { signJwt } from '@zemble/auth/utils/signJwt'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { AddFieldsToEntityMutation, CreateEntityMutation } from '../../utils/testOperations'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

// todo [>1]: add tests for required-checks/migration

let app: Zemble.App
let opts: Record<string, unknown>

beforeEach(async () => {
  app = await createTestApp(plugin)
  const token = await signJwt({ data: { permissions: ['developer'] }, sub: '1' })
  opts = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  await app.gqlRequest(
    CreateEntityMutation,
    {
      nameSingular: 'book',
      namePlural: 'books',
    },
    opts,
  )
})

test('should add a title field', async () => {
  const addFieldsToEntityRes = await app.gqlRequest(
    AddFieldsToEntityMutation,
    {
      namePlural: 'books',
      fields: [
        {
          StringField: {
            name: 'title',
            isRequired: true,
            isRequiredInput: false,
          },
        },
      ],
    },
    opts,
  )

  expect(addFieldsToEntityRes.data).toEqual({
    addFieldsToEntity: {
      nameSingular: 'book',
      namePlural: 'books',
    },
  })

  const entities = await readEntities()

  expect(entities).toEqual([
    {
      nameSingular: 'book',
      namePlural: 'books',
      isPublishable: false,
      fields: [
        {
          __typename: 'IDField',
          isRequired: true,
          isRequiredInput: false,
          name: 'id',
        },
        {
          __typename: 'StringField',
          isRequired: true,
          isRequiredInput: false,
          isSearchable: false,
          name: 'title',
        },
      ],
    },
  ])
})
