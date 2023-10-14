/* eslint-disable import/no-extraneous-dependencies */
import cmsPapr from 'zemble-plugin-cms/clients/papr'

import papr, { connect, disconnect } from './clients/papr'

import type { MongoMemoryServer } from 'mongodb-memory-server'

let mongodb: MongoMemoryServer | null = null

export const setupBeforeAll = async () => {
  mongodb = new ((await import('mongodb-memory-server')).MongoMemoryServer)()

  await mongodb!.start()

  const MONGO_URL = mongodb!.getUri()

  await connect(MONGO_URL)
  await cmsPapr.connect(MONGO_URL)
}

export const teardownAfterAll = async () => {
  await Promise.all([disconnect(), cmsPapr.disconnect()])

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
}
