/* eslint-disable import/no-extraneous-dependencies */

import papr from './clients/papr'
import { mockAndReset } from './utils/fs'

import type { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server'

let mongodb: MongoMemoryServer | MongoMemoryReplSet | null = null

export const setupBeforeAll = async () => {
  mongodb = new ((await import('mongodb-memory-server')).MongoMemoryServer)()

  await mongodb!.start()

  const MONGO_URL = mongodb!.getUri()

  await papr.connect(MONGO_URL)

  await mockAndReset()
}

export const teardownAfterAll = async () => {
  await Promise.all([papr.disconnect()])

  if (mongodb) {
    await mongodb.stop({ doCleanup: true, force: true })
    mongodb = null
  }
}

export const tearDownAfterEach = async () => {
  if (papr.db) {
    const allCollections = await papr.db.collections()

    await Promise.all(allCollections?.map(async (c) => {
      await c.deleteMany({})
    }) ?? [])
  }
  await mockAndReset()
}
