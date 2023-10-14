/* eslint-disable @typescript-eslint/no-explicit-any */

import Dataloader from 'dataloader'
import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  printSchema,
} from 'graphql'
import { ObjectId } from 'mongodb'
import fs from 'node:fs'

import createEntryResolver from './createEntry'
import createDeleteEntryResolver from './deleteEntry'
import createFilterResolver from './filter'
import createGetAll from './getAll'
import createGetByIdResolver from './getById'
import createGetByIdsResolver from './getByIds'
import createSearch from './search'
import { fieldToOutputType, resetTypes } from './utils'
import papr from '../clients/papr'
import {
  capitalize,
} from '../utils'
import { readEntities } from '../utils/fs'

import type {
  GraphQLFieldConfig,
  GraphQLEnumType,
} from 'graphql'

type ReducerType = {
  readonly query: Record<string, GraphQLFieldConfig<any, any, any>>,
  readonly types: readonly (GraphQLObjectType<any, any> | GraphQLEnumType)[],
  readonly mutations: Record<string, GraphQLFieldConfig<any, any, any>>,
}

export default async () => {
  if (process.env.NODE_ENV !== 'test') {
    await papr.connect()
  }

  const entities = await readEntities()

  resetTypes()

  const resolveRelationTypes = (initialTypes: Record<string, GraphQLObjectType>) => entities.reduce((acc, entity) => {
    const getById = new Dataloader(async (ids: readonly string[]) => {
      const contentCollection = await papr.contentCollection(entity.pluralizedName)
      const entries = await contentCollection.find({ _id: { $in: ids.map((id) => new ObjectId(id)) } })

      return ids.map((id) => entries.find((entry) => entry._id.toHexString() === id))
    })

    const objRelation = new GraphQLObjectType({
      fields: () => entity.fields.reduce((prev, field) => {
        const baseType = fieldToOutputType(entity.name, field, acc)

        return ({
          ...prev,
          [field.name]: {
            type: field.isRequired ? new GraphQLNonNull(baseType) : baseType,
            resolve: async (parent: { readonly externalId: string }) => {
              const id = parent.externalId
              const resolved = await getById.load(id)
              // @ts-expect-error fix sometime
              return resolved[field.name]
            },
          },
        })
      }, {}),
      name: `${capitalize(entity.name)}Relation`,
    })

    return {
      ...acc,
      [entity.name]: objRelation,
    }
  }, initialTypes)

  // some way to resolve the deep types
  let relationTypes = resolveRelationTypes({})
  relationTypes = resolveRelationTypes(relationTypes)

  const config = await entities.reduce(async (prevP, entity) => {
    const prev = await prevP

    const outputType = new GraphQLObjectType({
      fields: Object.values(entity.fields).reduce((prev, field) => {
        const baseType = fieldToOutputType(entity.name, field, relationTypes)
        return ({
          ...prev,
          [field.name]: {
            type: field.isRequiredInput ? new GraphQLNonNull(baseType) : baseType,
            resolve: (props: { readonly _id: ObjectId } & Record<string, unknown>) => {
              if (field.name === 'id') {
                return props._id.toHexString()
              }
              if (props[field.name] !== undefined && props[field.name] !== null) {
                return props[field.name]
              }
              if (field.__typename === 'ArrayField') {
                return []
              }
              if ('defaultValue' in field) {
                return field.defaultValue
              }

              return null
            },
          },
        })
      }, {}),
      name: capitalize(entity.name).replaceAll(' ', '_'),
    })

    const retVal: ReducerType = {
      query: {
        ...prev.query,
        [`getAll${capitalize(entity.pluralizedName)}`]: createGetAll(entity, outputType),
        [`search${capitalize(entity.pluralizedName)}`]: createSearch(entity, outputType),
        [`filter${capitalize(entity.pluralizedName)}`]: createFilterResolver(entity, outputType),
        [`get${capitalize(entity.name)}ById`]: createGetByIdResolver(entity, outputType),
        [`get${capitalize(entity.pluralizedName)}ById`]: createGetByIdsResolver(entity, outputType),
      },
      types: [...prev.types],
      mutations: {
        ...prev.mutations,
        [`create${capitalize(entity.name)}`]: createEntryResolver(entity, outputType),
        [`delete${capitalize(entity.name)}`]: createDeleteEntryResolver(entity),
      },
    }
    return retVal
  }, Promise.resolve<ReducerType>({
    query: {},
    types: [
      /* new GraphQLEnumType({
      name: 'EntityEnum',
      values: entities.reduce((prev, entity) => ({
        ...prev,
        [entity.name.toUpperCase()]: {
          value: entity.name,
        },
      }), {}),
      values:  {
      a: { value: 'a' },
       },
       }), */
    ],
    mutations: {},
  }))

  const schema = new GraphQLSchema({
    types: config.types,
    query: new GraphQLObjectType({
      name: 'Query',
      fields: {
        ...config.query,
      },
    }),
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        ...config.mutations,
      },
    }),
  })

  if (process.env.DEBUG) {
    const schemaStr = printSchema(schema)
    console.log(`\n\n------- ▼ UPDATED SCHEMA ▼ -------\n\n${schemaStr}\n\n------- ⏶ UPDATED SCHEMA ⏶ -------\n\n`)
  }

  if (process.env.NODE_ENV !== 'test') {
    const schemaStr = printSchema(schema)
    await fs.promises.mkdir(`${process.cwd()}/cms`, { recursive: true })
    await fs.promises.writeFile(`${process.cwd()}/cms/schema.generated.graphql`, schemaStr)
  }

  return schema
}
