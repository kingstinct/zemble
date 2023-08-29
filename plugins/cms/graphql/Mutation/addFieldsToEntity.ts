import { GraphQLError } from 'graphql'

import { EntityStore } from '../../utils'

import type {
  BooleanField,
  FieldInput,
  MutationResolvers,
  NumberField,
  StringField,
} from '../schema.generated'

const mapInputToField = (input: FieldInput): BooleanField | StringField | NumberField => {
  const hey = ({
    name: '',
    ...input.NumberField,
    ...input.StringField,
    ...input.BooleanField,
    __typename: Object.keys(input)[0] as 'BooleanField' | 'StringField' | 'NumberField',
  })

  // @ts-expect-error sdf
  return {
    ...hey,
    isRequired: hey.isRequired ?? false,
  }
}

const addFieldsToEntity: MutationResolvers['addFieldsToEntity'] = async (_, { entityName, fields }, { pubsub }) => {
  const prev = await EntityStore.get(entityName)

  if (!prev) {
    throw new GraphQLError(`Entity with id ${entityName} not found`)
  }

  const updated = {
    ...prev,
    fields: [
      ...prev.fields ?? [],
      ...fields.map(mapInputToField),
    ],
  }

  await EntityStore.set(entityName, updated)

  pubsub.publish('reload-schema', {})

  console.log('updated', updated)

  return updated
}

export default addFieldsToEntity
