/* eslint-disable functional/immutable-data, functional/prefer-readonly-type, no-multi-assign */
import readaptContext from '@readapt/core/readaptContext'
import { MongoClient } from 'mongodb'
import Papr, { VALIDATION_LEVEL, schema, types } from 'papr'

import type { Db } from 'mongodb'
import type { Model } from 'papr'

const StringFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  isSearchable: types.boolean({ required: true }),
  maxLength: types.number({ required: false }),
  minLength: types.number({ required: false }),
  defaultValue: types.oneOf([
    types.null({ required: false }),
    types.string({ required: false }),
  ]),
  __typename: types.constant('StringField' as const, { required: true }),
})

const BooleanFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  defaultValue: types.oneOf([
    types.null({ required: false }),
    types.boolean({ required: false }),
  ]),
  __typename: types.constant('BooleanField' as const, { required: true }),
})

const NumberFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  defaultValue: types.oneOf([
    types.null({ required: false }),
    types.number({ required: false }),
  ]),
  max: types.number({ required: false }),
  min: types.number({ required: false }),
  __typename: types.constant('NumberField' as const, { required: true }),
})

const IDFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  __typename: types.constant('IDField' as const, { required: true }),
})

export const EntityRelationObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  entityName: types.string({ required: true }),
  __typename: types.constant('EntityRelationField' as const, { required: true }),
}, {
  required: true,
})

const AllFieldsInArray = types.oneOf([
  NumberFieldObject,
  BooleanFieldObject,
  StringFieldObject,
  EntityRelationObject,
], {
  required: true,
})

export const ArrayFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  maxItems: types.number({ required: false }),
  minItems: types.number({ required: false }),
  availableFields: types.array(AllFieldsInArray, { required: true }),
  __typename: types.constant('ArrayField' as const, { required: true }),
}, {
  required: true,
})

export type ArrayFieldType = typeof ArrayFieldObject

export type EntityRelationType = typeof EntityRelationObject

const AllFields = types.oneOf([
  IDFieldObject,
  NumberFieldObject,
  BooleanFieldObject,
  StringFieldObject,
  ArrayFieldObject,
  EntityRelationObject,
], {
  required: true,
})

export const EntitySchemaObject = {
  name: types.string({ required: true }),
  pluralizedName: types.string({ required: true }),
  fields: types.objectGeneric(AllFields, undefined, { required: true }),
  isPublishable: types.boolean({ required: true }),
}

export type EntitySchemaType = {
  name: string
  pluralizedName: string
  fields: Record<string, typeof AllFields>
  isPublishable: boolean
  createdAt: string
  updatedAt: string
}

export const EntitySchema = schema(EntitySchemaObject, {
  timestamps: true,
})

export type EntityType = typeof EntitySchemaObject

export const EntityEntrySchema = schema({
  _id: types.objectId({ required: true }),
  entityType: types.string({ required: true }),
  publishedAt: types.date({ required: false }),
}, {
  timestamps: true,
  validationLevel: VALIDATION_LEVEL.OFF, // let's skip it for now - how do we handle the unknown fields?
})

class PaprWrapper {
  db: Db | undefined

  papr: Papr | undefined

  client: MongoClient | undefined

  async contentCollection(name: string) {
    await this.#initializing
    const model = this.papr?.models.get(name) as Model<typeof EntityEntrySchema[0], typeof EntityEntrySchema[1]>

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

  async initialize(mongoUrl: string) {
    const papr = new Papr()

    readaptContext.logger.log('Connecting to MongoDB...', mongoUrl)

    const clientInternalPromise = MongoClient.connect(mongoUrl)
    const client = await clientInternalPromise

    readaptContext.logger.log('Connected to MongoDB!')

    const db = client.db()

    const entities = papr.model('entities', EntitySchema)

    readaptContext.logger.log(`Registering ${papr.models.size} models...`)

    papr.initialize(db)

    await papr.updateSchemas()
    // contentCollections.forEach(async (collection) => {
    //   await db.collection(collection).createIndex({ entityType: -1 })
    // })

    // update when all is done

    const allEntitites = await entities.find({})

    allEntitites.forEach((entity) => {
      papr.model(entity.pluralizedName, EntityEntrySchema)
    })

    this.db = db
    this.client = client
    this.papr = papr
  }

  async connect(mongoUrl = process.env.MONGO_URL) {
    if (!mongoUrl) throw new Error('MONGO_URL not set')
    this.#initializing = this.initialize(mongoUrl)
    return this.#initializing
  }

  async disconnect() {
    await this.client?.close()
    this.papr = undefined
    this.db = undefined
  }
}

export default new PaprWrapper()
