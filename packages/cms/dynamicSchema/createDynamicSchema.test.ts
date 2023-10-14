import { signJwt } from 'zemble-plugin-auth/utils/signJwt'
import {
  expect, test, beforeEach, beforeAll, afterAll, afterEach,
} from 'bun:test'
import { ObjectId } from 'mongodb'

import papr from '../clients/papr'
import plugin from '../plugin'
import { setupBeforeAll, tearDownAfterEach, teardownAfterAll } from '../test-setup'
import { CreateEntityMutation, AddFieldsToEntityMutation } from '../utils/testOperations'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

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

  await app.gqlRequest(CreateEntityMutation, {
    nameSingular: 'book',
    namePlural: 'books',
  }, opts)

  await app.gqlRequest(CreateEntityMutation, {
    nameSingular: 'author',
    namePlural: 'authors',
  }, opts)

  await app.gqlRequest(AddFieldsToEntityMutation, {
    namePlural: 'books',
    fields: [
      {
        StringField: {
          name: 'title',
          isRequired: true,
          isSearchable: true,
        },
      },
      {
        StringField: {
          name: 'description',
          isRequired: false,
          isSearchable: true,
        },
      },
      {
        BooleanField: {
          name: 'hasKindleVersion',
          isRequiredInput: false,
          isRequired: true,
          defaultValue: true,
        },
      },
      {
        EntityRelationField: {
          name: 'yo',
          isRequiredInput: false,
          isRequired: true,
          entityNamePlural: 'test',
        },
      },
      {
        ArrayField: {
          name: 'contributors',
          availableFields: [
            {
              EntityRelationField: {
                entityNamePlural: 'authors',
                name: 'author',
                isRequired: true,
              },
            },
            {
              EntityRelationField: {
                entityNamePlural: 'authors',
                name: 'editor',
                isRequired: true,
              },
            },
          ],
        },
      },
    ],
  }, opts)

  await new Promise((resolve) => { setTimeout(resolve, 1000) })

  await app.gqlRequest(AddFieldsToEntityMutation, {
    namePlural: 'authors',
    fields: [
      {
        StringField: {
          name: 'firstName',
          isRequired: true,
        },
      },
      {
        StringField: {
          name: 'lastName',
          isRequired: true,
        },
      },
    ],
  }, opts)
})

test('should create a book', async () => {
  const createBookReq = await app.gqlRequestUntyped<{
    readonly books: readonly unknown[]
  }, unknown>('mutation { createBook(title: "Lord of the rings") { title } }', {}, opts)

  expect(createBookReq).toEqual({
    data: {
      createBook: {
        title: 'Lord of the rings',
      },
    },
  })

  const { data } = await app.gqlRequestUntyped<{
    readonly getAllBooks: readonly unknown[]
  }, unknown>('query { getAllBooks { title } }', {}, opts)

  expect(data?.getAllBooks).toEqual([
    {
      title: 'Lord of the rings',
    },
  ])

  const entityEntry = await (await papr.contentCollection('books')).find({})

  expect(entityEntry).toEqual([
    {
      _id: expect.any(ObjectId),
      createdAt: expect.any(Date),
      title: 'Lord of the rings',
      updatedAt: expect.any(Date),
    },
  ])
})

test('should get books by id', async () => {
  const createBookReq = await app.gqlRequestUntyped<{
    readonly createBook: {readonly id: string}
  }, unknown>('mutation { createBook(title: "Lord of the rings") { id } }', {}, opts)

  const silmarillionCreateBookReq = await app.gqlRequestUntyped<{
    readonly createBook: {readonly id: string}
  }, unknown>('mutation { createBook(title: "Simarillion") { id } }', {}, opts)

  const { data } = await app.gqlRequestUntyped<{
    readonly getBooksById: readonly unknown[]
  }, unknown>(`query GetBooksById($ids: [ID!]!) { getBooksById(ids: $ids) { title } }`, {
    ids: [
      createBookReq.data?.createBook?.id,
      silmarillionCreateBookReq.data?.createBook?.id,
    ],
  }, opts)

  expect(data?.getBooksById).toEqual([
    {
      title: 'Lord of the rings',
    },
    {
      title: 'Simarillion',
    },
  ])
})

