import {
  beforeEach, test, expect, beforeAll, afterAll, afterEach,
} from 'bun:test'
import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import papr from '../../clients/papr'
import plugin from '../../plugin'
import {
  setupBeforeAllRepl, tearDownAfterEach, teardownAfterAll,
} from '../../test-setup'
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

beforeAll(setupBeforeAllRepl)

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

// todo [>=1]: skipping because can't get replica set to work (clean up) on bun
test.skip('should rename an entity', async () => {
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

  const entitites = await papr.Entities.find({})
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
