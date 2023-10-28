// eslint-disable-next-line import/no-extraneous-dependencies
import type { MigrationAdapter, MigrationStatus } from '@zemble/migrations'
import type { ClientSession } from 'mongodb'
import type { JsonValue } from 'type-fest'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Zemble {
    interface MigrationContext {
      readonly mongoSession: ClientSession
    }
  }
}

function MongoMigrationAdapterWithTransaction<TProgress extends JsonValue = JsonValue>(config: { readonly providers: Zemble.Providers, readonly collectionName?: string }): MigrationAdapter<TProgress> {
  const client = config.providers.mongodb
  if (!client) throw new Error('MongoDB client not provided or initialized')

  const collectionName = config.collectionName ?? 'migrations'

  const collection = client.db().collection<MigrationStatus<TProgress>>(collectionName)

  return {
    up: async (name, runMigration) => {
      const session = client.startSession()
      try {
        await collection.findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            startedAt: new Date(),
          },
        }, { upsert: true })

        await session.withTransaction(async () => {
          await runMigration({ mongoSession: session })
          await collection.findOneAndUpdate({
            name,
          }, {
            $set: {
              name,
              completedAt: new Date(),
              error: null,
            },
          }, { upsert: true, session })
        })
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
      } finally {
        await session.endSession()
      }
    },
    down: async (name, runMigration) => {
      await collection.findOneAndUpdate({
        name,
      }, {
        $set: {
          name,
          startedDownAt: new Date(),
        },
      }, { upsert: true })

      const session = client.startSession()
      try {
        await session.withTransaction(async () => {
          await runMigration({ mongoSession: session })
          await collection.deleteOne({ name }, { session })
        })
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
      } finally {
        await session.endSession()
      }
    },
    status: async () => {
      const res = collection.find().toArray()

      return res
    },
    progress: async (migrationStatus) => {
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

export default MongoMigrationAdapterWithTransaction
