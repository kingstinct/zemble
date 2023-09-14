import { connect as connectCms, disconnect as disconnectCms } from 'readapt-plugin-cms/clients/papr'

import papr, { connect, disconnect } from './clients/papr'

import type { MongoMemoryServer } from 'mongodb-memory-server'

let mongodb: MongoMemoryServer | null = null

beforeAll(async () => {
  mongodb = new (require('mongodb-memory-server').MongoMemoryServer)()
  await mongodb!.start()
  const MONGO_URL = mongodb!.getUri()

  await connect(MONGO_URL)
  await connectCms(MONGO_URL)
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
  await Promise.all([
    disconnect(),
    disconnectCms(),
  ])

  if (mongodb) {
    await mongodb.stop()
    mongodb = null
  }
})
