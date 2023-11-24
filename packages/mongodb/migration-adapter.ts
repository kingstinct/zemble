// eslint-disable-next-line import/no-extraneous-dependencies
import type { MigrationAdapter, MigrationStatus } from '@zemble/migrations'
import type { JsonValue } from 'type-fest'

type Config = { readonly providers: Zemble.Providers, readonly collectionName?: string }

function getCollection<TProgress extends JsonValue = JsonValue>(config: Config) {
  const db = config.providers.mongodb?.db
  if (!db) throw new Error('MongoDB client not provided or initialized')

  const collectionName = config.collectionName ?? 'migrations'

  const collection = db.collection<MigrationStatus<TProgress>>(collectionName)
  return collection
}

function MongoMigrationAdapter<TProgress extends JsonValue = JsonValue>(config: Config): MigrationAdapter<TProgress> {
  return {
    up: async (name, runMigration) => {
      try {
        await getCollection(config).findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            startedAt: new Date(),
          },
        }, { upsert: true })

        await runMigration()
        await getCollection(config).findOneAndUpdate({
          name,
        }, {
          $set: {
            name,
            completedAt: new Date(),
            error: null,
          },
        }, { upsert: true })
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

      try {
        await runMigration()
        await getCollection(config).deleteOne({ name })
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

export default MongoMigrationAdapter
