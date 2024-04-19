import Papr, { schema, types } from 'papr'

import plugin from '../plugin'

import type { IStandardLogger } from '@zemble/core'
import type { MongoClient } from 'mongodb'

// eslint-disable-next-line import/no-mutable-exports
export let client: MongoClient | undefined

const papr = new Papr()

export async function connect({ logger }: {readonly logger: IStandardLogger}) {
  const db = plugin.providers.mongodb?.db

  if (db === undefined) throw new Error('MongoDB client not provided or initialized')

  papr.initialize(db)

  logger.info(`Registering ${papr.models.size} models...`)
  papr.models.forEach((model) => {
    logger.info(`Registering model: ${model.collection.collectionName}`)
  })

  await papr.updateSchemas()

  await db.collection('users').createIndex({ email: -1 }, { unique: true })
}

export async function disconnect() {
  await client?.close()
}

export enum PermissionType {
  DEVELOPER = 'developer',
  MANAGE_USERS = 'manage-users',
}

const PermissionSchemaObject = {
  type: types.enum(Object.values(PermissionType), { required: true }),
}

export type Permission = typeof PermissionSchemaObject

const UserSchemaObject = {
  _id: types.objectId({ required: true }),
  email: types.string({ required: true }),
  lastLoginAt: types.date({ required: true }),
  permissions: types.array(types.object(PermissionSchemaObject), { required: true }),
}

export const UserSchema = schema(UserSchemaObject, {
  timestamps: true,
})

export type UserType = typeof UserSchemaObject

export const User = papr.model('users', UserSchema)

export default papr
