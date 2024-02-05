import { ObjectId } from 'mongodb'

import { cacheKeyFn, getOptimalProjection } from './createMongoDataLoader'

describe('MongoDataLoader', () => {
  test('cacheKeyFn should handle null projections', () => {
    const objectId = new ObjectId()
    expect(cacheKeyFn({ _id: objectId, projection: null })).toEqual(`${objectId.toHexString()}#null`)
  })

  test('cacheKeyFn should handle projections', () => {
    const objectId = new ObjectId()
    expect(cacheKeyFn<{ readonly _id: ObjectId, readonly myProjection: 1 }>({
      _id: objectId,
      projection: {
        myProjection: 1,
      },
    })).toEqual(`${objectId.toHexString()}#{"myProjection":1}`)
  })

  test('Should include all projection properties', () => {
    const objectId = new ObjectId()
    const { projection } = getOptimalProjection([
      { _id: objectId, projection: { myProjection: 1 } },
      { _id: objectId, projection: { anotherProjection: 1 } },
      { _id: objectId, projection: { anotherProjection: 1 } },
    ])

    expect(projection).toEqual({ anotherProjection: 1, myProjection: 1 })
  })

  test('Should get all objectIds', () => {
    const objectId = new ObjectId()
    const objectId2 = new ObjectId()
    const objectId3 = new ObjectId()
    const objectId4 = new ObjectId()
    const { $in } = getOptimalProjection([
      { _id: objectId, projection: { myProjection: 1 } },
      { _id: objectId2, projection: { anotherProjection: 1 } },
      { _id: objectId3, projection: { anotherProjection: 1 } },
      { _id: objectId4, projection: null },
    ])

    expect($in).toEqual([
      objectId,
      objectId2,
      objectId3,
      objectId4,
    ])
  })

  test('Should set null if there is a missing projection', () => {
    const objectId = new ObjectId()
    const { projection } = getOptimalProjection([
      { _id: objectId, projection: null },
      { _id: objectId, projection: { anotherProjection: 1 } },
      { _id: objectId, projection: { anotherProjection: 1 } },
    ])

    expect(projection).toEqual(null)
  })

  test('Should swallow granular projections when there is a more inclusive one', () => {
    const objectId = new ObjectId()
    const { projection } = getOptimalProjection([
      { _id: objectId, projection: { anotherProjection: 1 } },
      { _id: objectId, projection: { 'anotherProjection.swallowed': 1 } },
    ])

    expect(projection).toEqual({ anotherProjection: 1 })
  })
})
