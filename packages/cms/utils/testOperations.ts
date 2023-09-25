import { graphql } from '../graphql/client.generated'

export const CreateEntityMutation = graphql(`
  mutation CreateEntity($name: String!, $pluralizedName: String!) {
    createEntity(name: $name, pluralizedName: $pluralizedName) {
      name
    }
  }
`)

export const AddFieldsToEntityMutation = graphql(`
  mutation AddFieldsToEntity($name: String!, $fields: [FieldInput!]!) {
    addFieldsToEntity(entityName: $name, fields: $fields) {
      name
    }
  }
`)
