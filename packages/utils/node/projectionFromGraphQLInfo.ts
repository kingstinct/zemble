import graphqlFields from 'graphql-fields'

import type { GraphQLResolveInfo } from 'graphql'
import type { Document, ObjectId, StrictFilter } from 'mongodb'

// eslint-disable-next-line functional/prefer-readonly-type
export type Projection<T> = {
  [K in keyof StrictFilter<T>]?: 0 | 1;
};

type Join<K, P> = K extends number | string ?
  P extends number | string ?
  `${K}${'' extends P ? '' : '.'}${P}`
    : never : never;

  type Prev = readonly [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...readonly 0[]]

export type Paths<T, D extends number = 5> = readonly [D] extends readonly [never] ? never : T extends Record<string, unknown> ?
  { readonly [K in keyof T]-?: K extends number | string ?
    Join<K, Paths<T[K], Prev[D]>> | `${K}`
    : never
  }[keyof T] : ''

// export type Projection<DBType extends Record<string, unknown>, DBPath extends Paths<DBType> = Paths<DBType>> = Record<DBPath, number>

export type DbType = Document & { readonly _id: ObjectId };

// don't query deep fields when a more flat is asked for (results in errors)
export function removeDeepFields<DBType extends DbType>(projection: Projection<DBType>) {
  const newProj = { ...projection }
  const allKeys = Object.keys(projection)
  allKeys.forEach((field) => {
    const foundShorter = allKeys.find((key) => key !== field && field.startsWith(`${key}.`))

    if (foundShorter) {
      // eslint-disable-next-line no-param-reassign, func-names, functional/immutable-data
      delete newProj[field]
    }
  })

  return newProj
}

function build<
  GQLType extends Record<string, unknown>, // GraphQL type
  GQLPath extends Paths<GQLType> = Paths<GQLType>
>(fieldsAskedFor: Record<GQLPath, object>, prependKey = '') {
  let localFields = {}
  Object.keys(fieldsAskedFor).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (Object.keys(fieldsAskedFor[key] as object).length === 0) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign, func-names, functional/immutable-data
      localFields[prependKey + key] = 1
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      localFields = { ...localFields, ...build(fieldsAskedFor[key] as object, `${prependKey}${key}.`) }
    }
  })
  return localFields
}

export function handleExtraFields<
  GQLType extends Record<string, unknown>, // GraphQL type
  DBType extends Record<string, unknown>, // Database type
  DBPath extends Paths<DBType> = Paths<DBType>,
  GQLPath extends Paths<GQLType> = Paths<GQLType>
>(fields: Projection<DBType>, dependencies: Partial<Record<DBPath, readonly GQLPath[]>>): Projection<DBType> {
  const updatedFields: Projection<DBType> = { ...fields },
        allFields = Object.keys(fields)

  Object.keys(dependencies).forEach((path) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const ifAnyOfTheseExist = dependencies[path] as readonly string[]
    const setAndDeleteDependency = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign, func-names, functional/immutable-data
      updatedFields[path] = 1
      /* ifAnyOfTheseExist.forEach((resolverName) => {
        delete updatedFields[resolverName];
      }); */
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (dependencies[path].length === 0) {
      setAndDeleteDependency()
    } else {
      const foundMatch = allFields.find((existing) => ifAnyOfTheseExist.find((id) => id.startsWith(existing) || existing.startsWith(id)))
      if (foundMatch) {
        setAndDeleteDependency()
      }
    }
  })

  return updatedFields
}

function projectionFromGraphQLInfo<
  DBType extends Record<string, unknown>, // Database type
  GQLType extends Record<string, unknown>, // GraphQL type
  TInfo extends GraphQLResolveInfo | null | undefined = GraphQLResolveInfo,
  DBPath extends Paths<DBType> = Paths<DBType>,
  GQLPath extends Paths<GQLType> = Paths<GQLType>
>(info: TInfo, dependencies?: Partial<Record<DBPath, ReadonlyArray<GQLPath>>>, prefixes?: readonly string[]): TInfo extends GraphQLResolveInfo ? Projection<DbType> : null {
  if (!info) {
    return null as TInfo extends GraphQLResolveInfo ? Projection<DbType> : null
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fieldsAskedFor = graphqlFields(info, undefined, undefined) as Record<GQLPath, Record<string, unknown>>
  let fields = build(fieldsAskedFor)

  if (prefixes && fields) {
    Object.keys(fields).forEach((field) => {
      const matchingPrefix = prefixes.find((prefix) => field.startsWith(prefix))
      if (matchingPrefix) {
        const newPropName = field.replace(matchingPrefix, '')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign, func-names, functional/immutable-data
        fields[newPropName] = 1
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-param-reassign, func-names, functional/immutable-data
      delete fields[field]
    })
  }

  if (dependencies) {
  // resolve deps
    fields = handleExtraFields(fields, dependencies)
  }

  return removeDeepFields(fields) as TInfo extends GraphQLResolveInfo ? Projection<DbType> : null
}

export default projectionFromGraphQLInfo
