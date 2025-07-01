import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { signJwt } from '@zemble/auth/utils/signJwt'
import { createTestApp } from '@zemble/core/test-utils'
import wait from '@zemble/utils/wait'

import plugin from '../../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../../test-setup'
import { readEntities } from '../../utils/fs'
import { CreateEntityMutation } from '../../utils/testOperations'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

describe('Mutation.createEntity', () => {
  let app: Zemble.App
  let opts: Record<string, unknown>

  beforeEach(async () => {
    app = await createTestApp(plugin)
    const token = await signJwt({ data: { permissions: ['admin'] }, sub: '1' })
    opts = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  })

  test('should create an entity', async () => {
    const res = await app.gqlRequest(
      CreateEntityMutation,
      {
        nameSingular: 'book',
        namePlural: 'books',
      },
      opts,
    )

    expect(res.data?.createEntity.nameSingular).toEqual('book')

    await wait(100)

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

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    const { data } = await app.gqlRequestUntyped<{ readonly getAllBooks: readonly unknown[] }, unknown>('query { getAllBooks { id } }', {}, opts)

    expect(data?.getAllBooks).toEqual([])
  })

  test('should create a second entity', async () => {
    await app.gqlRequest(
      CreateEntityMutation,
      {
        nameSingular: 'book',
        namePlural: 'books',
      },
      opts,
    )

    const res = await app.gqlRequest(
      CreateEntityMutation,
      {
        nameSingular: 'article',
        namePlural: 'articles',
      },
      opts,
    )

    expect(res.data?.createEntity.nameSingular).toEqual('article')

    await wait(100)

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

    await new Promise((resolve) => {
      setTimeout(resolve, 100)
    })

    const { data } = await app.gqlRequestUntyped<{ readonly getAllArticles: readonly unknown[] }, unknown>('query { getAllArticles { id } }', {}, opts)

    expect(data?.getAllArticles).toEqual([])
  })
})
