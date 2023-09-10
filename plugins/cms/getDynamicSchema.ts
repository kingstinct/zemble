/* eslint-disable @typescript-eslint/no-explicit-any */

import Dataloader from 'dataloader'
import {
  GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList,
  GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLFloat, GraphQLBoolean, GraphQLUnionType, Kind, GraphQLEnumType,
} from 'graphql'
import { ObjectId } from 'mongodb'

import { Entity, EntityEntry } from './clients/papr'
import {
  capitalize, pluralize,
} from './utils'

import type { ArrayFieldType, EntityRelationType } from './clients/papr'
import type {
  BooleanField, IdField, EntityRelationField, NumberField, ArrayField, StringField,
} from './graphql/schema.generated'
import type {
  GraphQLFieldConfig, GraphQLOutputType, GraphQLScalarType, GraphQLType,
  GraphQLInputObjectTypeConfig,
} from 'graphql'

type ReducerType = {
  readonly query: Record<string, GraphQLFieldConfig<any, any, any>>,
  readonly types: readonly (GraphQLObjectType<any, any> | GraphQLEnumType)[],
  readonly mutations: Record<string, GraphQLFieldConfig<any, any, any>>,
}

type IField = NumberField | StringField | BooleanField | IdField | EntityRelationType | ArrayFieldType

const types: Record<string, GraphQLUnionType | GraphQLObjectType> = {}

function typeDeduper<T extends GraphQLUnionType | GraphQLObjectType>(type: T): T {
  if (types[type.name]) {
    return types[type.name] as T
  }
  // eslint-disable-next-line functional/immutable-data
  types[type.name] = type
  return type
}

