import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  test,
} from 'bun:test'
import { signJwt } from '@zemble/auth/utils/signJwt'
import { createTestApp } from '@zemble/core/test-utils'

import plugin from '../../plugin'
import {
  setupBeforeAll,
  tearDownAfterEach,
  teardownAfterAll,
} from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { CreateEntityMutation } from '../../utils/testOperations'
import { graphql } from '../client.generated'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

const RemoveEntityMutation = graphql(`
  mutation RemoveEntity($namePlural: String!) {
    removeEntity(namePlural: $namePlural)
  }
`)

let app: Zemble.App
let opts: Record<string, unknown>

beforeEach(async () => {
  app = await createTestApp(plugin)
  const token = await signJwt({ data: { permissions: ['admin'] }, sub: 'test' })
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

test('should remove entity', async () => {
  const entititesBefore = await readEntities()

  expect(entititesBefore).toHaveLength(1)

  const removeEntityRes = await app.gqlRequest(
    RemoveEntityMutation,
    {
      namePlural: 'books',
    },
    opts,
  )

  expect(removeEntityRes.data?.removeEntity).toEqual(true)

  const entititesAfter = await readEntities()

  expect(entititesAfter).toHaveLength(0)
})
