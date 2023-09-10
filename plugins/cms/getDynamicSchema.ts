/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLFloat, GraphQLBoolean, GraphQLInterfaceType, GraphQLUnionType, Kind,
} from 'graphql'
import { ObjectId } from 'mongodb'

import { Entity, EntityEntry } from './clients/papr'
import {
  capitalize, pluralize,
} from './utils'

import type { ArrayFieldType } from './clients/papr'
import type {
  BooleanField, IdField, EntityLinkField, NumberField, ArrayField, StringField,
} from './graphql/schema.generated'
import type {
  GraphQLFieldConfig, GraphQLOutputType, GraphQLScalarType, GraphQLType,
  GraphQLInputObjectTypeConfig,
} from 'graphql'

type ReducerType = {
  readonly query: Record<string, GraphQLFieldConfig<any, any, any>>,
  readonly types: readonly GraphQLObjectType<any, any>[],
  readonly mutations: Record<string, GraphQLFieldConfig<any, any, any>>,
}

type IField = NumberField | StringField | BooleanField | IdField | EntityLinkField | ArrayFieldType

const types: Record<string, GraphQLUnionType> = {}

const typeDeduper = (type: GraphQLUnionType) => {
  if (types[type.name]) {
    return types[type.name]
  }
  // eslint-disable-next-line functional/immutable-data
  types[type.name] = type
  return type
}

const fieldToOutputType = (typePrefix: string, field: IField): GraphQLScalarType | GraphQLList<GraphQLOutputType> | GraphQLObjectType => {
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
            type: fieldToOutputType(typePrefix, f as any),
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
    case 'EntityLinkField':
      return new GraphQLObjectType({
        name: `${capitalize(field.name)}Link`,
        fields: {
          externalId: {
            type: new GraphQLNonNull(GraphQLID),
          },
        },
      })
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
    // case 'EntityLinkField':
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

  const config = await entities.reduce(async (prevP, entity) => {
    const prev = await prevP
    const obj = new GraphQLObjectType({
      fields: entity.fields.reduce((prev, field) => {
        const baseType = fieldToOutputType(entity.name, field)
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
      resolve: async () => EntityEntry.find({}),
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
        const mappedStuff = Object.keys(input).reduce((prev, key) => ({
          ...prev,
          [key]: arrayFieldNames.has(key) ? (Array.isArray(input[key]) ? input[key] as readonly Record<string, unknown>[] : [input[key]] as readonly Record<string, unknown>[]).map((el) => ({
            ...el,
            __typename: capitalize(entity.name) + capitalize(key) + capitalize(Object.keys(el)[0]),
          })) : input[key],
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
    types: [],
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
