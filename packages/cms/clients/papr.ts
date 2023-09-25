/* eslint-disable functional/immutable-data, functional/prefer-readonly-type, no-multi-assign */
import readaptContext from '@readapt/core/readaptContext'
import { MongoClient } from 'mongodb'
import Papr, { VALIDATION_LEVEL, schema, types } from 'papr'

import type { Db } from 'mongodb'
import type { Model } from 'papr'

export const ArrayFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
  isRequiredInput: types.boolean({ required: true }),
  maxItems: types.number({ required: false }),
  minItems: types.number({ required: false }),
  availableFields: types.array(types.unknown, { required: true }),
  __typename: types.constant('ArrayField' as const, { required: true }),
}, {
  required: true,
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

export type ArrayFieldType = typeof ArrayFieldObject

export type EntityRelationType = typeof EntityRelationObject

const AllFields = types.oneOf([
  types.object({
    name: types.string({ required: true }),
    isRequired: types.boolean({ required: true }),
    isRequiredInput: types.boolean({ required: true }),
    __typename: types.constant('IDField' as const, { required: true }),
  }),
  types.object({
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
  }),
  types.object({
    name: types.string({ required: true }),
    isRequired: types.boolean({ required: true }),
    isRequiredInput: types.boolean({ required: true }),
    defaultValue: types.oneOf([
      types.null({ required: false }),
      types.boolean({ required: false }),
    ]),
    __typename: types.constant('BooleanField' as const, { required: true }),
  }),
  types.object({
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
  }),
  ArrayFieldObject,
  EntityRelationObject,
], {
  required: true,
})

const EntitySchemaObject = {
  name: types.string({ required: true }),
  pluralizedName: types.string({ required: true }),
  fields: types.objectGeneric(AllFields, undefined, { required: true }),
  isPublishable: types.boolean({ required: true }),
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

  #entities: Model<typeof EntitySchema[0], typeof EntitySchema[1]> | undefined

  #content: Model<typeof EntityEntrySchema[0], typeof EntityEntrySchema[1]> | undefined

  get Entities() {
    if (!this.papr || !this.#entities) throw new Error('Papr not initialized')
    return this.#entities
  }

  get Content() {
    if (!this.papr || !this.#content) throw new Error('Papr not initialized')
    return this.#content
  }

  async connect(mongoUrl = process.env.MONGO_URL) {
    const papr = this.papr = new Papr()
    if (!mongoUrl) throw new Error('MONGO_URL not set')

    readaptContext.logger.log('Connecting to MongoDB...', mongoUrl)

    const clientInternalPromise = MongoClient.connect(mongoUrl)
    const client = this.client = await clientInternalPromise

    readaptContext.logger.log('Connected to MongoDB!')

    const db = this.db = client.db()

    this.#entities = papr.model('entities', EntitySchema)
    this.#content = papr.model('content', EntityEntrySchema)

    this.papr.initialize(db)

    readaptContext.logger.log(`Registering ${this.papr.models.size} models...`)
    this.papr.models.forEach((model) => {
      readaptContext.logger.log(`Registering model: ${model.collection.collectionName}`)
    })

    await this.papr.updateSchemas()

    await db.collection('entities').createIndex({ name: -1 }, { unique: true })
    await db.collection('entities').createIndex({ pluralizedName: -1 }, { unique: true })
    await db.collection('content').createIndex({ entityType: -1 })
  }

  async disconnect() {
    await this.client?.close()
    this.papr = undefined
    this.db = undefined
  }
}

export default new PaprWrapper()
