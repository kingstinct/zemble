/* eslint-disable functional/immutable-data, functional/prefer-readonly-type, no-multi-assign */
import Papr, { VALIDATION_LEVEL, schema, types } from 'papr'

import plugin from '../plugin'
import { readEntities } from '../utils/fs'

import type { IStandardLogger } from '@zemble/core'
import type { Db } from 'mongodb'
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

  async initialize({ logger }: {readonly logger: IStandardLogger}) {
    const papr = new Papr()

    await plugin.providers.mongodb?.client.connect()

    const db = plugin.providers.mongodb?.db

    if (db === undefined) throw new Error('MongoDB client not provided or initialized')

    if (process.env.NODE_ENV !== 'test' || process.env['DEBUG']) {
      logger.info(`Registering ${papr.models.size} models...`)
    }

    papr.initialize(db)

    const allEntities = await readEntities()

    allEntities.forEach((entity) => {
      papr.model(entity.namePlural, EntityEntrySchema)
    })

    await papr.updateSchemas()

    this.db = db
    this.papr = papr
  }

  async connect({ logger }: {readonly logger: IStandardLogger}) {
    this.#initializing = this.initialize({ logger })
    return this.#initializing
  }

  async disconnect() {
    await plugin.providers.mongodb?.client.close()
    this.papr = undefined
    this.db = undefined
  }
}

export default new PaprWrapper()
