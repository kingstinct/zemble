/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from 'node:fs'
import { printSchemaWithDirectives } from '@graphql-tools/utils'
import type { IStandardLogger } from '@zemble/core'
import Dataloader from 'dataloader'
import type { GraphQLEnumType, GraphQLFieldConfig } from 'graphql'
import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql'
import { ObjectId } from 'mongodb'
import type { EntityEntryType } from '../clients/papr'
import papr from '../clients/papr'
import plugin from '../plugin'
import type { AnyField } from '../types'
import { capitalize } from '../utils'
import { readEntities } from '../utils/fs'
import createEntryResolver from './createEntry'
import createDeleteEntryResolver from './deleteEntry'
import createFilterResolver from './filter'
import createGetAll from './getAll'
import createGetByIdResolver from './getById'
import createGetByIdsResolver from './getByIds'
import createSearch from './search'
import { fieldToOutputType, resetTypes } from './utils'

type ReducerType = {
  readonly query: Record<string, GraphQLFieldConfig<any, any, any>>
  readonly types: readonly (GraphQLObjectType<any, any> | GraphQLEnumType)[]
  readonly mutations: Record<string, GraphQLFieldConfig<any, any, any>>
}

const fieldResolver = (
  parent: EntityEntryType,
  field: AnyField,
  displayNameField?: string,
) => {
  if (field.name === 'id') {
    return parent._id.toHexString()
  }
  if (field.name === 'displayName') {
    return displayNameField && parent[displayNameField]
      ? // eslint-disable-next-line @typescript-eslint/no-base-to-string
        parent[displayNameField].toString()
      : parent._id.toHexString()
  }

  if (parent[field.name] !== undefined && parent[field.name] !== null) {
    return parent[field.name]
  }
  if (field.__typename === 'ArrayField') {
    return []
  }
  if ('defaultValue' in field) {
    return field.defaultValue
  }

  return null
}

export default async ({ logger }: { readonly logger: IStandardLogger }) => {
  if (process.env.NODE_ENV !== 'test') {
    await papr.connect({ logger })
  }

  const entities = await readEntities()

  resetTypes()

  const resolveRelationTypes = (
    initialTypes: Record<string, GraphQLObjectType>,
  ) =>
    entities.reduce((acc, entity) => {
      const getById = new Dataloader(async (ids: readonly string[]) => {
        const contentCollection = await papr.contentCollection(
          entity.namePlural,
        )
        const entries = await contentCollection.find({
          _id: { $in: ids.map((id) => new ObjectId(id)) },
        })

        return ids.map((id) =>
          entries.find((entry) => entry._id.toHexString() === id),
        )
      })

      const objRelation = new GraphQLObjectType({
        fields: () =>
          entity.fields.reduce(
            (prev, field) => {
              const baseType = fieldToOutputType(entity.namePlural, field, acc)

              return {
                ...prev,
                [field.name]: {
                  type: field.isRequired
                    ? new GraphQLNonNull(baseType)
                    : baseType,
                  resolve: async (externalId: string) => {
                    const resolved = await getById.load(externalId)

                    return fieldResolver(
                      resolved!,
                      field,
                      entity.displayNameField,
                    )
                  },
                },
              }
            },
            {
              displayName: {
                type: GraphQLString,
                resolve: async (externalId: string) => {
                  const resolved = await getById.load(externalId)

                  return entity.displayNameField &&
                    resolved?.[entity.displayNameField]
                    ? // @ts-expect-error sdfgsdfg
                      resolved[entity.displayNameField].toString()
                    : resolved?._id.toHexString()
                },
              },
            },
          ),
        name: `${capitalize(entity.namePlural)}Relation`,
      })

      return {
        ...acc,
        [entity.namePlural]: objRelation,
      }
    }, initialTypes)

  // some way to resolve the deep types
  let relationTypes = resolveRelationTypes({})
  relationTypes = resolveRelationTypes(relationTypes)

  const config = await entities.reduce(
    async (prevP, entity) => {
      const prev = await prevP

      const outputType = new GraphQLObjectType({
        fields: Object.values(entity.fields).reduce(
          (prev, field) => {
            const baseType = fieldToOutputType(
              entity.nameSingular,
              field,
              relationTypes,
            )
            return {
              ...prev,
              [field.name]: {
                type: field.isRequiredInput
                  ? new GraphQLNonNull(baseType)
                  : baseType,
                resolve: (parent: EntityEntryType) =>
                  fieldResolver(parent, field),
              },
            }
          },
          {
            displayName: {
              type: GraphQLString,
              resolve: (parent: EntityEntryType) =>
                entity.displayNameField && parent[entity.displayNameField]
                  ? // @ts-expect-error sdfgsdfg
                    parent[entity.displayNameField].toString()
                  : parent._id.toHexString(),
            },
          },
        ),
        name: capitalize(entity.nameSingular),
      })

      const retVal: ReducerType = {
        query: {
          ...prev.query,
          [`getAll${capitalize(entity.namePlural)}`]: createGetAll(
            entity,
            outputType,
          ),
          [`search${capitalize(entity.namePlural)}`]: createSearch(
            entity,
            outputType,
          ),
          [`filter${capitalize(entity.namePlural)}`]: createFilterResolver(
            entity,
            outputType,
          ),
          [`get${capitalize(entity.nameSingular)}ById`]: createGetByIdResolver(
            entity,
            outputType,
          ),
          [`get${capitalize(entity.namePlural)}ById`]: createGetByIdsResolver(
            entity,
            outputType,
          ),
        },
        types: [...prev.types],
        mutations: {
          ...prev.mutations,
          [`create${capitalize(entity.nameSingular)}`]: createEntryResolver(
            entity,
            outputType,
          ),
          [`delete${capitalize(entity.nameSingular)}`]:
            createDeleteEntryResolver(entity),
        },
      }
      return retVal
    },
    Promise.resolve<ReducerType>({
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
    }),
  )

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

  const schemaStr = printSchemaWithDirectives(schema)

  plugin.debug(
    `\n\n------- ▼ UPDATED SCHEMA ▼ -------\n\n${schemaStr}\n\n------- ⏶ UPDATED SCHEMA ⏶ -------\n\n`,
  )

  if (process.env.NODE_ENV !== 'test') {
    const schemaStr = printSchemaWithDirectives(schema)
    await fs.promises.mkdir(`${process.cwd()}/cms`, { recursive: true })
    await fs.promises.writeFile(
      `${process.cwd()}/cms/schema.generated.graphql`,
      schemaStr,
    )
  }

  return schema
}
