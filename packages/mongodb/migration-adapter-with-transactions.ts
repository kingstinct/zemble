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

type Config = { readonly providers: Zemble.Providers, readonly collectionName?: string }

const getClient = (config: Config) => {
  const client = config.providers.mongodb
  if (!client) throw new Error('MongoDB client not provided or initialized')
  return client
}

function getCollection<TProgress extends JsonValue = JsonValue>(config: Config) {
  const client = getClient(config)

  const collectionName = config.collectionName ?? 'migrations'

  const collection = client.db().collection<MigrationStatus<TProgress>>(collectionName)
  return collection
}

function MongoMigrationAdapterWithTransaction<TProgress extends JsonValue = JsonValue>(config: Config): MigrationAdapter<TProgress> {
  return {
    up: async (name, runMigration) => {
      const session = getClient(config).startSession()
      try {
        await getCollection(config).findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            startedAt: new Date(),
          },
        }, { upsert: true })

        await session.withTransaction(async () => {
          await runMigration({ mongoSession: session })
          await getCollection(config).findOneAndUpdate({
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
        await getCollection(config).findOneAndUpdate({
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
      await getCollection(config).findOneAndUpdate({
        name,
      }, {
        $set: {
          name,
          startedDownAt: new Date(),
        },
      }, { upsert: true })

      const session = getClient(config).startSession()
      try {
        await session.withTransaction(async () => {
          await runMigration({ mongoSession: session })
          await getCollection(config).deleteOne({ name }, { session })
        })
      } catch (e) {
        await getCollection(config).findOneAndUpdate({
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
      const res = getCollection<TProgress>(config).find().toArray()

      return res
    },
    progress: async (migrationStatus) => {
      await getCollection(config).findOneAndUpdate({
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
