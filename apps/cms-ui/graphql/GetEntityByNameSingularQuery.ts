import { graphql } from '../gql'

export const GetEntityByNameSingularQuery = graphql(`
  query GetEntityByNameSingular($name: String!) { getEntityByNameSingular(name: $name) { 
    nameSingular
    namePlural
    fields { 
      name
      __typename 
      isRequired
      isRequiredInput

      ... on EntityRelationField {
        entityNamePlural
      }

      ... on StringField {
        defaultValueString: defaultValue
        isSearchable
      }
      
      ... on NumberField {
        defaultValueNumber: defaultValue
      }
      
      ... on  BooleanField{
        defaultValueBoolean: defaultValue
      }
      ... on ArrayField {
        availableFields {
          name
          __typename
        }
      }
   } } }
`)

export default GetEntityByNameSingularQuery
