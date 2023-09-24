import { graphql } from '../graphql/client.generated'

export const CreateEntityMutation = graphql(`
  mutation CreateEntity($name: String!, $pluralizedName: String!) {
    createEntity(name: $name, pluralizedName: $pluralizedName) {
      name
    }
  }
`)
