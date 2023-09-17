import { GraphQLError } from 'graphql'

import { Entities } from '../../clients/papr'

import type { EntitySchema } from '../../clients/papr'
import type { MutationResolvers } from '../schema.generated'
import type { DocumentForInsert } from 'papr'

const getSingularName = (singular: string) => {
  const name = singular.trim()

  return name
}

const getPuralizedName = (singular: string, plural?: string | null) => {
  const name = plural ? plural.trim() : `${singular}s`

  return name
}

const createEntity: MutationResolvers['createEntity'] = async (_, { name: nameInput, pluralizedName: pluralIn }, { pubsub }) => {
  const name = getSingularName(nameInput)

  const pluralizedName = getPuralizedName(name, pluralIn)

  if (name.endsWith('s') && !pluralIn) {
    throw new GraphQLError('If entity name ends with "s", pluralized name must be explicitely provided')
  }

  const entity: DocumentForInsert<typeof EntitySchema[0], typeof EntitySchema[1]> = {
    name,
    pluralizedName,
    fields:
      {
        id: {
          __typename: 'IDField',
          isRequired: true,
          name: 'id',
        },
      },
  }

  const prev = await Entities.findOneAndUpdate({ name: entity.name }, {
    $set: {
      fields: entity.fields,
      name: entity.name,
      pluralizedName: entity.pluralizedName,
    },
  }, {
    upsert: true,
    returnDocument: 'after',
  })

  pubsub.publish('reload-schema', {})

  return { ...prev!, fields: Object.values(prev!.fields) }
}

export default createEntity
