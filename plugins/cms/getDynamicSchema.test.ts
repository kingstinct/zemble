import { ObjectId } from 'mongodb'

import { EntityEntry } from './clients/papr'
import { AddFieldsToEntityMutation } from './graphql/Mutation/addFieldsToEntity.test'
import { CreateEntityMutation } from './graphql/Mutation/createEntity.test'
import plugin from './plugin'

describe('createEntity', () => {
  let app: Readapt.Server

  beforeEach(async () => {
    app = (await plugin.devApp()).app

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    })

    await app.gqlRequest(AddFieldsToEntityMutation, {
      name: 'book',
      fields: [
        {
          StringField: {
            name: 'title',
            isRequired: true,
          },
        },
      ],
    })
  })

  test('should create a book', async () => {
    const createBookReq = await app.gqlRequestUntyped<{readonly books: readonly unknown[]}, unknown>('mutation { createBook(title: "Lord of the rings") { title } }')

    expect(createBookReq).toEqual({
      data: {
        createBook: {
          title: 'Lord of the rings',
        },
      },
    })

    const allBooks = await app.gqlRequestUntyped<{readonly books: readonly unknown[]}, unknown>('query { books { title } }')

    expect(allBooks.data).toEqual({
      books: [
        {
          title: 'Lord of the rings',
        },
      ],

    })

    const entityEntry = await EntityEntry.find({})

    expect(entityEntry).toEqual([
      {
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        entityType: 'book',
        title: 'Lord of the rings',
        updatedAt: expect.any(Date),
      },
    ])
  })
})
