import { Entity } from '../../clients/papr'
import plugin from '../../plugin'
import { graphql } from '../client.generated'

const CreateEntityMutation = graphql(`
  mutation CreateEntity($name: String!) {
    createEntity(name: $name) {
      name
    }
  }
`)

describe('createEntity', () => {
  test('should create an entity', async () => {
    const { app } = await plugin.devApp()

    const res = await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    })

    expect(res.data?.createEntity.name).toEqual('book')

    const entitites = await Entity.find({})

    expect(entitites).toHaveLength(1)

    const res2 = await app.gqlRequestUntyped<{readonly books: readonly unknown[]}, unknown>('query { books { _id } }')

    expect(res2.data?.books).toEqual([])
  })
})
