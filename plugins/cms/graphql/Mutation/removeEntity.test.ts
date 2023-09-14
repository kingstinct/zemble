import { signJwt } from 'readapt-plugin-auth/utils/signJwt'

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
  let opts: Record<string, unknown>

  beforeEach(async () => {
    app = await plugin.testApp()
    const token = signJwt({ data: { permissions: ['modify-entity'] } })
    opts = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    await app.gqlRequest(CreateEntityMutation, {
      name: 'book',
    }, opts)
  })

  test('should add a title field', async () => {
    const removeEntityRes = await app.gqlRequest(RemoveEntityMutation, {
      name: 'book',
    }, opts)

    expect(removeEntityRes.data?.removeEntity).toEqual(true)

    const entitites = await Entity.find({})

    expect(entitites).toEqual([])
  })
})
