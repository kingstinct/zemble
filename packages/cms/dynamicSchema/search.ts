import {
  GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLString,
} from 'graphql'

import papr, { } from '../clients/papr'

import type { EntityType } from '../clients/papr'
import type { GraphQLFieldConfig, GraphQLObjectType } from 'graphql'

const createSearch = (entity: EntityType, obj: GraphQLObjectType) => {
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
    }) => (await papr.contentCollection(entity.pluralizedName)).find({
      entityType: entity.name,
      $text: {
        $search: query,
        $caseSensitive: caseSensitive ?? false,
        $diacriticSensitive: diacriticSensitive ?? false,
        $language: language,
      },
    }),
  }

  return search
}

export default createSearch
