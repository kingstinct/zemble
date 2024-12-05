import {
  afterAll, afterEach, beforeAll, expect, mock, test,
} from 'bun:test'
import { ObjectId } from 'mongodb'

import MongoMigrationAdapterWithTransaction from './migration-adapter-with-transactions'
import plugin from './plugin'
import { setupBeforeAll, teardownAfterAll, tearDownAfterEach } from './test-setup'

beforeAll(setupBeforeAll)

afterAll(teardownAfterAll)

afterEach(tearDownAfterEach)

/* test('test', async () => {
  expect(1).toBe(1)
})

test('run migration', async () => {
  const mongodbPlugin = plugin
  const adapter = MongoMigrationAdapterWithTransaction({
    providers: mongodbPlugin.providers,
    collectionName: 'migrations',
  })
  await adapter.up('testing', async () => {
    // empty migration
  })

  const migrations = await mongodbPlugin.providers.mongodb?.db.collection('migrations').find().toArray()
  expect(migrations).toHaveLength(1)
  expect(migrations?.[0]).toStrictEqual(
    {
      name: 'testing',
      startedAt: expect.any(Date),
      _id: expect.any(ObjectId),
      completedAt: expect.any(Date),
      error: null,
    },
  )
})

test('run migration again', async () => {
  const mongodbPlugin = plugin
  const adapter = MongoMigrationAdapterWithTransaction({
    providers: mongodbPlugin.providers,
    collectionName: 'migrations',
  })
  await adapter.up('testing', async () => {
    // empty migration
  })

  const migrations = await mongodbPlugin.providers.mongodb?.db.collection('migrations').find().toArray()
  expect(migrations).toHaveLength(1)
  expect(migrations?.[0]).toStrictEqual(
    {
      name: 'testing',
      startedAt: expect.any(Date),
      _id: expect.any(ObjectId),
      completedAt: expect.any(Date),
      error: null,
    },
  )
}) */

test('run concurrent migrations', async () => {
  const mongodbPlugin = plugin
  const adapter = MongoMigrationAdapterWithTransaction({
    providers: mongodbPlugin.providers,
    collectionName: 'migrations',
  })
  const migrationRunner = mock(async () => {
    await new Promise((resolve) => { setTimeout(resolve, 100) })
  })

  const migration1 = adapter.up('testing', migrationRunner)

  const migration2 = adapter.up('testing', migrationRunner)

  await Promise.allSettled([migration1, migration2])

  const migrations = await mongodbPlugin.providers.mongodb?.db.collection('migrations').find().toArray()

  expect(migrations).toHaveLength(1)
  expect(migrationRunner).toHaveBeenCalledTimes(1)
  expect(migrations?.[0]).toStrictEqual(
    {
      name: 'testing',
      startedAt: expect.any(Date),
      _id: expect.any(ObjectId),
      completedAt: expect.any(Date),
      error: null,
    },
  )
})
