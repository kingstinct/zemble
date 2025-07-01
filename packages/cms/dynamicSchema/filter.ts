import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql'
import { GraphQLID, GraphQLInputObjectType, GraphQLList, GraphQLNonNull } from 'graphql'
import papr from '../clients/papr'
import type { EntitySchemaType } from '../types'
import { capitalize } from '../utils'
import { fieldToInputType } from './utils'

const createFilterResolver = (entity: EntitySchemaType, obj: GraphQLObjectType) => {
  const args = entity.fields.reduce((prev, field) => {
    const baseType = fieldToInputType(entity.nameSingular, field)

    // todo [>1]: add support for array fields (need to map EntityRelationField to GraphQLID)
    if (field.__typename === 'ArrayField') {
      return prev
    }

    return {
      ...prev,
      [field.name]: {
        type: new GraphQLInputObjectType({
          name: `${capitalize(entity.nameSingular)}${capitalize(field.name)}Filter`,
          fields: {
            eq: {
              type: field.__typename === 'EntityRelationField' ? GraphQLID : baseType,
            },
            ...(field.__typename === 'NumberField'
              ? {
                  gt: { type: baseType },
                  gte: { type: baseType },
                  lt: { type: baseType },
                  lte: { type: baseType },
                }
              : {}),
          },
        }),
      },
    }
  }, {})

  const filter: GraphQLFieldConfig<unknown, unknown, Record<string, unknown>> = {
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(obj))),
    args,
    resolve: async (_, matchers) => {
      const filter = Object.entries(matchers).reduce(
        (prev, [key, value]) => ({
          ...prev,
          [key]: Object.entries(value as object).reduce(
            (prev, [op, val]) => ({
              ...prev,
              [`$${op}`]: val,
            }),
            {},
          ),
        }),
        {},
      )

      return (await papr.contentCollection(entity.namePlural)).find(filter)
    },
  }
  return filter
}

export default createFilterResolver
