// eslint-disable-next-line import/no-extraneous-dependencies

import type { MigrationAdapter } from '@zemble/migrations'
import type { ClientSession } from 'mongodb'
import type { JsonValue } from 'type-fest'
import {
  acquireDownLock,
  acquireUpLock,
  getCollection,
} from './migration-adapter'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MigrationContext {
      readonly mongoSession: ClientSession
    }
  }
}

type Config = {
  readonly providers: Zemble.Providers
  readonly collectionName?: string
}

const getClient = (config: Config) => {
  const client = config.providers.mongodb?.client
  if (!client) throw new Error('MongoDB client not provided or initialized')
  return client
}

function MongoMigrationAdapterWithTransaction<
  TProgress extends JsonValue = JsonValue,
>(config: Config): MigrationAdapter<TProgress> {
  return {
    up: async (name, runMigration) => {
      const collection = await getCollection(config)
      await acquireUpLock(name, collection)

      const session = getClient(config).startSession()
      try {
        await session.withTransaction(async () => {
          await runMigration({ mongoSession: session })
          await collection.findOneAndUpdate(
            {
              name,
            },
            {
              $set: {
                name,
                completedAt: new Date(),
                error: null,
              },
            },
            { upsert: true, session },
          )
        })
      } catch (e) {
        await collection.findOneAndUpdate(
          {
            name,
          },
          {
            $set: {
              name,
              error: e instanceof Error ? e.message : JSON.stringify(e),
              erroredAt: new Date(),
            },
          },
          { upsert: true, session },
        )
        throw e
      } finally {
        await session.endSession()
      }
    },
    down: async (name, runMigration) => {
      const collection = await getCollection(config)

      await acquireDownLock(name, collection)

      const session = getClient(config).startSession()
      try {
        await session.withTransaction(async () => {
          await runMigration({ mongoSession: session })
          await collection.deleteOne({ name }, { session })
        })
      } catch (e) {
        await collection.findOneAndUpdate(
          {
            name,
          },
          {
            $set: {
              name,
              error: e instanceof Error ? e.message : JSON.stringify(e),
              erroredAt: new Date(),
            },
          },
          { upsert: true },
        )
        throw e
      } finally {
        await session.endSession()
      }
    },
    status: async () => {
      const collection = await getCollection<TProgress>(config)
      const res = await collection.find().toArray()

      return res
    },
    progress: async (migrationStatus) => {
      const collection = await getCollection(config)
      await collection.findOneAndUpdate(
        {
          name: migrationStatus.name,
        },
        {
          $set: {
            name: migrationStatus.name,
            progress: migrationStatus.progress,
          },
        },
        { upsert: true },
      )
    },
  }
}

export default MongoMigrationAdapterWithTransaction
