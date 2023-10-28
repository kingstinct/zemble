/* eslint-disable functional/immutable-data, functional/prefer-readonly-type, no-multi-assign */
import zembleContext from '@zemble/core/zembleContext'
import Papr, { VALIDATION_LEVEL, schema, types } from 'papr'

import plugin from '../plugin'
import { readEntities } from '../utils/fs'

import type { MongoClient, Db } from 'mongodb'
import type { Model } from 'papr'

export const EntityEntrySchema = schema({
  _id: types.objectId({ required: true }),
  publishedAt: types.date({ required: false }),
}, {
  timestamps: true,
  validationLevel: VALIDATION_LEVEL.OFF, // let's skip it for now - how do we handle the unknown fields?
})

export type EntityEntryType = typeof EntityEntrySchema[0] & Record<string, unknown>

class PaprWrapper {
  db: Db | undefined

  papr: Papr | undefined

  client: MongoClient | undefined

  async contentCollection(name: string) {
    await this.#initializing
    const model = this.papr?.models.get(name) as Model<EntityEntryType, typeof EntityEntrySchema[1]>

    if (!model) throw new Error(`Content collection "${name}" not found or not initialized`)
    return model
  }

  async initializeCollection(collectionName: string) {
    this.papr?.model(collectionName, EntityEntrySchema)
    const collections = await this.db?.collections()
    if (collections?.some((collection) => collection.collectionName === collectionName)) {
      return
    }
    await this.db?.createCollection(collectionName)
  }

  #initializing = Promise.resolve()

  async initialize() {
    const papr = new Papr()

    zembleContext.logger.log('Connecting to MongoDB...')

    const client = plugin.providers.mongodb

    zembleContext.logger.log('Connected to MongoDB!')

    const db = client.db()

    zembleContext.logger.log(`Registering ${papr.models.size} models...`)

    papr.initialize(db)

    const allEntities = await readEntities()

    allEntities.forEach((entity) => {
      papr.model(entity.namePlural, EntityEntrySchema)
    })

    await papr.updateSchemas()

    this.db = db
    this.client = client
    this.papr = papr
  }

  async connect() {
    this.#initializing = this.initialize()
    return this.#initializing
  }

  async disconnect() {
    await this.client?.close()
    this.papr = undefined
    this.db = undefined
  }
}

export default new PaprWrapper()
