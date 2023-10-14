import {
  GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLString,
} from 'graphql'

import papr, { } from '../clients/papr'

import type { EntitySchemaType } from '../types'
import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql'

const createSearch = (entity: EntitySchemaType, obj: GraphQLObjectType) => {
  const search: GraphQLFieldConfig<unknown, unknown, {
    readonly query: string,
    readonly caseSensitive?: boolean,
    readonly diacriticSensitive?: boolean,
    readonly language?: string,
  }> = { // "books"
    type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(obj))),
    args: {
      query: { type: new GraphQLNonNull(GraphQLString) },
      caseSensitive: { type: GraphQLBoolean },
      diacriticSensitive: { type: GraphQLBoolean },
      language: { type: GraphQLString },
    },
    resolve: async (_, {
      query, caseSensitive, diacriticSensitive, language,
    }) => {
      const collection = await papr.contentCollection(entity.pluralizedName)

      const searchableFields = Object.values(entity.fields ?? []).filter((e) => e.__typename === 'StringField' && e.isSearchable)

      const $or = [
        ...searchableFields.map((s) => ({
          [s.name]: {
            $regex: `^${query}`,
            $options: 'i',
          },
        })),
        {
          $text: {
            $search: query,
            $caseSensitive: caseSensitive ?? false,
            $diacriticSensitive: diacriticSensitive ?? false,
            $language: language,
          },
        },
      ]

      return collection.find({
        // entityType: entity.name,
        $or,
      })
    },
  }

  return search
}

export default createSearch
