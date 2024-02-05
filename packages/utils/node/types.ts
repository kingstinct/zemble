import type { ObjectId } from 'mongodb'

export type PartialWithId<T> = Partial<T> & { readonly _id: ObjectId }
