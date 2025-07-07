import type { Entity } from './getSelectionSet'

export const getDefaultValueFromEntityField = (
  field: Entity['fields'][number],
) => {
  if (field.__typename === 'ArrayField') {
    return []
  }
  if (field.__typename === 'StringField') {
    return field.defaultValueString ?? ''
  }
  if (field.__typename === 'NumberField') {
    return field.defaultValueNumber ?? 0
  }
  if (field.__typename === 'BooleanField') {
    return field.defaultValueBoolean ?? false
  }
  return null
}

export default getDefaultValueFromEntityField
