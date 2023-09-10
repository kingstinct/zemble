import { GraphQLError } from 'graphql'

import { Entity } from '../../clients/papr'

import type { EntitySchema } from '../../clients/papr'
import type {
  FieldInput,
  MutationResolvers,
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

const addFieldsToEntity: MutationResolvers['addFieldsToEntity'] = async (_, { entityName, fields: fieldsInput }, { pubsub }) => {
  // eslint-disable-next-line functional/prefer-readonly-type
  const fields: Field[] = fieldsInput.map(mapInputToField)

  const prev = await Entity.findOneAndUpdate({ name: entityName }, {
    $addToSet: {
      fields: { $each: fields },
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

export default addFieldsToEntity
