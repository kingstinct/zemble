import { signJwt } from '@zemble/auth/utils/signJwt'
import { createTestApp } from '@zemble/core/test-utils'
import {
  beforeEach, test, expect, beforeAll, afterAll, afterEach,
} from 'bun:test'

import plugin from '../../plugin'
import {
  setupBeforeAll,
  tearDownAfterEach, teardownAfterAll,
} from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { CreateEntityMutation } from '../../utils/testOperations'
import { graphql } from '../client.generated'

const RenameEntityMutation = graphql(`
  mutation RenameEntity($fromName: String!,$toName: String!, $namePlural: String!) {
    renameEntity(fromNamePlural: $fromName, toNameSingular: $toName, toNamePlural: $namePlural) {
      nameSingular
      namePlural
    }
  }
`)

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

let app: Zemble.App
let opts: Record<string, unknown>

beforeEach(async () => {
  app = await createTestApp(plugin)
  const token = await signJwt({ data: { permissions: [{ type: 'modify-entity' }] } })
  opts = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
})

test('should rename an entity', async () => {
  const res = await app.gqlRequest(CreateEntityMutation, {
    nameSingular: 'book',
    namePlural: 'books',
  }, opts)

  expect(res.data?.createEntity.nameSingular).toEqual('book')

  const { data } = await app.gqlRequest(RenameEntityMutation, {
    fromName: 'books',
    toName: 'article',
    namePlural: 'articles',
  }, opts)

  expect(data?.renameEntity.nameSingular).toEqual('article')
  expect(data?.renameEntity.namePlural).toEqual('articles')

  const entitites = await readEntities()
  expect(entitites).toHaveLength(1)
  expect(entitites[0]).toEqual({
    nameSingular: 'article',
    namePlural: 'articles',
    isPublishable: false,
    fields: [
      {
        __typename: 'IDField',
        isRequired: true,
        isRequiredInput: false,
        name: 'id',
      },
    ],
  })
})
