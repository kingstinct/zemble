import DataLoader from 'dataloader'

import NotFoundError from './errors/NotFoundError'

import type { IdWithoutProjection, Key } from './createMongoDataLoader'
import type { PartialWithId } from './types'
import type { ObjectId } from 'mongodb'

export class DataLoaderNullableWithId<V extends { readonly _id: ObjectId }, K extends Key<V>, C extends string> extends DataLoader<K, PartialWithId<V>, C> {
  async load<K2 extends K>(key: K2): Promise<K2 extends IdWithoutProjection ? Required<V> : V> {
    const val = await super.load(key)

    return val as Required<V>
  }

  async loadMany<K2 extends K>(keys: ArrayLike<K2>) {
    return super.loadMany(keys)//  as Promise<ReadonlyArray<Error | K2 extends IdWithoutProjection ? Required<V> : V>>
  }

  async loadNullable<K2 extends K>(key: K2): Promise<K2 extends IdWithoutProjection ? Required<V> | null : V | null > {
    try {
      const item = await super.load(key)

      if (item instanceof NotFoundError) {
        return null
      }

      return item as Required<V>
    } catch (e) {
      if (e instanceof NotFoundError) {
        return Promise.resolve(null)
      }

      throw e
    }
  }

  async loadManyNullable<K2 extends K>(keys: ArrayLike<K2>): Promise<ReadonlyArray<((K2 extends IdWithoutProjection ? V : V)) | null>> {
    const many = await super.loadMany(keys)

    const retVal = many.map<Partial<V> | null>((e) => {
      if (e instanceof Error) {
        return null
      }
      return e
    })

    return retVal as readonly (V | null)[]
  }
}

export default DataLoaderNullableWithId
