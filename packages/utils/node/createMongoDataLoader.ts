import DataLoaderNullable from './DataLoaderNullable'
import NotFoundError from './errors/NotFoundError'
import { handleExtraFields, removeDeepFields } from './projectionFromGraphQLInfo'
import MapWithPartialMatch from '../MapWithPartialMatch'

import type { Paths, Projection } from './projectionFromGraphQLInfo'
import type { PartialWithId } from './types'
import type { BatchLoadFn } from 'dataloader'
import type {
  Collection, Document, EnhancedOmit, Filter, ObjectId, WithId,
} from 'mongodb'

export type IdWithProjection<T extends Record<string, unknown> & {readonly _id: ObjectId}> = {
  readonly _id: ObjectId;
  readonly projection: Projection<T>
}

export type IdWithoutProjection = {
  readonly _id: ObjectId;
  readonly projection: null
}

export type Key<T extends Record<string, unknown> & {readonly _id: ObjectId}> = IdWithoutProjection | IdWithProjection<T>;

type OptimalProjection<T extends Record<string, unknown> & {readonly _id: ObjectId}> = {
  readonly projection: Projection<T> | null
  readonly $in: Filter<T>['$in'],
}

function getId<T extends {readonly _id: ObjectId}>(key: Key<T>) {
  return key._id
}

export function getOptimalProjection<T extends Record<string, unknown> & {readonly _id: ObjectId}>(keys: readonly Key<T>[]): OptimalProjection<T> {
  const { projection, $in } = keys.reduce<OptimalProjection<T>>((prev, cur) => ({
    ...prev,
    $in: [...prev.$in, getId(cur)],
    projection: prev.projection && cur.projection ? { ...prev.projection, ...cur.projection } : null,
  }), {
    $in: [],
    projection: {},
  } as OptimalProjection<T>)

  return { $in, projection: projection ? removeDeepFields(projection) : null }
}

export function cacheKeyFn<T extends {readonly _id: ObjectId}>(key: Key<T>) {
  const cacheKey = `${getId(key).toHexString()}#${JSON.stringify(key.projection)}`

  return cacheKey
}

export type BatchLoadFnWithoutError<K, V> = (keys: ReadonlyArray<K>) => Promise<ArrayLike<V>>;

export type MongoDataLoader<T extends PartialWithId<Record<string, unknown>>> = DataLoaderNullable<T, Key<T>, string>

export type LoadMapper<
  GQLType extends Record<string, unknown>, // GraphQL type
  DBType extends WithId<unknown> = {readonly _id: ObjectId}, // Database type
  DBPath extends Paths<DBType> = Paths<DBType>,
  GQLPath extends Paths<GQLType> = Paths<GQLType>
> = Partial<Record<DBPath, readonly GQLPath[]>>;

export function createMongoDataloader<
  GQLType extends Record<string, unknown>, // GraphQL type
  DBTypeInt extends Document = Document, // Database type
  DBType extends WithId<DBTypeInt> = WithId<DBTypeInt>, // Database type
  DBPath extends Paths<DBType> = Paths<DBType>,
  GQLPath extends Paths<GQLType> = Paths<GQLType>
>(collection: Collection<EnhancedOmit<DBType, '_id'>>, dependencies?: Partial<Record<DBPath, readonly GQLPath[]>>): MongoDataLoader<DBType> {
  const batchLoadFn: BatchLoadFn<Key<DBType>, DBType> = async (keys) => {
    const { $in, projection } = getOptimalProjection<DBType>(keys)

    const finalProjection = projection ? {
      projection: dependencies ? removeDeepFields(handleExtraFields(projection, dependencies)) : projection,
    } : {}

    const allDbUsers = await collection.find({
      _id: { $in },
    }, finalProjection).limit(keys.length).toArray()

    const orderedResult = keys.map<DBType | NotFoundError>((key) => {
      const dbUser = allDbUsers.find((u) => u._id.equals(getId(key)))
      if (!dbUser) {
        return new NotFoundError(`${collection.collectionName} with _id: "${getId(key).toHexString()}" not found`)
      }
      return dbUser as DBType
    })

    return orderedResult
  }

  const dataloader = new DataLoaderNullable(batchLoadFn, {
    cacheKeyFn,
    cacheMap: new MapWithPartialMatch(),
  })

  return dataloader as MongoDataLoader<DBType>
}

export default createMongoDataloader
