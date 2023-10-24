// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoClient } from 'mongodb'

import type { MigrationAdapter, MigrationStatus } from '../plugin'
import type { Collection } from 'mongodb'
import type { JsonValue } from 'type-fest'

class MongoAdapter<TProgress extends JsonValue = JsonValue> implements MigrationAdapter<TProgress> {
  readonly client: MongoClient

  readonly migrationStatusCollectionName: string

  readonly collection: Collection<MigrationStatus>

  constructor(mongoUrl: string, migrationStatusCollectionName = 'migrations') {
    this.client = new MongoClient(mongoUrl)

    this.migrationStatusCollectionName = migrationStatusCollectionName
    this.collection = this.client.db().collection(this.migrationStatusCollectionName)
  }

  async up(migrationStatus: { readonly name: string; readonly completedAt: Date; }): Promise<void> {
    await this.collection.findOneAndUpdate({
      name: migrationStatus.name,
    }, {
      $set: {
        name: migrationStatus.name,
        completedAt: migrationStatus.completedAt,
      },
    }, { upsert: true })
  }

  async down(name: string): Promise<void> {
    await this.collection.deleteOne({ name })
  }

  async status(): Promise<readonly MigrationStatus<TProgress>[]> {
    return this.collection.find().toArray() as Promise<readonly MigrationStatus<TProgress>[]>
  }

  async progress(migrationStatus: NonNullable<Omit<MigrationStatus, 'completedAt'>>): Promise<void> {
    await this.collection.findOneAndUpdate({
      name: migrationStatus.name,
    }, {
      $set: {
        name: migrationStatus.name,
        progress: migrationStatus.progress,
      },
    }, { upsert: true })
  }
}

export default MongoAdapter
