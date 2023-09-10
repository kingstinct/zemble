import { MongoClient } from 'mongodb'
import Papr, { VALIDATION_LEVEL, schema, types } from 'papr'

// eslint-disable-next-line import/no-mutable-exports
export let client: MongoClient | undefined

const papr = new Papr()

export async function connect() {
  const mongoUrl = process.env.MONGO_URL

  if (!mongoUrl) throw new Error('MONGO_URL not set')

  console.log('Connecting to MongoDB...', mongoUrl)

  client = await MongoClient.connect(mongoUrl)

  console.log('Connected to MongoDB!')

  const db = client.db()

  papr.initialize(db)

  console.log(`Registering ${papr.models.size} models...`)
  papr.models.forEach((model) => {
    console.log(`Registering model: ${model.collection.collectionName}`)
  })

  await papr.updateSchemas()
}

export async function disconnect() {
  await client?.close()
}

export const ArrayFieldObject = types.object({
  name: types.string({ required: true }),
  isRequired: types.boolean({ required: true }),
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
  entityName: types.string({ required: true }),
  __typename: types.constant('EntityRelationField' as const, { required: true }),
}, {
  required: true,
})

export type ArrayFieldType = typeof ArrayFieldObject

export type EntityRelationType = typeof EntityRelationObject

const AllFields = types.array(types.oneOf([
  types.object({
    name: types.string({ required: true }),
    isRequired: types.boolean({ required: true }),
    __typename: types.constant('IDField' as const, { required: true }),
  }),
  types.object({
    name: types.string({ required: true }),
    isRequired: types.boolean({ required: true }),
    defaultValue: types.number({ required: false }),
    max: types.number({ required: false }),
    min: types.number({ required: false }),
    __typename: types.constant('NumberField' as const, { required: true }),
  }),
  types.object({
    name: types.string({ required: true }),
    isRequired: types.boolean({ required: true }),
    defaultValue: types.boolean({ required: false }),
    __typename: types.constant('BooleanField' as const, { required: true }),
  }),
  types.object({
    name: types.string({ required: true }),
    isRequired: types.boolean({ required: true }),
    maxLength: types.number({ required: false }),
    minLength: types.number({ required: false }),
    defaultValue: types.string({ required: false }),
    __typename: types.constant('StringField' as const, { required: true }),
  }),
  ArrayFieldObject,
  EntityRelationObject,
], {
  required: true,
}),
{
  required: true,
})

export const EntitySchema = schema({
  name: types.string({ required: true }),
  fields: AllFields,
}, {
  timestamps: true,
})

const EntityEntrySchema = schema({
  _id: types.objectId({ required: true }),
  entityType: types.string({ required: true }),
}, {
  timestamps: true,
  validationLevel: VALIDATION_LEVEL.OFF, // let's skip it for now - how do we handle the unknown fields?
})

export const Entity = papr.model('Entities', EntitySchema)

export const EntityEntry = papr.model('EntityEntries', EntityEntrySchema)

export default papr
