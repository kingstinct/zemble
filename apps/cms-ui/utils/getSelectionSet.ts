import type { GetEntityByNamePluralQuery } from '../gql.generated/graphql'
import { capitalize } from './text'

type ArraySubFieldNameProps = {
  readonly entityName: string
  readonly arrayFieldName: string
  readonly subFieldName: string
}

const ArraySubFieldName = ({
  entityName,
  arrayFieldName,
  subFieldName,
}: ArraySubFieldNameProps) =>
  `${capitalize(entityName)}${capitalize(arrayFieldName)}${capitalize(subFieldName)}`

export type Entity = NonNullable<
  GetEntityByNamePluralQuery['getEntityByNamePlural']
>

export const getSelectionSet = (entity: Entity) => {
  const selectionSet = entity.fields.map((field) => {
    if ('availableFields' in field && field.availableFields.length > 0) {
      return `${field.name} { ${field.availableFields
        .map((f) => {
          const fieldName = f.name
          return `... on ${ArraySubFieldName({
            arrayFieldName: field.name,
            entityName: entity.nameSingular,
            subFieldName: f.name,
          })} { ${f.__typename === 'EntityRelationField' ? `${fieldName} { __typename id displayName }` : fieldName} }`
        })
        .join(' ')} }`
    }
    if ('entityNamePlural' in field) {
      return `${field.name} { __typename id displayName }`
    }
    return field.name
  })
  return selectionSet
}

export default getSelectionSet
