import { GraphQLError } from 'graphql'

import { Entity } from '../../clients/papr'

import type { EntitySchema } from '../../clients/papr'
import type {
  FieldInput,
  MutationResolvers,
} from '../schema.generated'

type Field = typeof EntitySchema[0]['fields'][0]

const mapInputToField = (input: FieldInput): Field => {
  const fieldConfig = ({
    ...input.NumberField,
    ...input.StringField,
    ...input.BooleanField,
    ...input.EntityRelationField,
    ...input.ArrayField,
    __typename: Object.keys(input)[0] as 'BooleanField' | 'StringField' | 'NumberField' | 'EntityRelationField' | 'ArrayField',
  })

  // @ts-expect-error fix sometime
  return {
    ...fieldConfig,
    isRequired: fieldConfig.isRequired ?? false,
    ...input.ArrayField ? { availableFields: input.ArrayField.availableFields.map(mapInputToField) } : {},
  }
}

const addFieldsToEntity: MutationResolvers['addFieldsToEntity'] = async (_, { entityName, fields: fieldsInput }, { pubsub }) => {
  const fields: readonly Field[] = fieldsInput.map(mapInputToField)

  const prev = await Entity.findOneAndUpdate({ name: entityName }, {
    $set: fields.reduce((acc, field) => ({
      ...acc,
      [`fields.${field.name}`]: field,
    }), {}),
  }, {
    upsert: true,
    returnDocument: 'after',
  })

  if (!prev) {
    throw new GraphQLError(`Entity with id ${entityName} not found`)
  }

  pubsub.publish('reload-schema', {})

  return { ...prev, fields: Object.values(prev.fields) }
}

export default addFieldsToEntity
