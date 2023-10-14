import {
  beforeEach, test, expect, describe, afterEach, afterAll, beforeAll,
} from 'bun:test'
import { signJwt } from 'zemble-plugin-auth/utils/signJwt'

import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { CreateEntityMutation } from '../../utils/testOperations'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

describe('Mutation.createEntity', () => {
  let app: Zemble.Server
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
      nameSingular: 'book',
      namePlural: 'books',
    }, opts)

    expect(res.data?.createEntity.nameSingular).toEqual('book')

    const entities = await readEntities()

    expect(entities).toHaveLength(1)
    expect(entities[0]).toEqual({
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
      ],
    })

    await new Promise((resolve) => { setTimeout(resolve, 100) })

    const { data } = await app.gqlRequestUntyped<{readonly getAllBooks: readonly unknown[]}, unknown>('query { getAllBooks { id } }', {}, opts)

    expect(data?.getAllBooks).toEqual([])
  })

  test('should create a second entity', async () => {
    await app.gqlRequest(CreateEntityMutation, {
      nameSingular: 'book',
      namePlural: 'books',
    }, opts)

    const res = await app.gqlRequest(CreateEntityMutation, {
      nameSingular: 'article',
      namePlural: 'articles',
    }, opts)

    expect(res.data?.createEntity.nameSingular).toEqual('article')

    const entities = await readEntities()

    expect(entities).toHaveLength(2)
    expect(entities[1]).toEqual({
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

    await new Promise((resolve) => { setTimeout(resolve, 100) })

    const { data } = await app.gqlRequestUntyped<{readonly getAllArticles: readonly unknown[]}, unknown>('query { getAllArticles { id } }', {}, opts)

    expect(data?.getAllArticles).toEqual([])
  })
})
