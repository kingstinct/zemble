import { GraphQLError } from 'graphql'

import { Entity } from '../../clients/papr'

import type { EntitySchema } from '../../clients/papr'
import type {
  BooleanField,
  FieldInput,
  MutationResolvers,
  NumberField,
  StringField,
} from '../schema.generated'

type Field = typeof EntitySchema[0]['fields'][0]

const mapInputToField = (input: FieldInput): Field => {
  const hey = ({
    ...input.NumberField,
    ...input.StringField,
    ...input.BooleanField,
    __typename: Object.keys(input)[0] as 'BooleanField' | 'StringField' | 'NumberField',
  })

  // @ts-expect-error fix sometime
  return {
    ...hey,
    isRequired: hey.isRequired ?? false,
  }
}

const removeFieldsFromEntity: MutationResolvers['removeFieldsFromEntity'] = async (_, { entityName, fields }, { pubsub }) => {
  const prev = await Entity.findOneAndUpdate({ name: entityName }, {
    $pull: {
      fields: {
        name: { $in: fields },
      },
    },
  }, {
    upsert: true,
    returnDocument: 'after',
  })

  if (!prev) {
    throw new GraphQLError(`Entity with id ${entityName} not found`)
  }

  pubsub.publish('reload-schema', {})

  return prev
}

export default removeFieldsFromEntity
