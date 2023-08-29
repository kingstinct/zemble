/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLFloat, GraphQLBoolean, GraphQLInterfaceType, GraphQLUnionType,
} from 'graphql'

import {
  EntityEntryStore, EntityStore, capitalize, pluralize,
} from './utils'

import type {
  BooleanField, LinkField, NumberField, RepeaterField, StringField,
} from './graphql/schema.generated'
import type { GraphQLFieldConfig, GraphQLType } from 'graphql'

type ReducerType = {
  readonly query: Record<string, GraphQLFieldConfig<any, any, any>>,
  readonly types: readonly GraphQLObjectType<any, any>[],
  readonly mutations: Record<string, GraphQLFieldConfig<any, any, any>>,
}

type IField = NumberField | StringField | BooleanField // | RepeaterField | LinkField

const fieldToType = (field: IField): GraphQLType => {
  // eslint-disable-next-line no-nested-ternary, unicorn/no-nested-ternary
  // const baseType = field.__typename === 'NumberField' ? GraphQLFloat : (field.__typename === 'BooleanField' ?
  // GraphQLBoolean : field.__typename === 'RepeaterField' ? new GraphQLList(field.availableFields.map(fieldToType)) :
  // GraphQLString)
  switch (field.__typename) {
    case 'NumberField':
      return GraphQLFloat
    case 'BooleanField':
      return GraphQLBoolean
      // case 'RepeaterField':
      //   // eslint-disable-next-line no-case-declarations
      //   const availableFields = field.availableFields.map((a) => new GraphQLObjectType({
      //     name: `${capitalize(field.name)}${capitalize(a.name)}`,
      //     fields: {

    //       [a.name]: {
    //         type: fieldToType(a),
    //       },
    //     }
    //   }))
    //   return new GraphQLList(new GraphQLUnionType({
    //     name: `${capitalize(field.name)}Union`,
    //     types: availableFields,
    //   }))
    default:
      return GraphQLString
  }
}

export default async () => {
  const entities = await EntityStore.values()

  const config = await entities.reduce(async (prevP, entity) => {
    const prev = await prevP
    const obj = new GraphQLObjectType({
      fields: entity.fields.reduce((prev, field: IField) => {
        // eslint-disable-next-line no-nested-ternary
        const baseType = field.__typename === 'NumberField' ? GraphQLFloat : (field.__typename === 'BooleanField' ? GraphQLBoolean : /* field.__typename === 'RepeaterField' ? GraphQLList(field.availableFields.map(fieldToType)) : */ GraphQLString)
        return ({
          ...prev,
          [field.name]: {
            type: field.isRequired ? new GraphQLNonNull(baseType) : baseType,
          },
        })
      }, {}),
      name: capitalize(entity.name),
    })

    const inputObj = new GraphQLInputObjectType({
      fields: entity.fields.reduce((prev, field) => {
        // @ts-expect-error type it up
        // eslint-disable-next-line no-nested-ternary
        const baseType = field.__typename === 'NumberField' ? GraphQLFloat : (field.__typename === 'BooleanField' ? GraphQLBoolean : GraphQLString)
        return ({
          ...prev,
          [field.name]: {
            type: field.isRequired ? new GraphQLNonNull(baseType) : baseType,
          },
        })
      }, {}),
      name: `${capitalize(entity.name)}Input`,
    })

    const entryStore = EntityEntryStore(entity.name)

    const getById: GraphQLFieldConfig<unknown, unknown, {readonly id: string}> = { // "book"
      type: new GraphQLNonNull(obj),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (_, { id }) => entryStore.get(id),
    } as const

    const retVal: ReducerType = {
      query: {
        ...prev.query,
        [pluralize(entity.name)]: { // "books"
          type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(obj))),
          resolve: async () => entryStore.values(),
        },
        [entity.name]: getById,
      },
      types: [...prev.types],
      mutations: {
        ...prev.mutations,
        [`create${capitalize(entity.name)}`]: {
          type: obj,
          args: {
            input: {
              type: new GraphQLNonNull(inputObj),
            },
          },
          resolve: async (_, { input }) => {
            const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            await entryStore.set(id, input)
            return input
          },
        },
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
