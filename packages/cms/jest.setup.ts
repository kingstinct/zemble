import {
  beforeAll, afterAll, afterEach,
} from 'bun:test'

import papr, { connect, disconnect } from './clients/papr'

import type { MongoMemoryReplSet } from 'mongodb-memory-server'

let mongodb: MongoMemoryReplSet | null = null

beforeAll(async () => {
  console.log('beforeAll')
  mongodb = new (require('mongodb-memory-server').MongoMemoryReplSet)()
  await mongodb!.start()
  const MONGO_URL = mongodb!.getUri()

  await connect(MONGO_URL)
})

afterAll(async () => {
  console.log('afterAll')
  await Promise.all([disconnect()])
  console.log('afterAll 2')

  if (mongodb) {
    console.log('afterAll 3')
    await mongodb.stop()
    console.log('afterAll 4')
    mongodb = null
  }
})

afterEach(async () => {
  console.log('afterEach')
  if (papr.db) {
    console.log('afterEach 2')
    const allCollections = await papr.db.collections()

    console.log('afterEach 3')

    await Promise.all(allCollections.map(async (c) => {
      await c.deleteMany({})
    }))

    console.log('afterEach 4')
  }

  console.log('afterEach 5')
})
