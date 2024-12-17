// eslint-disable-next-line import/no-extraneous-dependencies
import type { MigrationAdapter, MigrationStatus } from '@zemble/migrations'
import type { Collection } from 'mongodb'
import type { JsonValue } from 'type-fest'

type Config = { readonly providers: Zemble.Providers, readonly collectionName?: string }

export async function getCollection<TProgress extends JsonValue = JsonValue>(config: Config) {
  const db = config.providers.mongodb?.db
  if (!db) throw new Error('MongoDB client not provided or initialized')

  const collectionName = config.collectionName ?? 'migrations'

  await db.createIndex(collectionName, { name: 1 }, { unique: true })

  const collection = db.collection<MigrationStatus<TProgress>>(collectionName)
  return collection
}

export async function acquireUpLock<TProgress extends JsonValue = JsonValue>(name: string, collection: Collection<MigrationStatus<TProgress>>) {
  try {
    await collection.insertOne({
      name,
      startedAt: new Date(),
    })
  } catch (e) {
    const error = e instanceof Error && e.message.includes('duplicate key error')
      ? new Error(`Migration "${name}" (up) is already running`)
      : e

    throw error
  }
}

export const acquireDownLock = async <TProgress extends JsonValue = JsonValue>(name: string, collection: Collection<MigrationStatus<TProgress>>) => {
  try {
    const result = await collection.updateOne({
      name,
      startedDownAt: { $exists: false },
    }, {
      $set: {
        name,
        startedDownAt: new Date(),
      },
    })
    if (result.matchedCount === 0) {
      throw new Error(`Migration "${name}" (down) is already running`)
    }
  } catch (e) {
    const error = e instanceof Error && e.message.includes('duplicate key error')
      ? new Error(`Migration "${name}" (down) is already running`)
      : e

    throw error
  }
}

function MongoMigrationAdapter<TProgress extends JsonValue = JsonValue>(config: Config): MigrationAdapter<TProgress> {
  return {
    up: async (name, runMigration) => {
      const collection = await getCollection(config)
      await acquireUpLock(name, collection)

      try {
        await runMigration()
        await collection.findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            completedAt: new Date(),
            error: null,
          },
        }, { upsert: true })
      } catch (e) {
        await collection.findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            error: JSON.stringify(e),
            erroredAt: new Date(),
          },
        }, { upsert: true })
      }
    },
    down: async (name, runMigration) => {
      const collection = await getCollection(config)

      await acquireDownLock(name, collection)

      try {
        await runMigration()
        await collection.deleteOne({ name })
      } catch (e) {
        await collection.findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            error: JSON.stringify(e),
            erroredAt: new Date(),
          },
        }, { upsert: true })
      }
    },
    status: async () => {
      const collection = await getCollection<TProgress>(config)
      const res = await collection.find().toArray()

      return res
    },
    progress: async (migrationStatus) => {
      const collection = await getCollection(config)
      await collection.findOneAndUpdate({
        name: migrationStatus.name,
      }, {
        $set: {
          name: migrationStatus.name,
          progress: migrationStatus.progress,
        },
      }, { upsert: true })
    },
  }
}

export default MongoMigrationAdapter
