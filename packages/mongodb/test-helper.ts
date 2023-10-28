/* eslint-disable import/no-extraneous-dependencies */

import MongoDBPlugin from './plugin'

import type { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server'

let mongodb: MongoMemoryServer | MongoMemoryReplSet | null = null

export const startInMemoryInstance = async () => {
  try {
    const mdb = new ((await import('mongodb-memory-server')).MongoMemoryServer)()
    mongodb = mdb

    await mdb.start()

    return mdb.getUri()
  } catch (e) {
    throw new Error(`[@zemble/mongodb] setupAndConfigure failed, maybe you need to install mongodb-memory-server? ${e}`)
  }
}

export const startInMemoryInstanceAndConfigurePlugin = async () => {
  MongoDBPlugin.configure({
    url: await startInMemoryInstance(),
  })
}

export const closeAndStopInMemoryInstance = async () => {
  const db = MongoDBPlugin.providers.mongodb
  if (db) {
    await db.close()
  }
  if (mongodb) {
    await mongodb.stop({ doCleanup: true, force: true })
    mongodb = null
  }
}

export const emptyAllCollections = async () => {
  const db = MongoDBPlugin.providers.mongodb?.db()
  if (db) {
    const allCollections = await db.collections()

    await Promise.all(allCollections?.map(async (c) => {
      await c.deleteMany({})
    }) ?? [])
  }
}
