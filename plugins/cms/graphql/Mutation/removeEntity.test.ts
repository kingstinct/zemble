import { CreateEntityMutation } from './createEntity.test'
import { Entity } from '../../clients/papr'
import plugin from '../../plugin'
import { graphql } from '../client.generated'

const RemoveEntityMutation = graphql(`
  mutation RemoveEntity($name: String!) {
    removeEntity(name: $name)
  }
`)

describe('addFieldsToEntity', () => {
  let app: Readapt.Server

  beforeEach(async () => {
    app = (await plugin.devApp()).app

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    })
  })

  test('should add a title field', async () => {
    const removeEntityRes = await app.gqlRequest(RemoveEntityMutation, {
      name: 'book',
    })

    expect(removeEntityRes.data?.removeEntity).toEqual(true)

    const entitites = await Entity.find({})

    expect(entitites).toEqual([])
  })
})
