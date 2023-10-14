import {
  beforeEach, test, expect, describe, afterEach, afterAll, beforeAll,
} from 'bun:test'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { CreateEntityMutation } from '../../utils/testOperations'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

describe('Mutation.createEntity', () => {
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

  test('should create an entity', async () => {
    const res = await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
      pluralizedName: 'books',
    }, opts)

    expect(res.data?.createEntity.name).toEqual('book')

    const entities = await readEntities()

    expect(entities).toHaveLength(1)
    expect(entities[0]).toEqual({
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
      },
    })

    await new Promise((resolve) => { setTimeout(resolve, 100) })

    const { data } = await app.gqlRequestUntyped<{readonly getAllBooks: readonly unknown[]}, unknown>('query { getAllBooks { id } }', {}, opts)

    expect(data?.getAllBooks).toEqual([])
  })
})
