/* eslint-disable functional/immutable-data */

import type { Entity } from '../utils/getSelectionSet'
import { capitalize } from '../utils/text'

const fieldToTypeMap: Record<
  string,
  string | ((entityName: string, fieldName: string) => string)
> = {
  StringField: 'String',
  NumberField: 'Float',
  BooleanField: 'Boolean',
  IDField: 'ID',
  ArrayField: (entityName: string, fieldName: string) =>
    `[${capitalize(entityName)}${capitalize(fieldName)}Input!]`,
  EntityRelationField: (entityName: string, fieldName: string) => `ID`,
}

const buildUpsertEntryMutation = (entity: Entity) => {
  const { fields } = entity

  const mutationName = `create${capitalize(entity.nameSingular)}`

  const mutationInputVariables = fields
    .map((f) => {
      const typeMap = fieldToTypeMap[f.__typename]!
      const mappedType =
        typeof typeMap === 'string'
          ? typeMap
          : typeMap(entity.nameSingular, f.name)
      const strParts = `$${f.name}: ${mappedType}${f.isRequired && f.name !== 'id' ? '!' : ''}`
      return strParts
    })
    .join(', ')

  const mutationVariables = fields
    .map((f) => `${f.name}: $${f.name}`)
    .join(', ')

  const upsertEntryStr = `mutation UpsertEntry(${mutationInputVariables}) 
  { ${mutationName}(${mutationVariables})
    { 
      __typename
      id 
    } 
  }`

  return upsertEntryStr
}
export default buildUpsertEntryMutation
