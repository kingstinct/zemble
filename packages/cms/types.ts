type StringFieldObject = {
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly isSearchable: boolean
  readonly maxLength?: number | null
  readonly minLength?: number | null
  readonly defaultValue?: null | string
  readonly __typename: 'StringField'
}

type BooleanFieldObject = {
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly defaultValue?: boolean | null
  readonly __typename: 'BooleanField'
}

type NumberFieldObject = {
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly defaultValue?: number | null
  readonly max?: number | null
  readonly min?: number | null
  readonly __typename: 'NumberField'
}

type IdField = {
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly __typename: 'IDField'
}

export type EntityRelationObject = {
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly entityNamePlural: string
  readonly __typename: 'EntityRelationField'
}

export type AnyFieldsInArray = NumberFieldObject | BooleanFieldObject | StringFieldObject | EntityRelationObject

export type ArrayFieldObject = {
  readonly name: string
  readonly isRequired: boolean
  readonly isRequiredInput: boolean
  readonly maxItems?: number | null
  readonly minItems?: number | null
  readonly availableFields: readonly AnyFieldsInArray[]
  readonly __typename: 'ArrayField'
}

export type AnyField = IdField | NumberFieldObject | BooleanFieldObject | StringFieldObject | ArrayFieldObject | EntityRelationObject

export type EntitySchemaType = {
  readonly nameSingular: string
  readonly namePlural: string
  readonly fields: readonly AnyField[]
  readonly isPublishable: boolean
  readonly displayNameField?: string
}

export type CmsConfigFile = { readonly entities: readonly EntitySchemaType[] }