const fieldToOutputType = (
  typePrefix: string,
  field: IField,
  relationTypes: Record<string, GraphQLObjectType>,
): GraphQLScalarType | GraphQLList<GraphQLOutputType> | GraphQLObjectType => {
  switch (field.__typename) {
    case 'NumberField':
      return GraphQLFloat
    case 'BooleanField':
      return GraphQLBoolean
    case 'IDField':
      return GraphQLID
    case 'ArrayField':
      // eslint-disable-next-line no-case-declarations
      const availableFields = field.availableFields.map((f) => new GraphQLObjectType({
        name: `${capitalize(typePrefix)}${capitalize(field.name)}${capitalize(f.name)}`,
        fields: {
          [f.name]: {
            type: fieldToOutputType(typePrefix, f as any, relationTypes),
          },
        },
      }))
      console.log('availableFields', availableFields)
      // eslint-disable-next-line no-case-declarations
      const union = typeDeduper(new GraphQLUnionType({
        name: `${capitalize(typePrefix)}${capitalize(field.name)}Union`,
        types: availableFields,
      }))
      return new GraphQLList(union)
    case 'EntityRelationField':
      return typeDeduper(relationTypes[field.entityName] ?? new GraphQLObjectType({
        name: `${capitalize(field.entityName)}RelationDeep`, // just to get past this
        fields: {
          externalId: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
      }))
    default:
      return GraphQLString
  }
}

const fieldToInputType = (typePrefix: string, field: IField): GraphQLScalarType | GraphQLList<GraphQLInputObjectType> | GraphQLInputObjectType => {
  switch (field.__typename) {
    case 'NumberField':
      return GraphQLFloat
    case 'BooleanField':
      return GraphQLBoolean
    case 'IDField':
      return GraphQLID
    case 'EntityRelationField':
      return GraphQLID
    case 'ArrayField':
      // eslint-disable-next-line no-case-declarations
      const availableFields = field.availableFields.reduce<GraphQLInputObjectTypeConfig>((prev, f) => ({
        ...prev,
        fields: {
          ...prev.fields,
          [f.name]: {
            type: fieldToInputType(typePrefix, f as any),
          },
        },
      }), {
        name: `${capitalize(typePrefix)}${capitalize(field.name)}Input`,
        fields: {},
        extensionASTNodes: [
          {
            name: {
              kind: Kind.NAME,
              value: 'extension',
            },
            directives: [
              {
                kind: Kind.DIRECTIVE,
                name: {
                  kind: Kind.NAME,
                  value: 'oneOf',
                },
              },
            ],
            kind: Kind.INPUT_OBJECT_TYPE_EXTENSION,
          },
        ],
      } as GraphQLInputObjectTypeConfig)
      // console.log('availableFields', availableFields)
      // eslint-disable-next-line no-case-declarations
      // const union = new GraphQLInputObjectType({
      //   name: `${capitalize(typePrefix)}${capitalize(field.name)}Input`,
      //   // types: availableFields,
      //   fields: {
      //     hello: { type: GraphQLString  }
      //   },
      // })
      return new GraphQLList(new GraphQLInputObjectType(availableFields))
    // case 'EntityRelationField':
    //   return new GraphQLObjectType({
    //     name: `${capitalize(field.name)}Link`,
    //     fields: {
    //       externalId: {
    //         type: new GraphQLNonNull(GraphQLID),
    //       },
    //     },
    //   })
    default:
      return GraphQLString
  }
}

export default async () => {
  const entities = await Entity.find({})

  const relationTypes = entities.reduce((prev, entity) => {
    const getById = new Dataloader(async (ids: readonly string[]) => {
      const entries = await EntityEntry.find({ entityType: entity.name, _id: { $in: ids.map((id) => new ObjectId(id)) } })

      return ids.map((id) => entries.find((entry) => entry._id.toHexString() === id))
    })

    const objRelation = new GraphQLObjectType({
      fields: entity.fields.reduce((prev, field) => {
        const baseType = fieldToOutputType(entity.name, field, {})
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
      ...prev,
      [entity.name]: objRelation,
    }
  }, {} as Record<string, GraphQLObjectType>)

  const config = await entities.reduce(async (prevP, entity) => {
    const prev = await prevP
    const obj = new GraphQLObjectType({
      fields: entity.fields.reduce((prev, field) => {
        const baseType = fieldToOutputType(entity.name, field, relationTypes)
        return ({
          ...prev,
          [field.name]: {
            type: field.isRequired ? new GraphQLNonNull(baseType) : baseType,
          },
        })
      }, {}),
      name: capitalize(entity.name),
    })

    const getById: GraphQLFieldConfig<unknown, unknown, {readonly id: string}> = { // "book"
      type: new GraphQLNonNull(obj),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_, { id }) => EntityEntry.findOne({ entityType: entity.name, _id: new ObjectId(id) }),
    } as const

    const getAll: GraphQLFieldConfig<unknown, unknown, unknown> = { // "books"
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(obj))),
      resolve: async () => EntityEntry.find({ entityType: entity.name }),
    }

    const createEntityEntry: GraphQLFieldConfig<unknown, unknown, Record<string, unknown> & { readonly _id: string }> = {
      type: obj,
      args: entity.fields.reduce((prev, field) => {
        const baseType = fieldToInputType(entity.name, field)

        return ({
          ...prev,
          [field.name]: {
            type: field.isRequired && field.__typename !== 'IDField' ? new GraphQLNonNull(baseType) : baseType,
          },
        })
      }, {}),
      resolve: async (_, { _id: idInput, ...input }) => {
        const arrayFieldNames = new Set(entity.fields.filter((f) => f.__typename === 'ArrayField').map((f) => f.name))
        const entityRelationFieldNamesWithEntity = entity.fields.filter((f) => f.__typename === 'EntityRelationField').reduce((prev, f) => ({
          ...prev,
          [f.name]: (f as EntityRelationField).entityName,
        }), {} as Record<string, string>)

        const mapArrayFields = (fieldName: string, data: Record<string, unknown> | readonly Record<string, unknown>[]) => (Array.isArray(data) ? data : [data]).map((el) => ({
          ...el,
          __typename: capitalize(entity.name) + capitalize(fieldName) + capitalize(Object.keys(el)[0]),
        }))

        const mappedStuff = Object.keys(input).reduce((prev, key) => ({
          ...prev,
          // eslint-disable-next-line no-nested-ternary
          [key]: arrayFieldNames.has(key)
            ? mapArrayFields(key, input[key] as Record<string, unknown> | readonly Record<string, unknown>[]) : (entityRelationFieldNamesWithEntity[key]
              ? { __typename: `${capitalize(entityRelationFieldNamesWithEntity[key])}Relation`, externalId: input[key] }
              : input[key]),
        }), {} as Record<string, unknown>)
        const actualInput = {
          entityType: entity.name,
          ...mappedStuff,
        }

        console.log('actualInput', actualInput)

        const _id = idInput ? new ObjectId(idInput) : new ObjectId()

        const res = await EntityEntry.findOneAndUpdate(_id ? {
          _id: new ObjectId(_id),
          entityType: entity.name,
        } : {
          entityType: entity.name,
        }, {
          $set: actualInput,
          $setOnInsert: { _id },
        }, {
          upsert: true,
          returnDocument: 'after',
        })

        return res!
      },
    }

    const deleteEntityEntry: GraphQLFieldConfig<unknown, unknown, { readonly _id: string }> = {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: async (_, { _id }) => {
        await EntityEntry.findOneAndDelete({
          entityType: entity.name,
          _id: new ObjectId(_id),
        })
        return true
      },
    }

    const retVal: ReducerType = {
      query: {
        ...prev.query,
        [pluralize(entity.name)]: getAll,
        [entity.name]: getById,
      },
      types: [...prev.types],
      mutations: {
        ...prev.mutations,
        [`create${capitalize(entity.name)}`]: createEntityEntry,
        [`delete${capitalize(entity.name)}`]: deleteEntityEntry,
      },
    }
    return retVal
  }, Promise.resolve<ReducerType>({
    query: {},
    types: [
      new GraphQLEnumType({
        name: 'EntityEnum',
        values: entities.reduce((prev, entity) => ({
          ...prev,
          [entity.name.toUpperCase()]: {
            value: entity.name,
          },
        }), {}),
        // values:  {
        //   a: { value: 'a' },
        // },
      }),
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

  return schema
}
