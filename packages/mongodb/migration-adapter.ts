// eslint-disable-next-line import/no-extraneous-dependencies
import type { MigrationAdapter, MigrationStatus } from '@zemble/migrations'
import type { JsonValue } from 'type-fest'

function MongoMigrationAdapter<TProgress extends JsonValue = JsonValue>(config: { readonly providers: Zemble.Providers, readonly collectionName?: string }): MigrationAdapter<TProgress> {
  const client = config.providers.mongodb
  if (!client) throw new Error('MongoDB client not provided or initialized')

  const collectionName = config.collectionName ?? 'migrations'

  const collection = client.db().collection<MigrationStatus<TProgress>>(collectionName)

  return {
    up: async (name, runMigration) => {
      try {
        await collection.findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            startedAt: new Date(),
          },
        }, { upsert: true })

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
      await collection.findOneAndUpdate({
        name,
      }, {
        $set: {
          name,
          startedDownAt: new Date(),
        },
      }, { upsert: true })

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

export default MongoMigrationAdapter
