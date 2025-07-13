import { graphql } from '../graphql/client-generated'

export const CreateEntityMutation = graphql(`
  mutation CreateEntity($nameSingular: String!, $namePlural: String!) {
    createEntity(nameSingular: $nameSingular, namePlural: $namePlural) {
      nameSingular
      namePlural
    }
  }
`)

export const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($namePlural: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(namePlural: $namePlural, fields: $fields) {
      nameSingular
      namePlural
    }
  }
`)
