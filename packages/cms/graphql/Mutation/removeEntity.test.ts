import {
  beforeEach, test, expect, beforeAll, afterAll, afterEach,
} from 'bun:test'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import papr from '../../clients/papr'
import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { CreateEntityMutation } from '../../utils/testOperations'
import { graphql } from '../client.generated'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

const RemoveEntityMutation = graphql(`
  mutation RemoveEntity($name: String!) {
    removeEntity(name: $name)
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

test('should remove entity', async () => {
  const entititesBefore = await papr.Entities.find({})

  expect(entititesBefore).toHaveLength(1)

  const removeEntityRes = await app.gqlRequest(RemoveEntityMutation, {
    name: 'book',
  }, opts)

  expect(removeEntityRes.data?.removeEntity).toEqual(true)

  const entititesAfter = await papr.Entities.find({})

  expect(entititesAfter).toHaveLength(0)
})
