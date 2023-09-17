import { ObjectId } from 'mongodb'
import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

import { Content } from './clients/papr'
import { AddFieldsToEntityMutation } from './graphql/Mutation/addFieldsToEntity.test'
import { CreateEntityMutation } from './graphql/Mutation/createEntity.test'
import plugin from './plugin'

describe('createEntity', () => {
  let app: Readapt.Server
  let opts: Record<string, unknown>

  beforeEach(async () => {
    app = await plugin.testApp()
    const token = signJwt({ data: { permissions: [{ type: 'modify-entity' }] } })
    opts = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    }, opts)

    await app.gqlRequest(CreateEntityMutation, {
      name: 'author',
    }, opts)

    await app.gqlRequest(AddFieldsToEntityMutation, {
      name: 'book',
      fields: [
        {
          StringField: {
            name: 'title',
            isRequired: true,
          },
        },
        {
          ArrayField: {
            name: 'contributors',
            availableFields: [
              {
                EntityRelationField: {
                  entityName: 'author',
                  name: 'author',
                  isRequired: true,
                },
              },
              {
                EntityRelationField: {
                  entityName: 'author',
                  name: 'editor',
                  isRequired: true,
                },
              },
            ],
          },
        },
      ],
    }, opts)

    await app.gqlRequest(AddFieldsToEntityMutation, {
      name: 'author',
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

    const entityEntry = await Content.find({})

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

  test('should create a book with authors', async () => {
    type CreateAuthorMutationType = {
      readonly createAuthor: {
        readonly id: string
      }
    }
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

    const entityEntry = await Content.find({})

    expect(entityEntry).toEqual([
      {
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        entityType: 'author',
        firstName: 'J.R.R.',
        lastName: 'Tolkien',
        updatedAt: expect.any(Date),
      },
      {
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        entityType: 'author',
        firstName: 'Christopher',
        lastName: 'Tolkien',
        updatedAt: expect.any(Date),
      },
      {
        _id: expect.any(ObjectId),
        createdAt: expect.any(Date),
        entityType: 'book',
        title: 'Silmarillion',
        contributors: [
          {
            __typename: 'BookContributorsAuthor',
            author: {
              __typename: 'AuthorRelation',
              externalId: expect.any(String),
            },
          },
          {
            __typename: 'BookContributorsEditor',
            editor: {
              __typename: 'AuthorRelation',
              externalId: expect.any(String),
            },
          },
        ],
        updatedAt: expect.any(Date),
      },
    ])
  })
})
