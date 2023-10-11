import { GraphQLError } from 'graphql'

import papr from '../../clients/papr'

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
    isRequiredInput: fieldConfig.isRequiredInput ?? false,
    ...input.ArrayField ? {
      availableFields: input.ArrayField.availableFields.map(mapInputToField),
    } : {},
    ...input.StringField ? {
      isSearchable: fieldConfig.isSearchable ?? false,
    } : {},
  }
}

const addFieldsToEntity: MutationResolvers['addFieldsToEntity'] = async (_, { entityName, fields: fieldsInput }, { pubsub }) => {
  const fields: readonly Field[] = fieldsInput.map(mapInputToField)

  const entity = await papr.Entities.findOne({ name: entityName })

  if (!entity) {
    throw new GraphQLError(`Entity with name ${entityName} not found`)
  }

  const validateFields = async (fields: readonly Field[]) => {
    fields.forEach((field) => {
      const validRegex = /^[^-\s\d][^-\s]+$/
      const isValid = validRegex.test(field.name)
      if (!isValid) {
        throw new GraphQLError(`Field name "${field.name}" is invalid. It must not contain spaces or dashes, and cannot start with a number.`)
      }

      if (field.__typename === 'ArrayField') {
        field.availableFields.forEach((availableField) => {
          const isValid = validRegex.test(availableField.name)
          if (!isValid) {
            throw new GraphQLError(`Field name "${field.name}.${availableField.name}" is invalid. It must not contain spaces or dashes, and cannot start with a number.`)
          }
        })
      }
    })

    const all = fields.map((field) => {
      if (!field.isRequired) {
        return null
      }

      if ('defaultValue' in field && field.defaultValue !== undefined) {
        return null
      }

      return field.name
    })
    const fieldsRequiringValidation = all.filter(Boolean) as readonly string[]
    if (fieldsRequiringValidation.length > 1) {
      const failingDocs = await (await papr.contentCollection(entity.pluralizedName)).find(fieldsRequiringValidation.reduce((acc, fieldName) => ({
        ...acc,
        $or: [
          { [fieldName]: { $exists: false } },
          { [fieldName]: { $eq: null } },
        ],
      }), {}))

      const fieldsFailingValidation = fieldsRequiringValidation.filter((fieldName) => failingDocs.some((doc) => !doc[fieldName] && doc[fieldName] !== false))

      if (failingDocs.length > 0) {
        throw new GraphQLError(`Cannot require ${fieldsFailingValidation.join(', ')} on entity ${entityName}. Either provide a default value or add it without requiring these fields.`)
      }
    }
    return null
  }

  await validateFields(fields)

  const $set = fields.reduce((acc, field) => ({
    ...acc,
    [`fields.${field.name}`]: field,
  }), {})

  const prev = await papr.Entities.findOneAndUpdate({ name: entityName }, {
    $set,
  }, {
    returnDocument: 'after',
  })

  if (!prev) {
    throw new GraphQLError(`Entity with name ${entityName} not found`)
  }

  const searchableFields = Object.values(prev.fields).filter((field) => 'isSearchable' in field && field.isSearchable)

  const { db } = papr
  const collection = db!.collection(prev.pluralizedName)
  let hasIndex = false
  try {
    hasIndex = await collection.indexExists(`search_index`)
  } catch {
    // errors if collection hasnt been created yet
  }

  // seems to fail to add in tests if dropping index?
  if (hasIndex && process.env.NODE_ENV !== 'test') {
    await collection.dropIndex(`search_index`)
  }
  if (searchableFields.length > 0) {
    const index = searchableFields.reduce((acc, field) => ({
      ...acc,
      [field.name]: 'text',
    }), {})
    await collection.createIndex(index, {
      name: 'search_index',
    })
  }

  await pubsub.publish('reload-schema', {})

  return { ...prev, fields: Object.values(prev.fields) }
}

export default addFieldsToEntity
