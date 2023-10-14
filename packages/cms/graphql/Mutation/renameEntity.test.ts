import {
  beforeEach, test, expect, beforeAll, afterAll, afterEach,
} from 'bun:test'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import plugin from '../../plugin'
import {
  setupBeforeAll,
  tearDownAfterEach, teardownAfterAll,
} from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { CreateEntityMutation } from '../../utils/testOperations'
import { graphql } from '../client.generated'

const RenameEntityMutation = graphql(`
  mutation RenameEntity($fromName: String!,$toName: String!, $pluralizedName: String!) {
    renameEntity(fromName: $fromName, toName: $toName, pluralizedName: $pluralizedName) {
      name
      pluralizedName
    }
  }
`)

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

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
})

test('should rename an entity', async () => {
  const res = await app.gqlRequest(CreateEntityMutation, {
    name: 'book',
    pluralizedName: 'books',
  }, opts)

  expect(res.data?.createEntity.name).toEqual('book')

  const { data } = await app.gqlRequest(RenameEntityMutation, {
    fromName: 'books',
    toName: 'article',
    pluralizedName: 'articles',
  }, opts)

  expect(data?.renameEntity.name).toEqual('article')
  expect(data?.renameEntity.pluralizedName).toEqual('articles')

  const entitites = await readEntities()
  expect(entitites).toHaveLength(1)
  expect(entitites[0]).toEqual({
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
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
