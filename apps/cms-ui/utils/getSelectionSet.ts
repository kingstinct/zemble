import { capitalize } from './text'

type ArraySubFieldNameProps = {readonly entityName: string, readonly arrayFieldName: string, readonly subFieldName: string }

const ArraySubFieldName = ({
  entityName,
  arrayFieldName,
  subFieldName,
}: ArraySubFieldNameProps) => `${capitalize(entityName)}${capitalize(arrayFieldName)}${capitalize(subFieldName)}`.replaceAll(' ', '_')

export const getSelectionSet = (
  entityName: string,
  fields: readonly {
    readonly name: string,
    readonly __typename: string,
    readonly availableFields?: readonly {readonly name: string}[]
  }[],
) => {
  const selectionSet = fields.map((field) => (field.availableFields && field.availableFields.length > 0
    ? `${field.name} { ${field.availableFields.map((f) => {
      const fieldName = f.name.replaceAll(' ', '_')
      return `... on ${ArraySubFieldName({ arrayFieldName: field.name, entityName, subFieldName: f.name })} { ${fieldName} }`
    }).join(' ')} }`
    : field.name))

  return selectionSet
}

export default getSelectionSet