test('should create a book with authors', async () => {
    type CreateAuthorMutationType = {
      readonly createAuthor: {
        readonly id: string
      }
    }

    // wait for schema to be updated
    await new Promise((resolve) => { setTimeout(resolve, 1000) })

    const { data: jrr } = await app.gqlRequestUntyped<CreateAuthorMutationType>(`mutation CreateAuthor { createAuthor(firstName: "J.R.R.", lastName: "Tolkien") { id, firstName, lastName } }`, {}, opts)
    const { data: christopher } = await app.gqlRequestUntyped<CreateAuthorMutationType>(`mutation CreateAuthor { createAuthor(firstName: "Christopher", lastName: "Tolkien") { id, firstName, lastName } } `, {}, opts)

    const createBookReq = await app.gqlRequestUntyped<{readonly books: readonly unknown[]}, unknown>(`mutation { 
      createBook(title: "Silmarillion", contributors: [
        { author: "${jrr?.createAuthor.id}" },
        { editor: "${christopher?.createAuthor.id}" },
      ])
      { 
        title
        contributors {
          __typename
          ... on BookContributorsAuthor {
            author {
              firstName
              lastName
            }
          }
          ... on BookContributorsEditor {
            editor {
              firstName
              lastName
            }
          }
        }
      } 
    }`, {}, opts)

    expect(createBookReq).toEqual({
      data: {
        createBook: {
          title: 'Silmarillion',
          contributors: [
            {
              __typename: 'BookContributorsAuthor',
              author: {
                firstName: 'J.R.R.',
                lastName: 'Tolkien',
              },
            },
            {
              __typename: 'BookContributorsEditor',
              editor: {
                firstName: 'Christopher',
                lastName: 'Tolkien',
              },
            },
          ],
        },
      },
    })

    const booksCollection = await papr.contentCollection('books')

    const books = await booksCollection.find({})

    const authorsCollection = await papr.contentCollection('authors')

    const authors = await authorsCollection.find({})

    expect(authors).toEqual([
      {
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        firstName: 'J.R.R.',
        lastName: 'Tolkien',
        updatedAt: expect.any(Date),
      },
      {
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        firstName: 'Christopher',
        lastName: 'Tolkien',
        updatedAt: expect.any(Date),
      },
    ])

    expect(books).toEqual([
      {
        _id: expect.any(ObjectId),
        contributors: [
          {
            __typename: 'BookContributorsAuthor',
            author: expect.any(String),
          },
          {
            __typename: 'BookContributorsEditor',
            editor: expect.any(String),
          },
        ],
        createdAt: expect.any(Date),
        title: 'Silmarillion',
        updatedAt: expect.any(Date),
      },
    ])
})

test('should search title field', async () => {
  await app.gqlRequestUntyped<{
    readonly books: readonly unknown[]
  }, unknown>('mutation { createBook(title: "Lord of the rings") { title } }', {}, opts)

  const results = await app.gqlRequestUntyped<{
    readonly searchBooks: readonly unknown[]
  }, unknown>('query { searchBooks(query: "Lord of") { title } }', {}, opts)

  expect(results.data).toEqual({
    searchBooks: [
      {
        title: 'Lord of the rings',
      },
    ],
  })
})

test('should filter on title field', async () => {
  await app.gqlRequestUntyped<{
    readonly books: readonly unknown[]
  }, unknown>('mutation { createBook(title: "Lord of the rings") { title } }', {}, opts)

  const results = await app.gqlRequestUntyped<{
    readonly filterBooks: readonly unknown[]
  }, unknown>('query { filterBooks(title: { eq: "Lord of the rings" }) { title } }', {}, opts)

  expect(results.data).toEqual({
    filterBooks: [
      {
        title: 'Lord of the rings',
      },
    ],
  })
})

test('should get default hasKindleVersion', async () => {
  await app.gqlRequestUntyped<{
    readonly books: readonly unknown[]
  }, unknown>('mutation { createBook(title: "Lord of the rings") { title } }', {}, opts)

  const results = await app.gqlRequestUntyped<{
    readonly searchBooks: readonly unknown[]
  }, unknown>('query { searchBooks(query: "Lord of") { title hasKindleVersion } }', {}, opts)

  expect(results.data).toEqual({
    searchBooks: [
      {
        title: 'Lord of the rings',
        hasKindleVersion: true,
      },
    ],
  })
})
