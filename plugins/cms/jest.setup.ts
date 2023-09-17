import papr, { connect, disconnect } from './clients/papr'

import type { MongoMemoryReplSet } from 'mongodb-memory-server'

let mongodb: MongoMemoryReplSet | null = null

beforeAll(async () => {
  mongodb = new (require('mongodb-memory-server').MongoMemoryReplSet)()
  await mongodb!.start()
  // const replset = await mongodb.create({ replSet: { count: 4 } }); // This will create an ReplSet with 4 members
  const MONGO_URL = mongodb!.getUri()

  await connect(MONGO_URL)
})

afterEach(async () => {
  if (papr.db) {
    const allCollections = await papr.db.collections()

    await Promise.all(allCollections.map(async (c) => {
      await c.deleteMany({})
    }))
  }
})

afterAll(async () => {
  await Promise.all([disconnect()])

  if (mongodb) {
    await mongodb.stop()
    mongodb = null
  }
})
